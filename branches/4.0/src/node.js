/**
* KindEditor - WYSIWYG HTML Editor
* Copyright (C) 2006-${THISYEAR} Longhao Luo
*
* @site http://www.kindsoft.net/
* @licence LGPL
* @version ${VERSION}
*/

/**
#using "core.js"
#using "event.js"
#using "html.js"
#using "selector.js"
*/
(function (K, undefined) {

var _IE = K.IE,
	_VERSION = K.VERSION,
	_INLINE_TAG_MAP = K.INLINE_TAG_MAP,
	_BLOCK_TAG_MAP = K.BLOCK_TAG_MAP,
	_SINGLE_TAG_MAP = K.SINGLE_TAG_MAP,
	_each = K.each,
	_query = K.query,
	_trim = K.trim,
	_getCssList = K._getCssList,
	_getAttrList = K._getAttrList,
	_formatHtml = K.formatHtml,
	_isAncestor = K._isAncestor,
	_getAttr = K._getAttr,
	_bind = K.bind,
	_unbind = K.unbind,
	_fire = K.fire;

function _node(expr, root) {
	var node;
	if (typeof expr === 'string') {
		if (/<.+>/.test(expr)) {
			//TODO
			node = jQuery(expr, root).get(0);
		} else {
			node = _query(expr, root);
		}
	} else {
		node = expr;
	}
	if (!node) return null;
	var doc = node.ownerDocument || node,
		win = doc.parentWindow || doc.defaultView,
		prevDisplay = '';
	var obj = {
		name : node.nodeName.toLowerCase(),
		type : node.nodeType,
		doc : doc,
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
		attr : function(key, val) {
			if (key === undefined) {
				return _getAttrList(this.outer());
			} else if (val === undefined) {
				val = _getAttr(node, key);
				return val === null ? '' : val;
			} else {
				//TODO
				jQuery(node).attr(key, val);
				return this;
			}
		},
		removeAttr : function(key) {
			//TODO
			jQuery(node).removeAttr(key);
			return this;
		},
		get : function() {
			return node;
		},
		hasClass : function(cls) {
			//TODO
			return jQuery(node).hasClass(cls);
		},
		addClass : function(cls) {
			//TODO
			jQuery(node).addClass(cls);
			return this;
		},
		removeClass : function(cls) {
			//TODO
			jQuery(node).removeClass(cls);
			return this;
		},
		html : function(val) {
			//TODO
			if (val === undefined) {
				return _formatHtml(jQuery(node).html());
			} else {
				jQuery(node).html(val);
				return this;
			}
		},
		val : function(val) {
			//TODO
			if (val === undefined) {
				return jQuery(node).val();
			} else {
				jQuery(node).val(val);
				return this;
			}
		},
		css : function(key, val) {
			if (key === undefined) {
				return _getCssList(this.attr('style'));
			} else if (val === undefined) {
				//TODO
				return jQuery(node).css(key);
			} else {
				//TODO
				jQuery(node).css(key, val);
				return this;
			}
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
			return _node(_get(val));
		},
		remove : function() {
			node.parentNode.removeChild(node);
			this.unbind();
			return this;
		},
		show : function() {
			if (this.computedCss('display') === 'none') this.css('display', prevDisplay);
		},
		hide : function() {
			if (this.computedCss('display') !== 'none') {
				prevDisplay = this.css('display');
				this.css('display', 'none');
			}
		},
		outer : function() {
			return _node('<div></div>', doc).append(this.clone(true)).html();
		},
		isSingle : function() {
			return this.name in _SINGLE_TAG_MAP;
		},
		isInline : function() {
			return this.name in _INLINE_TAG_MAP;
		},
		isBlock : function() {
			return this.name in _BLOCK_TAG_MAP;
		},
		isAncestor : function(ancestor) {
			return _isAncestor(_get(ancestor), node);
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
				if (!n) return;
				while (n) {
					var next = order ? n.next() : n.prev();
					if (fn(n)) return true;
					if (walk(n)) return;
					n = next;
				}
			}
			walk(this);
		},
		toString : function() {
			return this.type == 3 ? node.nodeValue : this.outer();
		}
	};
	_updateProp.call(obj, node);
	return obj;
}

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

K.node = _node;

})(KindEditor);
