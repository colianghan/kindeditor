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
#using "html.js"
*/

/**
	Only support the following selector syntax.
	Patterns:
	*: any element
	E: an element of type E
	E[foo]: an E element with a "foo" attribute
	E[foo="bar"]: an E element whose "foo" attribute value is exactly equal to "bar"
	E.warning: an E element whose class is "warning" (the document language specifies how class is determined)
	E#myid: an E element with ID equal to "myid"
	E F: an F element descendant of an E element
	E > F: an F element child of an E element
	Reference:
	Selectors Level 3: http://www.w3.org/TR/css3-selectors/
*/
(function (K, undefined) {

var _IE = K.IE,
	_VERSION = K.VERSION,
	_each = K.each,
	_formatCss = K._formatCss,
	_getAttrList = K._getAttrList;

function _isAncestor(ancestor, node) {
	var parent = node;
	while (parent = parent.parentNode) {
		if (parent === ancestor) return true;
	}
	return false;
}

function _getAttr(el, key) {
	key = key.toLowerCase();
	var val = null;
	if (_IE && _VERSION < 8) {
		var div = el.ownerDocument.createElement('div');
		div.appendChild(el.cloneNode(false));
		var list = _getAttrList(div.innerHTML.toLowerCase());
		if (key in list) val = list[key];
	} else {
		val = el.getAttribute(key, 2);
	}
	if (key === 'style' && val !== null) {
		val = _formatCss(val);
	}
	return val;
}

function _query(expr, root) {
	var arr = _queryAll(expr, root);
	return arr.length > 0 ? arr[0] : null;
}

function _queryAll(expr, root) {
	root = root || document;
	function escape(str) {
		if (typeof str != 'string') return str;
		return str.replace(/([^\w\-])/g, '\\$1');
	}
	function stripslashes(str) {
		return str.replace(/\\/g, '');
	}
	function cmpTag(tagA, tagB) {
		return tagA === '*' || tagA.toLowerCase() === escape(tagB.toLowerCase());
	}
	function byId(id, tag, root) {
		var arr = [];
		var doc = root.ownerDocument || root;
		var el = doc.getElementById(stripslashes(id));
		if (el) {
			if (cmpTag(tag, el.nodeName) && _isAncestor(root, el)) arr.push(el);
		}
		return arr;
	}
	function byClass(className, tag, root) {
		var doc = root.ownerDocument || root;
		var arr = [];
		if (root.getElementsByClassName) {
			var els = root.getElementsByClassName(stripslashes(className));
			for (var i = 0, len = els.length, el; i < len; i++) {
				el = els[i];
				if (cmpTag(tag, el.nodeName)) arr.push(el);
			}
		} else if (doc.querySelectorAll) {
			var els = doc.querySelectorAll((root.nodeName !== '#document' ? root.nodeName + ' ' : '') + tag + '.' + className);
			for (var i = 0, len = els.length, el; i < len; i++) {
				el = els[i];
				if (_isAncestor(root, el)) arr.push(el);
			}
		} else {
			var els = root.getElementsByTagName(tag);
			className = ' ' + className + ' ';
			for (var i = 0, len = els.length, el; i < len; i++) {
				el = els[i];
				if (el.nodeType == 1) {
					var cls = el.className;
					if (cls && (' ' + cls + ' ').indexOf(className) > -1) arr.push(el);
				}
			}
		}
		return arr;
	}
	function byName(name, tag, root) {
		var arr = [];
		var els = root.getElementsByName(stripslashes(name));
		for (var i = 0, len = els.length, el; i < len; i++) {
			el = els[i];
			if (cmpTag(tag, el.nodeName)) {
				if (el.getAttributeNode('name')) arr.push(el);
			}
		}
		return arr;
	}
	function byAttr(key, val, tag, root) {
		var arr = [];
		var els = root.getElementsByTagName(tag);
		for (var i = 0, len = els.length, el; i < len; i++) {
			el = els[i];
			if (el.nodeType == 1) {
				if (val === null) {
					if (_getAttr(el, key) !== null) arr.push(el);
				} else {
					if (val === escape(_getAttr(el, key))) arr.push(el);
				}
			}
		}
		return arr;
	}
	function select(expr, root) {
		var arr = [], matches;
		matches = /^((?:\\.|[^.#\s\[<>])+)/.exec(expr);
		var tag = matches ? matches[1] : '*';
		if (matches = /#((?:[\w\-]|\\.)+)$/.exec(expr)) {
			arr = byId(matches[1], tag, root);
		} else if (matches = /\.((?:[\w\-]|\\.)+)$/.exec(expr)) {
			arr = byClass(matches[1], tag, root);
		} else if (matches = /\[((?:[\w\-]|\\.)+)\]/.exec(expr)) {
			arr = byAttr(matches[1].toLowerCase(), null, tag, root);
		} else if (matches = /\[((?:[\w\-]|\\.)+)\s*=\s*['"]?((?:\\.|[^'"]+)+)['"]?\]/.exec(expr)) {
			var key = matches[1].toLowerCase(), val = matches[2];
			if (key === 'id') arr = byId(val, tag, root);
			else if (key === 'class') arr = byClass(val, tag, root);
			else if (key === 'name') arr = byName(val, tag, root);
			else arr = byAttr(key, val, tag, root);
		} else {
			var els = root.getElementsByTagName(tag);
			for (var i = 0, len = els.length, el; i < len; i++) {
				el = els[i];
				if (el.nodeType == 1) arr.push(el); 
			}
		}
		return arr;
	}
	var parts = [];
	var arr, re = /((?:\\.|[^\s>])+|[\s>])/g;
	while (arr = re.exec(expr)) {
		if (arr[1] !== ' ') parts.push(arr[1]);
	}
	var results = [];
	if (parts.length == 1) {
		return select(parts[0], root);
	}
	var el, isChild = false;
	for (var i = 0, len = parts.length; i < len; i++) {
		var part = parts[i];
		if (part === '>') {
			isChild = true;
			continue;
		}
		if (i > 0) {
			var els = [];
			_each(results, function(key, val) {
				_each(select(part, val), function(k, v) {
					if (isChild) {
						if (val === v.parentNode) els.push(v);
					} else {
						els.push(v);
					}
				});
			});
			results = els;
		} else {
			results = select(part, root);
		}
		if (results.length == 0) return []; 
	}
	return results;
}

K._isAncestor = _isAncestor;
K._getAttr = _getAttr;

K.query = _query;
K.queryAll = _queryAll;

})(KindEditor);