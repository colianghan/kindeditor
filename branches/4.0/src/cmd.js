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
		return;
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
}
//判断一个node是否有指定属性或CSS
function _hasAttrOrCss(node, map, mapKey) {
	var knode = _node(node), arr, newMap = {};
	mapKey = mapKey || knode.name;
	if (knode.type !== 1) {
		return false;
	}
	_each(map, function(key, val) {
		arr = key.split(',');
		for (var i = 0, len = arr.length, v = arr[i]; i < len; i++) {
			newMap[v] = val;
		}
	});
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		for (var i = 0, len = arr.length, val = arr[i]; i < len; i++) {
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
	var node = range.commonAncestorContainer, knode, arr;
	while (node) {
		if (_hasAttrOrCss(node, map, '*')) {
			return node;
		}
		if (_hasAttrOrCss(node, map)) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
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
	var sel, doc, rng;
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
	var win = _getWin(doc),
		range = _range(mixed);
	//create KRange object
	return {
		wrap : function(val) {
			var wrapper = _node(val, doc), clone;
			//非inline标签
			if (!wrapper.isInline()) {
				clone = wrapper.clone(false);
				range.surroundContents(clone.get());
				_select(sel, range);
				return this;
			}
			//inline标签，collapsed = true
			if (range.collapsed) {
				clone = wrapper.clone(false);
				range.insertNode(clone.get());
				range.selectNodeContents(clone.get());
				_select(sel, range);
				return this;
			}
			//inline标签，collapsed = false
			var frag = range.extractContents(),
				name = wrapper.name;
			_node(frag).each(function(node) {
				if (node.type == 3 && node.parent().name !== name) {
					clone = wrapper.clone(false);
					clone.append(node.clone(true));
					node.replaceWith(clone);
				} else if (node.name === name) {
					_each(wrapper.attr(), function(key, val) {
						if (key !== 'style') {
							node.attr(key, val);
						}
					});
					_each(wrapper.css(), function(key, val) {
						node.css(key, val);
					});
				}
			});
			range.insertNode(frag);
			_select(sel, range);
			return this;
		},
		remove : function(map) {
			//collapsed = true
			if (range.collapsed) {
				return this;
			}
			//collapsed = false
			var frag = range.extractContents(),
				name = wrapper.name;
			_node(frag).each(function(node) {
				if (node.type == 3 && node.parent().name !== name) {
					var clone = wrapper.clone(false);
					clone.append(node.clone(true));
					node.replaceWith(clone);
				} else if (node.name === name) {
					_each(wrapper.attr(), function(key, val) {
						if (key !== 'style') {
							node.attr(key, val);
						}
					});
					_each(wrapper.css(), function(key, val) {
						node.css(key, val);
					});
				}
			});
			range.insertNode(frag);
			_select(sel, range);
			return this;
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
			var options = {
				'*' : 'class,style'
			},
			tags = _INLINE_TAGS.split(',');
			_each(tags, function(key, val) {
				options[val] = '*';
			});
			this.remove(options);
			return this;
		}
	};
}

K.cmd = _cmd;
