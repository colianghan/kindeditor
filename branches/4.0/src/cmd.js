/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name cmd.js
 * @fileOverview 编辑命令集合，可代替execCommand、queryCommandState、queryCommandValue
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "html.js"
#using "selector.js"
#using "node.js"
#using "range.js"
*/

//original queryCommandValue
function _nativeCommandValue(doc, cmd) {
	var val = '';
	try {
		val = doc.queryCommandValue(cmd);
	} catch (e) {}
	if (typeof val !== 'string') {
		val = '';
	}
	return val;
}
//get window by document
function _getWin(doc) {
	return doc.parentWindow || doc.defaultView;
}
//get current selection of a document
function _getSel(doc) {
	var win = _getWin(doc);
	return win.getSelection ? win.getSelection() : doc.selection;
}
//add KRange to the selection
function _select(sel, range) {
	var sc = range.startContainer, so = range.startOffset,
		ec = range.endContainer, eo = range.endOffset,
		doc = sc.ownerDocument || sc, win = _getWin(doc), rng;
	this.range = range;
	//case 1: tag内部无内容时选中tag内部，比如：<tagName>[]</tagName>，IE专用
	//Webkit和Opera这个方法没有效果，需要研究
	if (_IE && sc.nodeType == 1 && range.collapsed) {
		var empty = doc.createTextNode(' ');
		ec.appendChild(empty);
		rng = doc.body.createTextRange();
		rng.moveToElementText(ec);
		rng.collapse(false);
		rng.select();
		ec.removeChild(empty);
		win.focus();
		return this;
	}
	//case 2: 一般情况
	rng = range.get();
	if (_IE) {
		rng.select();
	} else {
		sel.removeAllRanges();
		sel.addRange(rng);
	}
	win.focus();
	return this;
}
//将map的复合key转换成单一key
function _singleKeyMap(map) {
	var newMap = {}, arr, v;
	_each(map, function(key, val) {
		arr = key.split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			v = arr[i];
			newMap[v] = val;
		}
	});
	return newMap;
}
//删除父节点
function _removeParent(parent) {
	if (parent.firstChild) {
		var node = parent.firstChild;
		while (node) {
			var nextNode = node.nextSibling;
			parent.parentNode.insertBefore(node, parent);
			node = nextNode;
		}
	}
	parent.parentNode.removeChild(parent);
}
//判断一个node是否有指定属性或CSS
function _hasAttrOrCss(knode, map, mapKey) {
	mapKey = mapKey || knode.name;
	if (knode.type !== 1) {
		return false;
	}
	var newMap = _singleKeyMap(map), arr, val;
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			val = arr[i];
			if (val === '*') {
				return true;
			}
			if (val.charAt(0) === '.' && knode.css(val.substr(1)) !== '') {
				return true;
			}
			if (val.charAt(0) !== '.' && knode.attr(val) !== '') {
				return true;
			}
		}
	}
	return false;
}
/**
	根据规则取得range的共通祖先
	example:
	_getCommonNode(range, {
		'*' : '.font-weight',
		'strong,b' : '*'
	});
*/
function _getCommonNode(range, map) {
	var node = range.commonAncestorContainer;
	while (node) {
		var knode = _node(node);
		if (_hasAttrOrCss(knode, map, '*')) {
			return node;
		}
		if (_hasAttrOrCss(knode, map)) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
}
// 根据规则分割range的开始节点或结束节点
function _splitStartEnd(range, isStart, map) {
	var rng = range.cloneRange(),
		sc = rng.startContainer, so = rng.startOffset,
		doc = sc.ownerDocument || sc;
	//插入标记
	var mark;
	if (isStart) {
		var cloneRange = rng.cloneRange();
		mark = _node('<span id="__ke_temp_mark__"></span>');
		cloneRange.collapse(false);
		cloneRange.insertNode(mark.get());
	}
	//取得parent
	rng.collapse(isStart);
	var node = rng.startContainer, pos = rng.startOffset,
		parent = node.nodeType == 3 ? node.parentNode : node, needSplit = false;
	while (parent && parent.parentNode) {
		var knode = _node(parent);
		if (!knode.isInline()) {
			break;
		}
		if (!_hasAttrOrCss(knode, map, '*') && !_hasAttrOrCss(knode, map)) {
			break;
		}
		needSplit = true;
		parent = parent.parentNode;
	}
	var result;
	//需要分割
	if (needSplit) {
		//分割parent
		var newRange = _range(doc);
		if (isStart) {
			newRange.setStartBefore(parent.firstChild);
			newRange.setEnd(node, pos);
			var frag = newRange.extractContents();
			newRange.insertNode(frag);
		} else {
			newRange.setStart(node, pos);
			newRange.setEndAfter(parent.lastChild);
			var frag = newRange.extractContents();
			parent.appendChild(frag);
		}
		//根据标记重新设置range
		if (isStart) {
			mark = _node('#__ke_temp_mark__');
			rng = _range(doc);
			rng.setStart(newRange.endContainer, newRange.endOffset);
			rng.setEndBefore(mark.get());
			mark.remove();
		} else {
			rng.setStart(sc, so);
			rng.setEnd(newRange.startContainer, newRange.startOffset);
		}
		result = [newRange, rng];
	} else {
		mark = _node('#__ke_temp_mark__');
		if (mark) mark.remove();
	}
	return result;
}

/**
	@name KindEditor.cmd
	@class Command类
	@param {document|KRange} mixed document或KRange
	@description
	Command类，控制可视化编辑区域的HTML。
	@example
	K.cmd(document).bold();
	K.cmd(document).wrap('<span style="color:red;"></span>');
	K.cmd(document).remove({
		span : '*',
		div : 'class,border'
	});
*/
function _cmd(mixed) {
	var win, doc, sel, rng, range;
	if (mixed.nodeName) {
		//get selection and original range when mixed is a document or a node
		doc = mixed.ownerDocument || mixed;
		sel = _getSel(doc);
		try {
			if (sel.rangeCount > 0) {
				rng = sel.getRangeAt(0);
			} else {
				rng = sel.createRange();
			}
		} catch(e) {}
		mixed = rng || doc;
		if (_IE && (!rng || rng.parentElement().ownerDocument !== doc)) {
			return null;
		}
	} else {
		//get selection and original range when mixed is KRange
		var startContainer = mixed.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		sel = _getSel(doc);
		rng = mixed.get();
	}
	win = _getWin(doc);
	range = _range(mixed);
	//create KRange object
	return {
		range : range,
		wrap : function(val) {
			var wrapper = _node(val, doc), clone;
			//非inline标签
			if (!wrapper.isInline()) {
				clone = wrapper.clone(false);
				range.surroundContents(clone.get());
				return _select.call(this, sel, range);
			}
			//inline标签，collapsed = true
			if (range.collapsed) {
				clone = wrapper.clone(false);
				range.insertNode(clone.get());
				range.selectNodeContents(clone.get());
				return _select.call(this, sel, range);
			}
			//inline标签，collapsed = false
			var frag = range.extractContents(),
				name = wrapper.name;
			_node(frag).each(function(knode) {
				if (knode.type == 3 && knode.parent().name !== name) {
					clone = wrapper.clone(false);
					clone.append(knode.clone(true));
					knode.replaceWith(clone);
				} else if (knode.name === name) {
					_each(wrapper.attr(), function(key, val) {
						if (key !== 'style') {
							knode.attr(key, val);
						}
					});
					_each(wrapper.css(), function(key, val) {
						knode.css(key, val);
					});
				}
			});
			range.insertNode(frag);
			return _select.call(this, sel, range);
		},
		remove : function(map) {
			//collapsed = true
			if (range.collapsed) {
				return this;
			}
			//collapsed = false
			var rangeA = _splitStartEnd(range, true, map);
			var rangeB = _splitStartEnd(rangeA ? rangeA[1] : range, false, map);
			range = rangeB ? rangeB[1] : range;
			//删除一个node的属性和CSS
			function removeAttrOrCss(knode, map, mapKey) {
				mapKey = mapKey || knode.name;
				if (knode.type !== 1) {
					return;
				}
				var newMap = _singleKeyMap(map), arr, val;
				if (newMap[mapKey]) {
					arr = newMap[mapKey].split(','), allFlag = false;
					for (var i = 0, len = arr.length; i < len; i++) {
						val = arr[i];
						if (val === '*') {
							allFlag = true;
							break;
						}
						if (val.charAt(0) === '.') {
							knode.css(val.substr(1), '');
						} else {
							knode.removeAttr(val);
						}
					}
					if (allFlag) {
						var parent = knode.get(),
							sc = range.startContainer, so = range.startOffset,
							ec = range.endContainer, eo = range.endOffset;
						//range的开始节点和结束节点是要删除的节点，所以要保存range的开始位置和结束位置
						var startMark = _node('<span id="__ke_temp_start__">'),
							endMark = _node('<span id="__ke_temp_end__">');
						range.insertNode(startMark.get());
						range.collapse(false);
						range.insertNode(endMark.get());
						//删除节点
						_removeParent(parent);
						//重新设置range
						startMark = _node('#__ke_temp_start__');
						endMark = _node('#__ke_temp_end__');
						range = _range(doc);
						range.setStartAfter(startMark.get());
						range.setEndBefore(endMark.get());
						range.setStart(range.startContainer, range.startOffset - 1);
						if (range.startContainer == range.endContainer) {
							range.setEnd(range.endContainer, range.endOffset - 1);
						}
						startMark.remove();
						endMark.remove();
					}
				}
			}
			_node(range.commonAncestorContainer).each(function(knode) {
				var testRange = _range(doc);
				testRange.selectNode(knode.get());
				if (testRange.compareBoundaryPoints(_END_TO_START, range) >= 0) {
					return false;
				}
				if (testRange.compareBoundaryPoints(_START_TO_START, range) >= 0) {
					removeAttrOrCss(knode, map, '*');
					removeAttrOrCss(knode, map);
				}
			});
			return _select.call(this, sel, range);
		},
		//Reference: document.execCommand
		exec : function(cmd, val) {
			return this[cmd.toLowerCase()](val);
		},
		//Reference: document.queryCommandState
		state : function(cmd) {
			var bool = false;
			try {
				bool = doc.queryCommandState(cmd);
			} catch (e) {}
			return bool;
		},
		//Reference: document.queryCommandValue
		val : function(cmd) {
			function lc(val) {
				return val.toLowerCase();
			}
			cmd = lc(cmd);
			var val = '', el;
			if (cmd === 'fontfamily' || cmd === 'fontname') {
				val = _nativeCommandValue(doc, 'fontname');
				val = val.replace(/['"]/g, '');
				return lc(val);
			}
			if (cmd === 'formatblock') {
				val = _nativeCommandValue(doc, cmd);
				if (val === '') {
					el = _getCommonNode(range, {'h1,h2,h3,h4,h5,h6,p,div,pre,address' : '*'});
					if (el) {
						val = el.nodeName;
					}
				}
				if (val === 'Normal') {
					val = 'p';
				}
				return lc(val);
			}
			if (cmd === 'fontsize') {
				el = _getCommonNode(range, {'*' : '.font-size'});
				if (el) {
					val = _node(el).css('font-size');
				}
				return lc(val);
			}
			if (cmd === 'forecolor') {
				el = _getCommonNode(range, {'*' : '.color'});
				if (el) {
					val = _node(el).css('color');
				}
				val = _toHex(val);
				if (val === '') {
					val = 'default';
				}
				return lc(val);
			}
			if (cmd === 'hilitecolor') {
				el = _getCommonNode(range, {'*' : '.background-color'});
				val = _toHex(val);
				if (val === '') {
					val = 'default';
				}
				return lc(val);
			}
			return val;
		},
		bold : function() {
			return this.wrap('<strong></strong>');
		},
		italic : function() {
			return this.wrap('<em></em>');
		},
		forecolor : function(val) {
			return this.wrap('<span style="color:' + val + ';"></span>');
		},
		hilitecolor : function(val) {
			return this.wrap('<span style="background-color:' + val + ';"></span>');
		},
		fontsize : function(val) {
			return this.wrap('<span style="font-size:' + val + ';"></span>');
		},
		fontname : function(val) {
			return this.fontfamily(val);
		},
		fontfamily : function(val) {
			return this.wrap('<span style="font-family:' + val + ';"></span>');
		},
		removeformat : function() {
			var map = {
				'*' : 'class,style'
			},
			tags = _INLINE_TAG_MAP;
			_each(tags, function(key, val) {
				map[key] = '*';
			});
			return this.remove(map);
		}
	};
}

K.cmd = _cmd;
