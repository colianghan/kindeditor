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
*/
//输入文字的键值
var _INPUT_KEY_MAP = _toMap('9,32,48..57,59,61,65..90,106,109..111,188,190..192,219..222');
//移动光标的键值
var _CURSORMOVE_KEY_MAP = _toMap('8,13,33..40,46');
//输入文字或移动光标的键值
var _CHANGE_KEY_MAP = {};
_each(_INPUT_KEY_MAP, function(key, val) {
	_CHANGE_KEY_MAP[key] = val;
});
_each(_CURSORMOVE_KEY_MAP, function(key, val) {
	_CHANGE_KEY_MAP[key] = val;
});

//original execCommand
function _nativeCommand(doc, key, val) {
	try {
		doc.execCommand(key, false, val);
	} catch(e) {}
}
//original queryCommandValue
function _nativeCommandValue(doc, key) {
	var val = '';
	try {
		val = doc.queryCommandValue(key);
	} catch (e) {}
	if (typeof val !== 'string') {
		val = '';
	}
	return val;
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
	if (_IE && (!rng || (!rng.item && rng.parentElement().ownerDocument !== doc))) {
		return null;
	}
	return rng;
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
	var newMap = _singleKeyMap(map), arr, key, val, method;
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			key = arr[i];
			if (key === '*') {
				return true;
			}
			var match = /^(\.?)([^=]+)(?:=([^=]+))?$/.exec(key);
			method = match[1] ? 'css' : 'attr';
			key = match[2];
			val = match[3] || '';
			if (val === '' && knode[method](key) !== '') {
				return true;
			}
			if (val !== '' && knode[method](key) === val) {
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
	var newMap = _singleKeyMap(map), arr, key;
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		allFlag = false;
		for (var i = 0, len = arr.length; i < len; i++) {
			key = arr[i];
			if (key === '*') {
				allFlag = true;
				break;
			}
			var match = /^(\.?)([^=]+)(?:=([^=]+))?$/.exec(key);
			key = match[2];
			if (match[1]) {
				knode.css(key, '');
			} else {
				knode.removeAttr(key);
			}
		}
		if (allFlag) {
			knode.remove(true);
		}
	}
}
//取得最里面的element
function _getInnerNode(knode) {
	var inner = knode;
	while (inner.first()) {
		inner = inner.first();
	}
	return inner;
}
//最里面的element为inline element时返回true
function _isEmptyNode(knode) {
	return _getInnerNode(knode).isInline();
}
//merge two wrapper
//a : <span><strong></strong></span>
//b : <strong><em></em></strong>
//result : <span><strong><em></em></strong></span>
function _mergeWrapper(a, b) {
	a = a.clone(true);
	var lastA = _getInnerNode(a), childA = a, merged = false;
	while (b) {
		while (childA) {
			if (childA.name === b.name) {
				_mergeAttrs(childA, b.attr(), b.css());
				merged = true;
			}
			childA = childA.first();
		}
		if (!merged) {
			lastA.append(b.clone(false));
		}
		merged = false;
		b = b.first();
	}
	return a;
}
//wrap and merge a node
function _wrapNode(knode, wrapper) {
	wrapper = wrapper.clone(true);
	//node为text node时
	if (knode.type == 3) {
		_getInnerNode(wrapper).append(knode.clone(false));
		knode.before(wrapper);
		knode.remove();
		return wrapper;
	}
	//node为element时
	//取得node的wrapper
	var nodeWrapper = knode, child;
	while ((child = knode.first()) && child.children().length == 1) {
		knode = child;
	}
	//将node的子节点纳入在一个documentFragment里
	var next, frag = knode.doc.createDocumentFragment();
	while ((child = knode.first())) {
		next = child.next();
		frag.appendChild(child.get());
		child = next;
	}
	wrapper = _mergeWrapper(nodeWrapper, wrapper);
	if (frag.firstChild) {
		_getInnerNode(wrapper).append(frag);
	}
	nodeWrapper.before(wrapper);
	nodeWrapper.remove();
	return wrapper;
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

function KCmd(range) {
	var self = this, doc = range.doc;
	self.doc = doc;
	self.win = _getWin(doc);
	self.sel = _getSel(doc);
	self.range = range;
}

KCmd.prototype = {
	select : function() {
		var self = this, sel = self.sel, range = self.range.cloneRange(),
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset,
			doc = sc.ownerDocument || sc, win = _getWin(doc), rng;
		//case 1: tag内部无内容时选中tag内部，比如：<tagName>[]</tagName>
		if (_IE && sc.nodeType == 1 && range.collapsed) {
			var empty = K('<span>&nbsp;</span>', doc);
			range.insertNode(empty.get());
			rng = doc.body.createTextRange();
			rng.moveToElementText(empty.get());
			rng.collapse(false);
			rng.select();
			empty.remove();
			win.focus();
			return self;
		}
		//case 2: other case
		rng = range.get(true);
		if (_IE) {
			rng.select();
		} else {
			sel.removeAllRanges();
			sel.addRange(rng);
		}
		win.focus();
		return self;
	},
	wrap : function(val) {
		var self = this, doc = self.doc, range = self.range, wrapper,
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		wrapper = K(val, doc);
		//inline标签，collapsed=true
		if (range.collapsed) {
			range.insertNode(wrapper[0]).selectNode(wrapper[0]);
			return self;
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
			return self;
		}
		//inline标签，collapsed=false
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
			var parent, knode = K(center),
				isStart = sc == node, isEnd = ec == node;
			//node为唯一的子节点时重新设置node
			while ((parent = knode.parent()) && parent.isInline() && parent.children().length == 1) {
				if (!isStart) {
					isStart = sc == parent.get();
				}
				if (!isEnd) {
					isEnd = ec == parent.get();
				}
				knode = parent;
			}
			var el = _wrapNode(knode, wrapper).get();
			if (isStart) {
				range.setStartBefore(el);
			}
			if (isEnd) {
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
		wrapRange(range.commonAncestor());
		return self;
	},
	split : function(isStart, map) {
		var range = this.range, doc = range.doc, 
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		//get parent node
		var tempRange = range.cloneRange().collapse(isStart);
		var node = tempRange.startContainer, pos = tempRange.startOffset,
			parent = node.nodeType == 3 ? node.parentNode : node,
			needSplit = false, knode;
		while (parent && parent.parentNode) {
			knode = K(parent);
			if (!knode.isInline()) {
				break;
			}
			if (!_hasAttrOrCss(knode, map)) {
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
			mark = null;
			if (!isStart && markParent === range.endContainer) {
				range.setEnd(range.endContainer, range.endOffset - 1);
			}
		}
		return this;
	},
	remove : function(map) {
		var self = this, doc = self.doc, range = self.range;
		//inline标签，collapsed = true
		if (range.collapsed) {
			return self;
		}
		//inline标签，collapsed = false
		//split parents
		self.split(true, map);
		self.split(false, map);
		//grep nodes which format will be removed
		var nodeList = [], testRange, start = false;
		K(range.commonAncestor()).scan(function(node) {
			testRange = _range(doc).selectNode(node);
			if (!start) {
				start = testRange.compareBoundaryPoints(_START_TO_START, range) >= 0;
			}
			if (start) {
				if (testRange.compareBoundaryPoints(_END_TO_END, range) > 0) {
					return false;
				}
				nodeList.push(K(node));
			}
		});
		//remove empty elements
		var sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		if (so > 0) {
			var before = K(sc.childNodes[so - 1]);
			if (before && _isEmptyNode(before)) {
				before.remove();
				range.setStart(sc, so - 1);
				if (sc == ec) {
					range.setEnd(ec, eo - 1);
				}
			}
			//<b>abc[</b><b>def]</b><b>ghi</b>时，分割后HTML变成
			//<b>abc</b>[<b></b><b>def</b>]<b>ghi</b> 
			before = K(sc.childNodes[so]);
			if (before && _isEmptyNode(before)) {
				before.remove();
				if (sc == ec) {
					range.setEnd(ec, eo - 1);
				}
			}
		}
		var after = K(ec.childNodes[range.endOffset]);
		if (after && _isEmptyNode(after)) {
			after.remove();
		}
		//remove attributes or styles
		_each(nodeList, function() {
			_removeAttrOrCss(this, map);
		});
		return self;
	},
	commonNode : function(map) {
		var range = this.range,
			ec = range.endContainer, eo = range.endOffset,
			node = (ec.nodeType == 3 || eo === 0) ? ec : ec.childNodes[eo - 1],
			child = node;
		while (child && (child = child.firstChild) && child.childNodes.length == 1) {
			if (_hasAttrOrCss(K(child), map)) {
				return K(child);
			}
		}
		while (node) {
			if (_hasAttrOrCss(K(node), map)) {
				return K(node);
			}
			node = node.parentNode;
		}
		return null;
	},
	//Reference: document.queryCommandState
	state : function(key) {
		var self = this, doc = self.doc, bool = false;
		try {
			bool = doc.queryCommandState(key);
		} catch (e) {}
		return bool;
	},
	//Reference: document.queryCommandValue
	val : function(key) {
		var self = this, doc = self.doc, range = self.range;
		function lc(val) {
			return val.toLowerCase();
		}
		key = lc(key);
		var val = '', knode;
		if (key === 'fontfamily' || key === 'fontname') {
			val = _nativeCommandValue(doc, 'fontname');
			val = val.replace(/['"]/g, '');
			return lc(val);
		}
		if (key === 'formatblock') {
			val = _nativeCommandValue(doc, key);
			if (val === '') {
				knode = self.commonNode({'h1,h2,h3,h4,h5,h6,p,div,pre,address' : '*'});
				if (knode) {
					val = knode.name;
				}
			}
			if (val === 'Normal') {
				val = 'p';
			}
			return lc(val);
		}
		if (key === 'fontsize') {
			knode = self.commonNode({'*' : '.font-size'});
			if (knode) {
				val = knode.css('font-size');
			}
			return lc(val);
		}
		if (key === 'forecolor') {
			knode = self.commonNode({'*' : '.color'});
			if (knode) {
				val = knode.css('color');
			}
			val = _toHex(val);
			if (val === '') {
				val = 'default';
			}
			return lc(val);
		}
		if (key === 'hilitecolor') {
			knode = self.commonNode({'*' : '.background-color'});
			if (knode) {
				val = knode.css('background-color');
			}
			val = _toHex(val);
			if (val === '') {
				val = 'default';
			}
			return lc(val);
		}
		return val;
	},
	toggle : function(wrapper, map) {
		var self = this;
		if (self.commonNode(map)) {
			self.remove(map);
		} else {
			self.wrap(wrapper);
		}
		return self.select();
	},
	bold : function() {
		return this.toggle('<strong></strong>', {
			span : '.font-weight=bold',
			strong : '*',
			b : '*'
		});
	},
	italic : function() {
		return this.toggle('<em></em>', {
			span : '.font-style=italic',
			em : '*',
			i : '*'
		});
	},
	underline : function() {
		return this.toggle('<u></u>', {
			span : '.text-decoration=underline',
			u : '*'
		});
	},
	strikethrough : function() {
		return this.toggle('<s></s>', {
			span : '.text-decoration=line-through',
			s : '*'
		});
	},
	forecolor : function(val) {
		return this.toggle('<span style="color:' + val + ';"></span>', {
			span : '.color=' + val,
			font : 'color'
		});
	},
	hilitecolor : function(val) {
		return this.toggle('<span style="background-color:' + val + ';"></span>', {
			span : '.background-color=' + val
		});
	},
	fontsize : function(val) {
		return this.toggle('<span style="font-size:' + val + ';"></span>', {
			span : '.font-size=' + val,
			font : 'size'
		});
	},
	fontname : function(val) {
		return this.fontfamily(val);
	},
	fontfamily : function(val) {
		return this.toggle('<span style="font-family:' + val + ';"></span>', {
			span : '.font-family=' + val,
			font : 'face'
		});
	},
	removeformat : function() {
		var map = {
			'*' : 'class,style'
		},
		tags = _INLINE_TAG_MAP;
		_each(tags, function(key, val) {
			map[key] = '*';
		});
		this.remove(map);
		return this.select();
	},
	inserthtml : function(val) {
		var self = this, doc = self.doc, range = self.range,
			frag = doc.createDocumentFragment();
		K('@' + val, doc).each(function() {
			frag.appendChild(this);
		});
		range.deleteContents();
		range.insertNode(frag);
		range.collapse(false);
		return self.select();
	},
	hr : function() {
		return this.inserthtml('<hr />');
	},
	print : function() {
		this.win.print();
		return this;
	},
	insertimage : function(url, title, width, height, border, align) {
		title = _undef(title, '');
		border = _undef(border, 0);
		var html = '<img src="' + url + '" ';
		if (width) {
			html += 'width="' + width + '" ';
		}
		if (height) {
			html += 'height="' + height + '" ';
		}
		if (title) {
			html += 'title="' + title + '" ';
		}
		if (align) {
			html += 'align="' + align + '" ';
		}
		html += 'alt="' + title + '" ';
		html += 'border="' + border + '" />';
		return this.inserthtml(html);
	},
	createlink : function(url, type) {
		var self = this, doc = self.doc, range = self.range;
		self.select();
		var a = self.commonNode({ a : '*' });
		if (a && !range.isControl()) {
			range.selectNode(a.get());
			self.select();
		}
		if (range.collapsed) {
			var html = '<a href="' + url + '"';
			if (type) {
				html += ' target="' + type + '"';
			}
			html += '>' + url + '</a>';
			self.inserthtml(html);
			return self;
		}
		_nativeCommand(doc, 'createlink', '__ke_temp_url__');
		a = self.commonNode({ a : '*' });
		K('a[href="__ke_temp_url__"]', a ? a.parent() : doc).each(function() {
			K(this).attr('href', url);
			if (type) {
				K(this).attr('target', type);
			} else {
				K(this).removeAttr('target');
			}
		});
		return self;
	},
	unlink : function() {
		var self = this, doc = self.doc, range = self.range;
		self.select();
		if (range.collapsed) {
			var a = self.commonNode({ a : '*' });
			if (a) {
				range.selectNode(a.get());
				self.select();
			}
			_nativeCommand(doc, 'unlink', null);
			if (_WEBKIT && K(range.startContainer).name === 'img') {
				var parent = K(range.startContainer).parent();
				if (parent.name === 'a') {
					parent.remove(true);
				}
			}
			return self;
		}
		_nativeCommand(doc, 'unlink', null);
		return self;
	},
	//用键盘添加文字时触发oninput事件
	oninput : function(fn) {
		var self = this, doc = self.doc;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _INPUT_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
			}
		});
		return self;
	},
	//移动光标时触发oncursormove事件
	oncursormove : function(fn) {
		var self = this, doc = self.doc;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _CURSORMOVE_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
			}
		});
		K(doc).mouseup(fn);
		return self;
	},
	//输入文字、移动光标、执行命令都会触发onchange事件
	onchange : function(fn) {
		var self = this, doc = self.doc, body = doc.body;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _CHANGE_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
			}
		});
		K(doc).mouseup(fn).contextmenu(fn);
		if (doc !== document) {
			K(document).mousedown(fn);
		}
		function timeoutHandler(e) {
			setTimeout(function() {
				fn(e);
			}, 1);
		}
		K(body).bind('paste', timeoutHandler);
		K(body).bind('cut', timeoutHandler);
		return self;
	}
};

_each(('formatblock,selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
	'insertunorderedlist,indent,outdent,subscript,superscript').split(','), function(i, name) {
	KCmd.prototype[name] = function(val) {
		var self = this;
		_nativeCommand(self.doc, name, val);
		return self;
	};
});

_each('cut,copy,paste'.split(','), function(i, name) {
	KCmd.prototype[name] = function() {
		var self = this;
		if (!self.doc.queryCommandSupported(name)) {
			throw 'not supported';
		}
		_nativeCommand(self.doc, name, null);
		return self;
	};
});

function _cmd(mixed) {
	//mixed is a node
	if (mixed.nodeName) {
		var doc = _getDoc(mixed),
			range = _range(doc).selectNodeContents(doc.body).collapse(false),
			cmd = new KCmd(range);
		//add events
		//重新设置selection
		cmd.onchange(function(e) {
			var rng = _getRng(doc);
			if (rng) {
				cmd.range = _range(rng);
				if (K(cmd.range.startContainer).name == 'html') {
					cmd.range.selectNodeContents(doc.body).collapse(false);
				}
			}
		});
		//WEBKIT点击图片选中
		if (_WEBKIT) {
			K(doc).click(function(e) {
				if (K(e.target).name === 'img') {
					var rng = _getRng(doc);
					if (rng) {
						cmd.range = _range(rng);
					}
					cmd.range.selectNode(e.target);
					cmd.select();
				}
			});
		}
		return cmd;
	}
	//mixed is a KRange
	return new KCmd(mixed);
}

K.cmd = _cmd;
