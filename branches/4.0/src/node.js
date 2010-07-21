/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name node.js
 * @fileOverview Node类
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "event.js"
#using "html.js"
#using "selector.js"
*/

function _get(val) {
	return val.get ? val.get() : val;
}

function _toCamel(str) {
	var arr = str.split('-');
	str = '';
	_each(arr, function(key, val) {
		str += (key > 0) ? val.charAt(0).toUpperCase() + val.substr(1) : val;
	});
	return str;
}

function _setHtml(el, html) {
	if (el.nodeType != 1) {
		return;
	}
	el.innerHTML = '' + html;
}

function _hasClass(el, cls) {
	return _inString(cls, el.className, ' ');
}

function _setAttr(el, key, val) {
	if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
		key = 'className';
	}
	el.setAttribute(key, '' + val);
}

function _removeAttr(el, key) {
	if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
		key = 'className';
	}
	_setAttr(el, key, '');
	el.removeAttribute(key);
}

function _getDoc(node) {
	return node.ownerDocument || node.document || node;
}

function _getWin(node) {
	var doc = _getDoc(node);
	return doc.parentWindow || doc.defaultView;
}

function _getNodeName(node) {
	return node.nodeName.toLowerCase();
}

function _computedCss(el, key) {
	var self = this, win = _getWin(el), camelKey = _toCamel(key), val = '';
	if (win.getComputedStyle) {
		var style = win.getComputedStyle(el, null);
		val = style[camelKey] || style.getPropertyValue(key) || el.style[camelKey];
	} else if (el.currentStyle) {
		val = el.currentStyle[camelKey] || el.style[camelKey];
	}
	return val;
}

function _hasVal(node) {
	return !!_VALUE_TAG_MAP[_getNodeName(node)];
}

function _getScrollPos() {
	var x, y;
	if (_IE || _OPERA) {
		var docEl = document.documentElement;
		x = docEl.scrollLeft;
		y = docEl.scrollTop;
	} else {
		x = window.scrollX;
		y = window.scrollY;
	}
	return {x : x, y : y};
}

/**
	@name KNode
	@class KNode类
	@param {String|Node} expr DOM元素、选择器字符串、HTML
	@param {Element} root DOM根元素，在root范围内选择DOM元素
	@description
	KNode类，只能通过K(expr, root)创建，不能使用new KNode()。
	@example
	var knode = K('&lt;div&gt;&lt;/div&gt;'); //根据HTML创建KNode对象
	knode = K('#id div'); //选择匹配的DIV NodeList
	knode = K(document.getElementById('id')); //选择原生Node
*/
function KNode(node) {
	var self = this;
	_each(node, function(i) {
		self[i] = this;
	});
	self.length = node.length;
	/**
		@name KNode#doc
		@property
		@public
		@type {document}
		@description
		包含Node的document对象。
	*/
	self.doc = _getDoc(self[0]);
	/**
		@name KNode#name
		@property
		@public
		@type {String}
		@description
		节点名称。
	*/
	self.name = _getNodeName(self[0]);
	/**
		@name KNode#type
		@property
		@public
		@type {String}
		@description
		节点类型。1: Element, 3: textNode
	*/
	self.type = self[0].nodeType;
	self.win = _getWin(self[0]);
	//private properties
	self._data = {};
}

KNode.prototype = {
	/**
		@name KNode#bind
		@function
		@public
		@param {String} type
		@param {String} fn
		@returns {KNode}
		@description
		绑定一个事件。
	*/
	bind : function(type, fn) {
		var self = this;
		for (var i = 0; i < self.length; i++) {
			_bind(self[i], type, fn);
		}
		return self;
	},
	unbind : function(type, fn) {
		var self = this;
		for (var i = 0; i < self.length; i++) {
			_unbind(self[i], type, fn);
		}
		return self;
	},
	fire : function(type) {
		var self = this;
		_fire(self[0], type);
		return self;
	},
	hasAttr : function(key) {
		return _getAttr(this[0], key);
	},
	attr : function(key, val) {
		var self = this;
		if (key === undefined) {
			return _getAttrList(self.outer());
		}
		if (typeof key === 'object') {
			_each(key, function(k, v) {
				self.attr(k, v);
			});
			return self;
		}
		if (val === undefined) {
			val = _getAttr(self[0], key);
			return val === null ? '' : val;
		}
		for (var i = 0; i < self.length; i++) {
			_setAttr(self[i], key, val);
		}
		return self;
	},
	removeAttr : function(key) {
		var self = this;
		for (var i = 0; i < self.length; i++) {
			_removeAttr(self[i], key);
		}
		return self;
	},
	get : function(i) {
		return this[i || 0];
	},
	hasClass : function(cls) {
		return _hasClass(this[0], cls);
	},
	addClass : function(cls) {
		var self = this;
		for (var i = 0; i < self.length; i++) {
			if (!_hasClass(self[i], cls)) {
				self[i].className = _trim(self[i].className + ' ' + cls);
			}
		}
		return self;
	},
	removeClass : function(cls) {
		var self = this;
		for (var i = 0; i < self.length; i++) {
			if (_hasClass(self[i], cls)) {
				self[i].className = _trim(self[i].className.replace(new RegExp('\\s*' + cls + '\\s*'), ''));
			}
		}
		return self;
	},
	html : function(val) {
		var self = this;
		if (val === undefined) {
			return _formatHtml(self[0].innerHTML);
		}
		for (var i = 0; i < self.length; i++) {
			_setHtml(self[i], _formatHtml(val));
		}
		return self;
	},
	hasVal : function() {
		return _hasVal(this[0]);
	},
	val : function(val) {
		var self = this;
		if (val === undefined) {
			return self.hasVal() ? self[0].value : self.attr('value');
		} else {
			for (var i = 0; i < self.length; i++) {
				if (_hasVal(self[i])) {
					self[i].value = val;
				} else {
					_setAttr(self[i], 'value' , val);
				}
			}
			return self;
		}
	},
	css : function(key, val) {
		var self = this;
		if (key === undefined) {
			return _getCssList(self.attr('style'));
		}
		if (typeof key === 'object') {
			_each(key, function(k, v) {
				self.css(k, v);
			});
			return self;
		}
		if (val === undefined) {
			return self[0].style[key] || _computedCss(self[0], key) || '';
		}
		for (var i = 0; i < self.length; i++) {
			self[i].style[_toCamel(key)] = val;
		}
		return self;
	},
	width : function(val) {
		var self = this;
		if (val === undefined) {
			return self[0].offsetWidth;
		}
		return self.css('width', _addUnit(val));
	},
	height : function(val) {
		var self = this;
		if (val === undefined) {
			return self[0].offsetHeight;
		}
		return self.css('height', _addUnit(val));
	},
	opacity : function(val) {
		var self = this;
		for (var i = 0; i < self.length; i++) {
			if (self[i].style.opacity === undefined) {
				self[i].style.filter = val == 1 ? '' : 'alpha(opacity=' + (val * 100) + ')';
			} else {
				self[i].style.opacity = val == 1 ? '' : val;
			}
		}
		return self;
	},
	data : function(key, val) {
		var self = this;
		if (val === undefined) {
			return self._data[key];
		}
		self._data[key] = val;
		return self;
	},
	pos : function() {
		var self = this, node = self[0], x = 0, y = 0;
		if (node.getBoundingClientRect) {
			var box = node.getBoundingClientRect(),
				pos = _getScrollPos();
			x = box.left + pos.x;
			y = box.top + pos.y;
		} else {
			while (node) {
				x += node.offsetLeft;
				y += node.offsetTop;
				node = node.offsetParent;
			}
		}
		return {x : _round(x), y : _round(y)};
	},
	clone : function(bool) {
		return new KNode([this[0].cloneNode(bool)]);
	},
	append : function(val) {
		var self = this;
		self[0].appendChild(_get(val));
		return self;
	},
	before : function(val) {
		var self = this;
		self[0].parentNode.insertBefore(_get(val), self[0]);
		return self;
	},
	after : function(val) {
		var self = this;
		if (self[0].nextSibling) {
			self[0].parentNode.insertBefore(_get(val), self[0].nextSibling);
		} else {
			self[0].appendChild(_get(val));
		}
		return self;
	},
	replaceWith : function(val) {
		var self = this, node = _get(val);
		_unbind(self[0]);
		self[0].parentNode.replaceChild(node, self[0]);
		self[0] = node;
		return self;
	},
	remove : function() {
		var self = this, len = self.length;
		for (var i = 0; i < self.length; i++) {
			_unbind(self[i]);
			if (self[i].parentNode) {
				self[i].parentNode.removeChild(self[i]);
			}
			delete self[i];
			len--;
		}
		self.length = len;
		return self;
	},
	show : function(val) {
		return this.css('display', val === undefined ? 'block' : val);
	},
	hide : function() {
		return this.css('display', 'none');
	},
	outer : function() {
		var self = this, div = self.doc.createElement('div'), html;
		div.appendChild(self[0].cloneNode(true));
		html = _formatHtml(div.innerHTML);
		div = null;
		return html;
	},
	isSingle : function() {
		return !!_SINGLE_TAG_MAP[this.name];
	},
	isInline : function() {
		return !!_INLINE_TAG_MAP[this.name];
	},
	isBlock : function() {
		return !!_BLOCK_TAG_MAP[this.name];
	},
	contains : function(otherNode) {
		return _contains(this[0], _get(otherNode));
	},
	parent : function() {
		var node = this[0].parentNode;
		return node ? new KNode([node]) : null;
	},
	children : function() {
		var list = [], child = this[0].firstChild;
		while (child) {
			if (child.nodeType != 3 || _trim(child.nodeValue) !== '') {
				list.push(new KNode([child]));
			}
			child = child.nextSibling;
		}
		return list;
	},
	first : function() {
		var list = this.children();
		return list.length > 0 ? list[0] : null;
	},
	last : function() {
		var list = this.children();
		return list.length > 0 ? list[list.length - 1] : null;
	},
	index : function() {
		var i = -1, sibling = this[0];
		while (sibling) {
			i++;
			sibling = sibling.previousSibling;
		}
		return i;
	},
	prev : function() {
		var node = this[0].previousSibling;
		return node ? new KNode([node]) : null;
	},
	next : function() {
		var node = this[0].nextSibling;
		return node ? new KNode([node]) : null;
	},
	each : function(fn, order) {
		order = (order === undefined) ? true : order;
		function walk(node) {
			var n = order ? node.firstChild : node.lastChild;
			while (n) {
				var next = order ? n.nextSibling : n.previousSibling;
				if (fn(new KNode([n])) === false) {
					return false;
				}
				if (walk(n) === false) {
					return false;
				}
				n = next;
			}
		}
		walk(this[0]);
	}
};

//Inspired by jQuery
_each(('blur,focus,focusin,focusout,load,resize,scroll,unload,click,dblclick,' +
	'mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,' +
	'change,select,submit,keydown,keypress,keyup,error').split(','), function(i, type) {
	KNode.prototype[type] = function(fn) {
		return fn ? this.bind(type, fn) : this.fire(type);
	};
});

function _node(expr, root) {
	function newNode(node) {
		if (node.length < 1 || !node[0]) {
			return null;
		}
		return new KNode(node);
	}
	if (typeof expr === 'string') {
		//HTML
		if (/<.+>/.test(expr)) {
			var doc = root ? root.ownerDocument || root : document,
				div = doc.createElement('div'), list = [];
			_setHtml(div, expr);
			for (var i = 0, len = div.childNodes.length; i < len; i++) {
				list.push(div.childNodes[i]);
			}
			return newNode(list);
		}
		//selector
		return newNode(_queryAll(expr, root));
	}
	//KNode
	if (expr && expr.get) {
		return expr;
	}
	//NodeList
	if (_isArray(expr)) {
		return newNode(expr);
	}
	//Node
	return newNode(_toArray(arguments));
}

var _K = K;
K = K.node = _node;
_each(_K, function(key, val) {
	K[key] = val;
});
