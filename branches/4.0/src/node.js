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
function _node(expr, root) {
	var node;
	if (typeof expr === 'string') {
		if (/<.+>/.test(expr)) {
			var ownerDocument = root ? root.ownerDocument || root : document,
				div = ownerDocument.createElement('div');
			div.innerHTML = expr;
			node = div.firstChild;
			div = null;
		} else {
			node = _query(expr, root);
		}
	} else {
		node = expr;
	}
	if (!node) {
		return null;
	}
	var doc = node.ownerDocument || node,
		win = doc.parentWindow || doc.defaultView,
		prevDisplay = '';
	var obj = {
		/**
			@name KindEditor.node#name
			@property
			@public
			@type {String}
			@description
			节点名称。
		*/
		name : node.nodeName.toLowerCase(),
		/**
			@name KindEditor.node#type
			@property
			@public
			@type {String}
			@description
			节点类型。1: Element, 3: textNode
		*/
		type : node.nodeType,
		/**
			@name KindEditor.node#doc
			@property
			@public
			@type {document}
			@description
			包含Node的document对象。
		*/
		doc : doc,
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
			_bind(node, type, fn);
			return this;
		},
		unbind : function(type, fn) {
			_unbind(node, type, fn);
			return this;
		},
		fire : function(type) {
			_fire(node, type);
			return this;
		},
		hasAttr : function(key) {
			return _getAttr(node, key);
		},
		attr : function(key, val) {
			if (key === undefined) {
				return _getAttrList(this.outer());
			} else if (val === undefined) {
				val = _getAttr(node, key);
				return val === null ? '' : val;
			} else {
				if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
					key = 'className';
				}
				node.setAttribute(key, '' + val);
				return this;
			}
		},
		removeAttr : function(key) {
			if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
				key = 'className';
			}
			this.attr(key, '');
			node.removeAttribute(key);
			return this;
		},
		get : function() {
			return node;
		},
		hasClass : function(cls) {
			return _inString(cls, node.className, ' ');
			
		},
		addClass : function(cls) {
			if (!this.hasClass(cls)) {
				node.className = _trim(node.className + ' ' + cls);
			}
			return this;
		},
		removeClass : function(cls) {
			if (this.hasClass(cls)) {
				node.className = _trim(node.className.replace(new RegExp('\\s*' + cls + '\\s*'), ''));
			}
			return this;
		},
		html : function(val) {
			if (val === undefined) {
				return _formatHtml(node.innerHTML);
			} else {
				node.innerHTML = _formatHtml(val);
				return this;
			}
		},
		val : function(val) {
			if (val === undefined) {
				return this.hasVal() ? node.value : this.attr('value');
			} else {
				if (this.hasVal()) {
					node.value = val;
				} else {
					this.attr('value' , val);
				}
				return this;
			}
		},
		css : function(key, val) {
			var self = this;
			if (key === undefined) {
				return _getCssList(this.attr('style'));
			}
			if (typeof key === 'object') {
				_each(key, function(k, v) {
					self.css(k, v);
				});
				return this;
			}
			if (val === undefined) {
				return node.style[key] || this.computedCss(key) || '';
			}
			node.style[_toCamel(key)] = val;
			return this;
		},
		computedCss : function(key) {
			var camelKey = _toCamel(key),
				val = '';
			if (win.getComputedStyle) {
				var style = win.getComputedStyle(node, null);
				val = style[camelKey] || style.getPropertyValue(key) || node.style[camelKey];
			} else if (node.currentStyle) {
				val = node.currentStyle[camelKey] || node.style[camelKey];
			}
			return val;
		},
		clone : function(bool) {
			return _node(node.cloneNode(bool));
		},
		append : function(val) {
			node.appendChild(_get(val));
			return this;
		},
		before : function(val) {
			node.parentNode.insertBefore(_get(val), node);
			return this;
		},
		after : function(val) {
			if (node.nextSibling) {
				node.parentNode.insertBefore(_get(val), node.nextSibling);
			} else {
				this.append(val);
			}
			return this;
		},
		replaceWith : function(val) {
			node.parentNode.replaceChild(_get(val), node);
			this.unbind();
			node = _get(val);
			return this;
		},
		remove : function() {
			this.unbind();
			var div = doc.createElement('div');
			div.appendChild(node);
			div.innerHTML = null;
			div = node = null;
			return this;
		},
		show : function() {
			if (this.computedCss('display') === 'none') {
				this.css('display', prevDisplay);
			}
			return this;
		},
		hide : function() {
			if (this.computedCss('display') !== 'none') {
				prevDisplay = this.css('display');
				this.css('display', 'none');
			}
			return this;
		},
		outer : function() {
			var div = doc.createElement('div'),html;
			div.appendChild(node);
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
			return _contains(node, _get(otherNode));
		},
		parent : function() {
			return _node(node.parentNode);
		},
		prev : function() {
			return _node(node.previousSibling);
		},
		next : function() {
			return _node(node.nextSibling);
		},
		each : function(fn, order) {
			order = (order === undefined) ? true : order;
			function walk(knode) {
				var n = order ? knode.first : knode.last;
				if (!n) {
					return;
				}
				while (n) {
					var next = order ? n.next() : n.prev();
					if (fn(n)) {
						return true;
					}
					if (walk(n)) {
						return;
					}
					n = next;
				}
			}
			walk(this);
		},
		toString : function() {
			return this.type == 3 ? node.nodeValue : this.outer();
		}
	};
	function _updateProp(node) {
		//node.first, node.last, node.children
		var list = [], child = node.firstChild;
		while (child) {
			if (child.nodeType != 3 || _trim(child.nodeValue) !== '') {
				list.push(_node(child));
			}
			child = child.nextSibling;
		}
		if (list.length > 0) {
			this.first = list[0];
			this.last = list[list.length - 1];
		} else {
			this.first = this.last = null;
		}
		this.children = list;
		//node.index
		var i = -1, sibling = node;
		while (sibling) {
			i++;
			sibling = sibling.previousSibling;
		}
		this.index = i;
	}
	_updateProp.call(obj, node);
	return obj;
}

K.node = _node;
