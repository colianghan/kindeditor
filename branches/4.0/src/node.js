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

function _getWin(doc) {
	return doc.parentWindow || doc.defaultView;
}

function _getNodeName(node) {
	return node.nodeName.toLowerCase();
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
	self.node = node;
	self.length = self.node.length;
	/**
		@name KNode#doc
		@property
		@public
		@type {document}
		@description
		包含Node的document对象。
	*/
	self.doc = _getDoc(self.node[0]);
	/**
		@name KNode#name
		@property
		@public
		@type {String}
		@description
		节点名称。
	*/
	self.name = _getNodeName(self.node[0]);
	/**
		@name KNode#type
		@property
		@public
		@type {String}
		@description
		节点类型。1: Element, 3: textNode
	*/
	self.type = self.node[0].nodeType;
	self.win = _getWin(self.doc);
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
		_each(self.node, function() {
			_bind(this, type, fn, self);
		});
		return self;
	},
	unbind : function(type, fn) {
		var self = this;
		_each(self.node, function() {
			_unbind(this, type, fn);
		});
		return self;
	},
	fire : function(type) {
		var self = this;
		_fire(self.node[0], type, self);
		return self;
	},
	hasAttr : function(key) {
		return _getAttr(this.node[0], key);
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
			val = _getAttr(node[0], key);
			return val === null ? '' : val;
		}
		_each(node, function() {
			_setAttr(this, key, val);
		});
		return self;
	},
	removeAttr : function(key) {
		var self = this;
		_each(self.node, function() {
			_removeAttr(this, key);
		});
		return self;
	},
	get : function(i) {
		return i === undefined ? this.node[0] : this.node[i];
	},
	hasClass : function(cls) {
		return _inString(cls, this.node[0].className, ' ');
	},
	addClass : function(cls) {
		var self = this;
		_each(self.node, function() {
			if (!_inString(cls, this.className, ' ')) {
				this.className = _trim(this.className + ' ' + cls);
			}
		});
		return self;
	},
	removeClass : function(cls) {
		var self = this;
		_each(self.node, function() {
			if (_inString(cls, this.className, ' ')) {
				this.className = _trim(this.className.replace(new RegExp('\\s*' + cls + '\\s*'), ''));
			}
		});
		return self;
	},
	html : function(val) {
		var self = this, node = self.node;
		if (val === undefined) {
			return _formatHtml(node[0].innerHTML);
		} else {
			_each(node, function() {
				_setHtml(this, _formatHtml(val));
			});
			return self;
		}
	},
	hasVal : function() {
		return _hasVal(this.node[0]);
	},
	val : function(val) {
		var self = this, node = self.node;
		if (val === undefined) {
			return self.hasVal() ? node[0].value : self.attr('value');
		} else {
			_each(node, function() {
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
			return node[0].style[key] || self.computedCss(key) || '';
		}
		_each(node, function() {
			this.style[_toCamel(key)] = val;
		});
		return self;
	},
	computedCss : function(key) {
		var self = this, node = self.node[0], camelKey = _toCamel(key), val = '';
		if (self.win.getComputedStyle) {
			var style = self.win.getComputedStyle(node, null);
			val = style[camelKey] || style.getPropertyValue(key) || node.style[camelKey];
		} else if (node.currentStyle) {
			val = node.currentStyle[camelKey] || node.style[camelKey];
		}
		return val;
	},
	width : function(val) {
		var self = this;
		if (val === undefined) {
			return self.node[0].offsetWidth;
		}
		return self.css('width', _addUnit(val));
	},
	height : function(val) {
		var self = this;
		if (val === undefined) {
			return self.node[0].offsetHeight;
		}
		return self.css('height', _addUnit(val));
	},
	opacity : function(val) {
		var self = this;
		_each(self.node, function() {
			if (this.style.opacity === undefined) {
				this.style.filter = val == 1 ? '' : 'alpha(opacity=' + (val * 100) + ')';
				return self;
			}
			this.style.opacity = val == 1 ? '' : val;
		});
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
		var self = this, node = self.node[0], x = 0, y = 0;
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
		return {x : Math.round(x), y : Math.round(y)};
	},
	clone : function(bool) {
		return new KNode([this.node[0].cloneNode(bool)]);
	},
	append : function(val) {
		var self = this;
		_each(self.node, function() {
			this.appendChild(_get(val));
		});
		return self;
	},
	before : function(val) {
		var self = this;
		_each(self.node, function() {
			this.parentNode.insertBefore(_get(val), this);
		});
		return self;
	},
	after : function(val) {
		var self = this;
		_each(self.node, function() {
			if (this.nextSibling) {
				this.parentNode.insertBefore(_get(val), this.nextSibling);
			} else {
				this.appendChild(_get(val));
			}
		});
		return self;
	},
	replaceWith : function(val) {
		var self = this, list = [], clone;
		_each(self.node, function() {
			clone = _get(val).cloneNode(true);
			_unbind(this);
			this.parentNode.replaceChild(clone, this);
			list.push(clone);
		});
		self.node = list;
		return self;
	},
	remove : function() {
		var self = this;
		_each(self.node, function() {
			_unbind(this);
			if (this.parentNode) {
				this.parentNode.removeChild(this);
			}
		});
		self.node = [];
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
		div.appendChild(self.node[0].cloneNode(true));
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
		return _contains(this.node[0], _get(otherNode));
	},
	parent : function() {
		var node = this.node[0].parentNode;
		return node ? new KNode([node]) : null;
	},
	children : function() {
		var list = [], child = this.node[0].firstChild;
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
		var i = -1, sibling = this.node[0];
		while (sibling) {
			i++;
			sibling = sibling.previousSibling;
		}
		return i;
	},
	prev : function() {
		var node = this.node[0].previousSibling;
		return node ? new KNode([node]) : null;
	},
	next : function() {
		var node = this.node[0].nextSibling;
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
		walk(this.node[0]);
	},
	toString : function() {
		return this.node.toString();
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
		if (/<.+>/.test(expr)) {
			var doc = root ? root.ownerDocument || root : document,
				div = doc.createElement('div'), list = [];
			_setHtml(div, expr);
			for (var i = 0, len = div.childNodes.length; i < len; i++) {
				list.push(div.childNodes[i]);
			}
			return newNode(list);
		}
		return newNode(_queryAll(expr, root));
	}
	if (expr && expr.get) {
		return expr;
	}
	return newNode(_toArray(arguments));
}

var _K = K;
K = K.node = _node;
_each(_K, function(key, val) {
	K[key] = val;
});
