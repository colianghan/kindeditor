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
#using "event.js"
#using "html.js"
#using "selector.js"
#using "node.js"
#using "range.js"
*/

/**
DOM_VK_BACK_SPACE : 8
DOM_VK_TAB : 9
DOM_VK_RETURN : 13
DOM_VK_SPACE : 32
DOM_VK_PAGE_UP : 33
DOM_VK_PAGE_DOWN : 34
DOM_VK_END : 35
DOM_VK_HOME : 36
DOM_VK_LEFT : 37
DOM_VK_UP : 38
DOM_VK_RIGHT : 39
DOM_VK_DOWN : 40
DOM_VK_DELETE : 46
DOM_VK_0 ~ DOM_VK_9 : 48 ~ 57
DOM_VK_SEMICOLON : 59 (;:)
DOM_VK_EQUALS : 61 (=+) (+)
DOM_VK_A ~ DOM_VK_Z : 65 ~ 90
DOM_VK_MULTIPLY : 106 (*)
DOM_VK_SUBTRACT : 109 (-_) (-)
DOM_VK_DECIMAL : 110 (.)
DOM_VK_DIVIDE : 111 (/)
DOM_VK_COMMA : 188 (,<)
DOM_VK_PERIOD : 190 (.>)
DOM_VK_SLASH : 191 (/?)
DOM_VK_BACK_QUOTE : 192 (`~)
DOM_VK_OPEN_BRACKET : 219 ([{)
DOM_VK_BACK_SLASH : 220 (\|)
DOM_VK_CLOSE_BRACKET : 221 (]})
DOM_VK_QUOTE : 222 ('")

详细请参考 event.js
*/
//输入文字的键值
var _INPUT_KEY_MAP = _toMap('9,32,48..57,59,61,65..90,109..111,188,190..192,219..222');
//输入文字或移动光标的键值
var _CHANGE_KEY_MAP = _toMap('8,9,13,32..40,46,48..57,59,61,65..90,106,109..111,188,190..192,219..222');

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
//get range of current selection
function _getRng(doc) {
	var sel = _getSel(doc), rng;
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
	return rng;
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
//wrap and merge a node
function _wrapAndMergeNode(knode, wrapper) {
	var w = wrapper.clone(true), c = w, parent = knode;
	//node为唯一的子节点时重新设置node
	while (knode.parent() && knode.parent().isInline() && knode.parent().children().length == 1) {
		knode = knode.parent();
	}
	//node为text node时
	if (knode.type == 3) {
		while (c.first()) {
			c = c.first();
		}
		knode.before(w);
		c.append(knode);
		return w;
	}
	//node为element时
	var nodeList = []; //没有合并的node
	while (c) {
		if (c.name === knode.name) {
			_mergeAttrs(knode, c.attr(), c.css());
		} else {
			nodeList.push(c);
		}
		c = c.first();
	}
	//node全部合并，没有剩下的node
	if (nodeList.length === 0) {
		return knode;
	}
	//有没有合并的node
	//将node的子节点纳入在一个documentFragment里
	var child, next, frag = knode.doc.createDocumentFragment();
	while ((child = knode.first())) {
		next = child.next();
		frag.appendChild(child.get());
		child = next;
	}
	var last;
	_each(nodeList, function() {
		knode.append(this);
		last = this;
	});
	last.append(frag);
	return knode;
}
//merge attributes and styles
function _mergeAttrs(knode, attrs, styles) {
	_each(attrs, function(key, val) {
		if (key !== 'style') {
			knode.attr(key, val);
		}
	});
	_each(styles, function(key, val) {
		knode.css(key, val);
	});
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
	//public
	self.doc = range.doc;
	self.win = _getWin(self.doc);
	self.sel = _getSel(self.doc);
	self.range = range;
	//private
	self._preformat = null;
	self._onchangeHandlers = [];
}

KCmd.prototype = {
	wrap : function(val) {
		var self = this, doc = self.doc, range = self.range, wrapper,
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		//val为HTML
		if (typeof val == 'string') {
			wrapper = _node(val, doc);
		//val为KNode
		} else {
			wrapper = val;
		}
		//inline标签，collapsed = true
		if (range.collapsed) {
			//存在以前格式时合并两个wrapper
			if (self._preformat) {
				var prevWrapper = self._preformat.wrapper;
				wrapper = _wrapAndMergeNode(prevWrapper, wrapper);
			}
			self._preformat = {
				wrapper : wrapper,
				range : range.cloneRange()
			};
			return _select.call(self);
		}
		//非inline标签
		if (!wrapper.isInline()) {
			var w = wrapper.clone(true), child = w;
			//查找最里面的element
			while (child.first()) {
				child = child.first();
			}
			child.append(range.extractContents());
			range.insertNode(w.get()).selectNode(w.get());
			return _select.call(self);
		}
		//inline标签，collapsed = false
		//split and wrap a test node
		function wrapTextNode(node, startOffset, endOffset) {
			var length = node.nodeValue.length, center = node;
			if (endOffset <= startOffset) {
				return;
			}
			if (startOffset > 0) {
				center = node.splitText(startOffset);
			}
			if (endOffset < length) {
				center.splitText(endOffset - startOffset);
			}
			var el = _wrapAndMergeNode(_node(center), wrapper).get();
			if (sc === node) {
				range.setStartBefore(el);
			}
			if (ec === node) {
				range.setEndAfter(el);
			}
		}
		//main function
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
						if (wrapRange(node) === false) {
							return false;
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
		//select range
		_select.call(self);
		//fire events
		_each(self._onchangeHandlers, function() {
			this();
		});
		return self;
	},
	remove : function(map) {
		var self = this, doc = self.doc, range = self.range;
		//inline标签，collapsed = true
		if (range.collapsed) {
			return _select.call(self);
		}
		//inline标签，collapsed = false
		//split parents
		_splitStartEnd(range, true, map);
		_splitStartEnd(range, false, map);
		//grep nodes which format will be removed
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
		//remove empty elements
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
		//remove attributes or styles
		_each(nodeList, function() {
			_removeAttrOrCss(this, map);
		});
		//select range
		_select.call(self);
		//fire events
		_each(self._onchangeHandlers, function() {
			this();
		});
		return self;
	},
	_applyPreformat : function() {
		var self = this, range = self.range, pf = self._preformat;
		if (pf) {
			var pw = pf.wrapper, pr = pf.range;
			range.setStart(pr.startContainer, pr.startOffset);
			self.wrap(pw);
			//find text node
			var el = range.startContainer.childNodes[range.startOffset];
			if (!el) {
				self._preformat = null;
				return;
			}
			var textNode = el.firstChild;
			while (textNode && textNode.firtChild) {
				textNode = textNode.firtChild;
			}
			if (textNode.nodeValue) {
				range.setEnd(textNode, textNode.nodeValue.length);
			} else {
				range.selectNodeContents(textNode);
			}
			range.collapse(false);
			self.range = range;
			_select.call(self);
			self._preformat = null;
		}
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
	},
	//只有用键盘添加文字时触发oninput事件
	oninput : function(fn) {
		var self = this, doc = self.doc;
		_node(doc).bind('keyup', function(e) {
			if (!e.ctrlKey && !e.altKey && _INPUT_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
			}
		});
		return self;
	},
	//输入文字、移动光标、执行命令都会触发onchange事件
	onchange : function(fn) {
		var self = this, doc = self.doc, body = doc.body;
		_node(doc).bind('keyup', function(e) {
			if (!e.ctrlKey && !e.altKey && _CHANGE_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
			}
		});
		_node(doc).bind('mouseup', fn);
		function timeoutHandler(e) {
			setTimeout(function() {
				fn(e);
			}, 1);
		}
		_node(body).bind('paste', timeoutHandler);
		_node(body).bind('cut', timeoutHandler);
		self._onchangeHandlers.push(fn);
		return self;
	}
};

function _cmd(mixed) {
	//mixed is a document
	if (mixed.nodeName) {
		var doc = mixed.ownerDocument || mixed,
			rng = _getRng(doc),
			cmd = new KCmd(_range(rng || doc));
		//add events
		//光标位置发生变化时保存selection
		function selectionHandler(e) {
			rng = _getRng(doc);
			if (rng) {
				cmd.range = _range(rng);
			}
		}
		cmd.onchange(selectionHandler);
		_node(document).bind('mousedown', selectionHandler);
		//输入文字后根据预先格式进行格式化
		cmd.oninput(function(e) {
			cmd._applyPreformat();
		});
		return cmd;
	}
	//mixed is a KRange
	return new KCmd(mixed);
}

K.cmd = _cmd;
