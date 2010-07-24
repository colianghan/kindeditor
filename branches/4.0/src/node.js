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
	if (!node) {
		return document;
	}
	return node.ownerDocument || node.document || node;
}

function _getWin(node) {
	if (!node) {
		return window;
	}
	var doc = _getDoc(node);
	return doc.parentWindow || doc.defaultView;
}

function _getNodeName(node) {
	if (!node) {
		return '';
	}
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
	self.type = self.length > 0 ? self[0].nodeType : null;
	self.win = _getWin(self[0]);
	//private properties
	self._data = {};
}

KNode.prototype = {
	each : function(fn) {
		var self = this;
		for (var i = 0; i < self.length; i++) {
			if (fn.call(self[i], i, self[i]) === false) {
				return self;
			}
		}
		return self;
	},
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
		this.each(function() {
			_bind(this, type, fn);
		});
		return this;
	},
	unbind : function(type, fn) {
		this.each(function() {
			_unbind(this, type, fn);
		});
		return this;
	},
	fire : function(type) {
		if (this.length < 1) {
			return this;
		}
		_fire(this[0], type);
		return this;
	},
	hasAttr : function(key) {
		if (this.length < 1) {
			return null;
		}
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
			val = self.length < 1 ? null : _getAttr(self[0], key);
			return val === null ? '' : val;
		}
		self.each(function() {
			_setAttr(this, key, val);
		});
		return self;
	},
	removeAttr : function(key) {
		this.each(function() {
			_removeAttr(this, key);
		});
		return this;
	},
	get : function(i) {
		if (this.length < 1) {
			return null;
		}
		return this[i || 0];
	},
	hasClass : function(cls) {
		if (this.length < 1) {
			return false;
		}
		return _hasClass(this[0], cls);
	},
	addClass : function(cls) {
		this.each(function() {
			if (!_hasClass(this, cls)) {
				this.className = _trim(this.className + ' ' + cls);
			}
		});
		return this;
	},
	removeClass : function(cls) {
		this.each(function() {
			if (_hasClass(this, cls)) {
				this.className = _trim(this.className.replace(new RegExp('\\s*' + cls + '\\s*'), ''));
			}
		});
		return this;
	},
	html : function(val) {
		var self = this;
		if (val === undefined) {
			if (self.length < 1) {
				return '';
			}
			return _formatHtml(self[0].innerHTML);
		}
		self.each(function() {
			_setHtml(this, _formatHtml(val));
		});
		return self;
	},
	hasVal : function() {
		if (this.length < 1) {
			return false;
		}
		return _hasVal(this[0]);
	},
	val : function(val) {
		var self = this;
		if (val === undefined) {
			if (self.length < 1) {
				return '';
			}
			return self.hasVal() ? self[0].value : self.attr('value');
		} else {
			self.each(function() {
				if (_hasVal(this)) {
					this.value = val;
				} else {
					_setAttr(this, 'value' , val);
				}
			});
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
			if (self.length < 1) {
				return '';
			}
			return self[0].style[key] || _computedCss(self[0], key) || '';
		}
		self.each(function() {
			this.style[_toCamel(key)] = val;
		});
		return self;
	},
	width : function(val) {
		var self = this;
		if (val === undefined) {
			if (self.length < 1) {
				return 0;
			}
			return self[0].offsetWidth;
		}
		return self.css('width', _addUnit(val));
	},
	height : function(val) {
		var self = this;
		if (val === undefined) {
			if (self.length < 1) {
				return 0;
			}
			return self[0].offsetHeight;
		}
		return self.css('height', _addUnit(val));
	},
	opacity : function(val) {
		this.each(function() {
			if (this.style.opacity === undefined) {
				this.style.filter = val == 1 ? '' : 'alpha(opacity=' + (val * 100) + ')';
			} else {
				this.style.opacity = val == 1 ? '' : val;
			}
		});
		return this;
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
		if (node) {
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
		}
		return {x : _round(x), y : _round(y)};
	},
	clone : function(bool) {
		if (this.length < 1) {
			return new KNode([]);
		}
		return new KNode([this[0].cloneNode(bool)]);
	},
	append : function(val) {
		var self = this;
		if (self.length < 1) {
			return self;
		}
		self[0].appendChild(_get(val));
		return self;
	},
	before : function(val) {
		var self = this;
		if (self.length < 1) {
			return self;
		}
		self[0].parentNode.insertBefore(_get(val), self[0]);
		return self;
	},
	after : function(val) {
		var self = this;
		if (self.length < 1) {
			return self;
		}
		if (self[0].nextSibling) {
			self[0].parentNode.insertBefore(_get(val), self[0].nextSibling);
		} else {
			self[0].appendChild(_get(val));
		}
		return self;
	},
	replaceWith : function(val) {
		var self = this, node = _get(val);
		if (self.length < 1) {
			return self;
		}
		_unbind(self[0]);
		self[0].parentNode.replaceChild(node, self[0]);
		self[0] = node;
		return self;
	},
	remove : function() {
		var self = this;
		self.each(function(i, node) {
			_unbind(node);
			if (node.hasChildNodes()) {
				node.innerHTML = '';
			}
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
			delete self[i];
		});
		self.length = 0;
		return self;
	},
	show : function(val) {
		return this.css('display', val === undefined ? 'block' : val);
	},
	hide : function() {
		return this.css('display', 'none');
	},
	outer : function() {
		var self = this;
		if (self.length < 1) {
			return '';
		}
		var div = self.doc.createElement('div'), html;
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
		if (this.length < 1) {
			return false;
		}
		return _contains(this[0], _get(otherNode));
	},
	parent : function() {
		if (this.length < 1) {
			return null;
		}
		var node = this[0].parentNode;
		return node ? new KNode([node]) : null;
	},
	children : function() {
		if (this.length < 1) {
			return [];
		}
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
		if (this.length < 1) {
			return -1;
		}
		var i = -1, sibling = this[0];
		while (sibling) {
			i++;
			sibling = sibling.previousSibling;
		}
		return i;
	},
	prev : function() {
		if (this.length < 1) {
			return null;
		}
		var node = this[0].previousSibling;
		return node ? new KNode([node]) : null;
	},
	next : function() {
		if (this.length < 1) {
			return null;
		}
		var node = this[0].nextSibling;
		return node ? new KNode([node]) : null;
	},
	scan : function(fn, order) {
		if (this.length < 1) {
			return;
		}
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
		return this;
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

var _K = K;

K = function(expr, root) {
	function newNode(node) {
		if (!node[0]) {
			node = [];
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
};

_each(_K, function(key, val) {
	K[key] = val;
});
