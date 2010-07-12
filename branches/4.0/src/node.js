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

/**
	@name KindEditor.node
	@class KNode类
	@param {String|Node} expr DOM元素、选择器字符串、HTML
	@param {Element} root DOM根元素，在root范围内选择DOM元素
	@description
	KNode类，只能通过K.node(expr, root)创建，不能使用new KNode()。
	@example
	var knode = K.node('&lt;div&gt;&lt;/div&gt;'); //根据HTML创建KNode对象
	knode = K.node('#id div'); //选择第一个匹配的div元素，并返回该元素的KNode对象
	knode = K.node(document.getElementById('id')); //返回原生Node的KNode对象
*/
function KNode(node) {
	var self = this;
	self.node = node;
	/**
		@name KindEditor.node#doc
		@property
		@public
		@type {document}
		@description
		包含Node的document对象。
	*/
	self.doc = self.node.ownerDocument || self.node;
	/**
		@name KindEditor.node#name
		@property
		@public
		@type {String}
		@description
		节点名称。
	*/
	self.name = self.node.nodeName.toLowerCase();
	/**
		@name KindEditor.node#type
		@property
		@public
		@type {String}
		@description
		节点类型。1: Element, 3: textNode
	*/
	self.type = self.node.nodeType;
	self.win = self.doc.parentWindow || self.doc.defaultView;
	//private properties
	self._prevDisplay = '';
}

KNode.prototype = {
	/**
		@name KindEditor.node#bind
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
		_bind(self.node, type, function(e) {
			fn.call(self, e);
		});
		return self;
	},
	unbind : function(type, fn) {
		var self = this;
		_unbind(self.node, type, function(e) {
			fn.call(self, e);
		});
		return self;
	},
	fire : function(type) {
		var self = this;
		_fire(self.node, type);
		return self;
	},
	hasAttr : function(key) {
		return _getAttr(this.node, key);
	},
	attr : function(key, val) {
		var self = this, node = self.node;
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
			val = _getAttr(node, key);
			return val === null ? '' : val;
		}
		if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
			key = 'className';
		}
		node.setAttribute(key, '' + val);
		return self;
	},
	removeAttr : function(key) {
		var self = this;
		if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
			key = 'className';
		}
		self.attr(key, '');
		self.node.removeAttribute(key);
		return self;
	},
	get : function() {
		return this.node;
	},
	hasClass : function(cls) {
		return _inString(cls, this.node.className, ' ');
	},
	addClass : function(cls) {
		var self = this, node = self.node;
		if (!self.hasClass(cls)) {
			node.className = _trim(node.className + ' ' + cls);
		}
		return self;
	},
	removeClass : function(cls) {
		var self = this, node = self.node;
		if (self.hasClass(cls)) {
			node.className = _trim(node.className.replace(new RegExp('\\s*' + cls + '\\s*'), ''));
		}
		return self;
	},
	html : function(val) {
		var self = this, node = self.node;
		if (val === undefined) {
			return _formatHtml(node.innerHTML);
		} else {
			_setHtml(node, _formatHtml(val));
			return self;
		}
	},
	val : function(val) {
		var self = this, node = self.node;
		if (val === undefined) {
			return self.hasVal() ? node.value : self.attr('value');
		} else {
			if (self.hasVal()) {
				node.value = val;
			} else {
				self.attr('value' , val);
			}
			return self;
		}
	},
	css : function(key, val) {
		var self = this, node = self.node;
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
			return node.style[key] || self.computedCss(key) || '';
		}
		node.style[_toCamel(key)] = val;
		return self;
	},
	computedCss : function(key) {
		var self = this, node = self.node, camelKey = _toCamel(key), val = '';
		if (self.win.getComputedStyle) {
			var style = self.win.getComputedStyle(node, null);
			val = style[camelKey] || style.getPropertyValue(key) || node.style[camelKey];
		} else if (node.currentStyle) {
			val = node.currentStyle[camelKey] || node.style[camelKey];
		}
		return val;
	},
	clone : function(bool) {
		return new KNode(this.node.cloneNode(bool));
	},
	append : function(val) {
		this.node.appendChild(_get(val));
		return this;
	},
	before : function(val) {
		var self = this, node = self.node;
		node.parentNode.insertBefore(_get(val), node);
		return self;
	},
	after : function(val) {
		var self = this, node = self.node;
		if (node.nextSibling) {
			node.parentNode.insertBefore(_get(val), node.nextSibling);
		} else {
			self.append(val);
		}
		return self;
	},
	replaceWith : function(val) {
		val = _get(val);
		var self = this, node = self.node;
		node.parentNode.replaceChild(val, node);
		self.unbind();
		self.node = val;
		return self;
	},
	remove : function() {
		var self = this, node = self.node;
		self.unbind();
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
		self.node = null;
		return self;
	},
	show : function() {
		var self = this;
		if (self.computedCss('display') === 'none') {
			self.css('display', self._prevDisplay);
		}
		return self;
	},
	hide : function() {
		var self = this;
		if (self.computedCss('display') !== 'none') {
			self._prevDisplay = self.css('display');
			self.css('display', 'none');
		}
		return self;
	},
	outer : function() {
		var self = this, div = self.doc.createElement('div'), html;
		div.appendChild(self.node.cloneNode(true));
		html = _formatHtml(div.innerHTML);
		div = null;
		return html;
	},
	hasVal : function() {
		return !!_VALUE_TAG_MAP[this.name];
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
		return _contains(this.node, _get(otherNode));
	},
	parent : function() {
		var node = this.node.parentNode;
		return node ? new KNode(node) : null;
	},
	children : function() {
		var list = [], child = this.node.firstChild;
		while (child) {
			if (child.nodeType != 3 || _trim(child.nodeValue) !== '') {
				list.push(new KNode(child));
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
		var i = -1, sibling = this.node;
		while (sibling) {
			i++;
			sibling = sibling.previousSibling;
		}
		return i;
	},
	prev : function() {
		var node = this.node.previousSibling;
		return node ? new KNode(node) : null;
	},
	next : function() {
		var node = this.node.nextSibling;
		return node ? new KNode(node) : null;
	},
	each : function(fn, order) {
		order = (order === undefined) ? true : order;
		function walk(node) {
			var n = order ? node.firstChild : node.lastChild;
			while (n) {
				var next = order ? n.nextSibling : n.previousSibling;
				if (fn(new KNode(n)) === false) {
					return false;
				}
				if (walk(n) === false) {
					return false;
				}
				n = next;
			}
		}
		walk(this.node);
	},
	toString : function() {
		var self = this;
		return self.type == 3 ? self.node.nodeValue : self.outer();
	}
};

function _node(expr, root) {
	function newNode(node) {
		if (!node) {
			return null;
		}
		return new KNode(node);
	}
	if (typeof expr === 'string') {
		if (/<.+>/.test(expr)) {
			var doc = root ? root.ownerDocument || root : document,
				div = doc.createElement('div');
			_setHtml(div, expr);
			return newNode(div.firstChild);
		}
		return newNode(_query(expr, root));
	}
	return newNode(expr);
}

K.node = _node;
