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
function _select() {
	var self = this,
		sel = self.sel,
		range = self.range,
		sc = range.startContainer, so = range.startOffset,
		ec = range.endContainer, eo = range.endOffset,
		doc = sc.ownerDocument || sc, win = _getWin(doc), rng;
	//case 1: tag内部无内容时选中tag内部，比如：<tagName>[]</tagName>
	if (_IE && sc.nodeType == 1 && range.collapsed) {
		var empty = _node('<span>&nbsp;</span>', doc);
		range.insertNode(empty.get());
		rng = doc.body.createTextRange();
		rng.moveToElementText(empty.get());
		rng.collapse(false);
		rng.select();
		empty.remove();
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
//判断一个node是否有指定属性或CSS
function _hasAttrOrCss(knode, map) {
	return _hasAttrOrCssByKey(knode, map, '*') || _hasAttrOrCssByKey(knode, map);
}
function _hasAttrOrCssByKey(knode, map, mapKey) {
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
//删除一个node的属性和CSS
function _removeAttrOrCss(knode, map) {
	_removeAttrOrCssByKey(knode, map, '*');
	_removeAttrOrCssByKey(knode, map);
}
function _removeAttrOrCssByKey(knode, map, mapKey) {
	mapKey = mapKey || knode.name;
	if (knode.type !== 1) {
		return;
	}
	var newMap = _singleKeyMap(map), arr, val;
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		allFlag = false;
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
			if (knode.first()) {
				var kchild = knode.first();
				while (kchild) {
					var next = kchild.next();
					knode.before(kchild);
					kchild = next;
				}
			}
			knode.remove();
		}
	}
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
		if (_hasAttrOrCss(_node(node), map)) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
}
// 根据规则分割range的开始节点或结束节点
function _splitStartEnd(range, isStart, map) {
	var doc = range.doc,
		sc = range.startContainer, so = range.startOffset,
		ec = range.endContainer, eo = range.endOffset;
	//get parent node
	var tempRange = range.cloneRange().collapse(isStart);
	var node = tempRange.startContainer, pos = tempRange.startOffset,
		parent = node.nodeType == 3 ? node.parentNode : node,
		needSplit = false;
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
	//split parent node
	if (needSplit) {
		var mark = doc.createElement('span');
		range.cloneRange().collapse(!isStart).insertNode(mark);
		if (isStart) {
			tempRange.setStartBefore(parent.firstChild).setEnd(node, pos);
		} else {
			tempRange.setStart(node, pos).setEndAfter(parent.lastChild);
		}
		var frag = tempRange.extractContents(),
			first = frag.firstChild, last = frag.lastChild;
		if (isStart) {
			tempRange.insertNode(frag);
			range.setStartAfter(last).setEndBefore(mark);
		} else {
			parent.appendChild(frag);
			range.setStartBefore(mark).setEndBefore(first);
		}
		var markParent = mark.parentNode;
		markParent.removeChild(mark);
		if (!isStart && markParent === range.endContainer) {
			range.setEnd(range.endContainer, range.endOffset - 1);
		}
	}
}

/**
	@name KindEditor.cmd
	@class KCmd类
	@param {document|KRange} mixed document or KRange
	@description
	KCmd类，控制可视化编辑区域的HTML。
	@example
	K.cmd(document).bold();
	K.cmd(document).wrap('<span style="color:red;"></span>');
	K.cmd(document).remove({
		span : '*',
		div : 'class,border'
	});
*/
function KCmd(range) {
	var self = this;
	//document object
	self.doc = range.doc;
	//window object
	self.win = _getWin(self.doc);
	//native selection
	self.sel = _getSel(self.doc);
	//KRange
	self.range = range;
}

KCmd.prototype = {
	wrap : function(val) {
		var self = this, doc = self.doc, range = self.range,
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset,
			wrapper = _node(val, doc);
		//非inline标签
		if (!wrapper.isInline()) {
			range.surroundContents(wrapper.clone(false).get());
			return _select.call(this);
		}
		//inline标签，collapsed = true
		if (range.collapsed) {
			var el = wrapper.clone(false).get();
			range.insertNode(el);
			range.selectNodeContents(el);
			return _select.call(this);
		}
		//inline标签，collapsed = false
		var name = wrapper.name,
			attrs = wrapper.attr(),
			styles = wrapper.css();
		function mergeAttrs(knode) {
			_each(attrs, function(key, val) {
				if (key !== 'style') {
					knode.attr(key, val);
				}
			});
			_each(styles, function(key, val) {
				knode.css(key, val);
			});
		}
		function wrapTextNode(node, startOffset, endOffset) {
			var length = node.nodeValue.length, center = node, el = wrapper.clone(false).get();
			if (endOffset <= startOffset) {
				return;
			}
			if (startOffset > 0) {
				center = node.splitText(startOffset);
			}
			if (endOffset < length) {
				center.splitText(endOffset - startOffset);
			}
			var kparent = _node(node.parentNode);
			if (center === node && kparent.name === name) {
				mergeAttrs(kparent);
			} else {
				center.parentNode.insertBefore(el, center);
				el.appendChild(center);
				if (sc === node) {
					range.setStartBefore(el);
				}
				if (ec === node) {
					range.setEndAfter(el);
				}
			}
		}
		function wrapRange(parent) {
			var node = parent.firstChild;
			if (parent.nodeType == 3) {
				wrapTextNode(parent, so, eo);
				return false;
			}
			var testRange, nextNode, knode;
			while (node) {
				testRange = _range(doc);
				testRange.selectNode(node);
				if (testRange.compareBoundaryPoints(_END_TO_START, range) >= 0) {
					return false;
				}
				nextNode = node.nextSibling;
				if (testRange.compareBoundaryPoints(_START_TO_END, range) > 0) {
					if (node.nodeType == 1) {
						knode = _node(node);
						if (testRange.compareBoundaryPoints(_START_TO_START, range) >= 0 &&
							testRange.compareBoundaryPoints(_END_TO_END, range) <= 0 &&
							knode.name === name) {
							mergeAttrs(knode);
						} else {
							if (wrapRange(node) === false) {
								return false;
							}
						}
					} else if (node.nodeType == 3) {
						if (node == sc && node == ec) {
							wrapTextNode(node, so, eo);
						} else if (node == sc) {
							wrapTextNode(node, so, node.nodeValue.length);
						} else if (node == ec) {
							wrapTextNode(node, 0, eo);
						} else {
							wrapTextNode(node, 0, node.nodeValue.length);
						}
					}
				}
				node = nextNode;
			}
		}
		wrapRange(range.commonAncestorContainer);
		return _select.call(this);
	},
	remove : function(map) {
		var self = this, doc = self.doc, range = self.range, collapsed = range.collapsed;
		_splitStartEnd(range, true, map);
		_splitStartEnd(range, false, map);
		var nodeList = [];
		_node(range.commonAncestorContainer).each(function(knode) {
			var testRange = _range(doc);
			testRange.selectNode(knode.get());
			if (testRange.compareBoundaryPoints(_END_TO_START, range) >= 0) {
				return false;
			}
			if (testRange.compareBoundaryPoints(_START_TO_START, range) >= 0) {
				nodeList.push(knode);
			}
		});
		var sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		if (so > 0) {
			var before = _node(sc.childNodes[so - 1]);
			if (before && _hasAttrOrCss(before, map) && /<([^>]+)><\/\1>/.test(before.html())) {
				before.remove();
				range.setStart(sc, so - 1);
				range.setEnd(ec, eo - 1);
			}
		}
		var after = _node(ec.childNodes[range.endOffset]);
		if (after && _hasAttrOrCss(after, map) && /<([^>]+)><\/\1>/.test(after.html())) {
			after.remove();
		}
		_each(nodeList, function() {
			_removeAttrOrCss(this, map);
		});
		if (collapsed) {
			range.collapse(true);
		}
		return _select.call(this);
	},
	//Reference: document.execCommand
	exec : function(cmd, val) {
		return this[cmd.toLowerCase()](val);
	},
	//Reference: document.queryCommandState
	state : function(cmd) {
		var bool = false;
		try {
			bool = this.doc.queryCommandState(cmd);
		} catch (e) {}
		return bool;
	},
	//Reference: document.queryCommandValue
	val : function(cmd) {
		var self = this, doc = self.doc, range = self.range;
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

function _cmd(mixed) {
	//get selection and original range when mixed is a document or a node
	if (mixed.nodeName) {
		var doc = mixed.ownerDocument || mixed,
			sel = _getSel(doc), rng;
		try {
			if (sel.rangeCount > 0) {
				rng = sel.getRangeAt(0);
			} else {
				rng = sel.createRange();
			}
		} catch(e) {}
		rng = rng || doc;
		if (_IE && (!rng || rng.parentElement().ownerDocument !== doc)) {
			return null;
		}
		return new KCmd(_range(rng));
	}
	//get selection and original range when mixed is KRange
	return new KCmd(mixed);
}

K.cmd = _cmd;
