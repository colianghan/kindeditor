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
#using "selector.js"
#using "format.js"
*/
(function (K, undefined) {

var _IE = K.IE,
	_VERSION = K.VERSION,
	_SINGLE_TAGS = K.SINGLE_TAGS,
	_query = K.query,
	_trim = K.trim,
	_inString = K.inString,
	_formatHtml = K.formatHtml,
	_isAncestor = K._isAncestor,
	_getAttr = K._getAttr;

function _toCamel(key) {
	var arr = key.split('-');
	key = '';
	for (var i = 0, len = arr.length; i < len; i++) {
		var part = arr[i];
		key += (i > 0) ? part.charAt(0).toUpperCase() + part.substr(1) : part;
	}
	return key;
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

function _node(expr, root) {
	var node;
	if (!expr) return null;
	if (typeof expr === 'string') {
		if (/<.+>/.test(expr)) {
			node = jQuery(expr, root).get(0);
		} else {
			node = _query(expr, root);
		}
	} else {
		node = expr;
	}
	var doc = node.ownerDocument || node;
	var win = doc.parentWindow || doc.defaultView;
	var oldDisplay = '';
	var obj = {
		name : node.nodeName.toLowerCase(),
		type : node.nodeType,
		doc : doc,
		attr : function(key, val) {
			if (val === undefined) {
				val = _getAttr(node, key);
				return val === null ? '' : val;
			} else {
				jQuery(node).attr(key, val);
				return this;
			}
		},
		removeAttr : function(key) {
			jQuery(node).removeAttr(key);
			return this;
		},
		get : function() {
			return node;
		},
		hasClass : function(cls) {
			return jQuery(node).hasClass(cls);
		},
		addClass : function(cls) {
			jQuery(node).addClass(cls);
			return this;
		},
		removeClass : function(cls) {
			jQuery(node).removeClass(cls);
			return this;
		},
		html : function(val) {
			if (val === undefined) {
				return _formatHtml(jQuery(node).html());
			} else {
				jQuery(node).html(val);
				return this;
			}
		},
		val : function(val) {
			if (val === undefined) {
				return jQuery(node).val();
			} else {
				jQuery(node).val(val);
				return this;
			}
		},
		css : function(key, val) {
			if (val === undefined) {
				return jQuery(node).css(key);
			} else {
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
			node.appendChild(val.get ? val.get() : val);
			return this;
		},
		before : function(val) {
			node.parentNode.insertBefore(val.get ? val.get() : val, node);
			return this;
		},
		after : function(val) {
			if (node.nextSibling) {
				node.parentNode.insertBefore(val.get ? val.get() : val, node.nextSibling);
			} else {
				this.append(val);
			}
			return this;
		},
		replaceWith : function(val) {
			node.parentNode.replaceChild(val.get ? val.get() : val, node);
			return this;
		},
		remove : function() {
			node.parentNode.removeChild(node);
			return this;
		},
		show : function() {
			if (this.computedCss('display') === 'none') this.css('display', oldDisplay);
		},
		hide : function() {
			if (this.computedCss('display') !== 'none') {
				oldDisplay = this.css('display');
				this.css('display', 'none');
			}
		},
		outer : function() {
			return _node('<div></div>').append(this.clone(true)).html();
		},
		paired : function() {
			return !_inString(this.name, _SINGLE_TAGS);
		},
		isAncestor : function(ancestor) {
			return _isAncestor(ancestor.get ? ancestor.get() : ancestor, node);
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
			if (this.type == 1 || this.type == 3) fn(this);
			walk(this);
		}
	};
	_updateProp.call(obj, node);
	return obj;
}

K.node = _node;
K._toCamel = _toCamel;

})(KindEditor);
