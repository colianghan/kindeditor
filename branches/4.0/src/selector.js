/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name selector.js
 * @fileOverview 通过CSS选择器选择DOM元素
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "config.js"
#using "html.js"
*/

function _contains(nodeA, nodeB) {
	while (nodeB) {
		if (nodeB === nodeA) {
			return true;
		}
		nodeB = nodeB.parentNode;
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
		if (key in list) {
			val = list[key];
		}
	} else {
		val = el.getAttribute(key, 2);
	}
	if (key === 'style' && val !== null) {
		val = _formatCss(val);
	}
	return val;
}

/**
	@name KindEditor.queryAll
	@function
	@param {String} expr 选择器查询语句。
	@param {element} root
	@returns {element[]}
	@description
	根据expr在root范围内查找DOM元素，并返回所有元素。没找到则返回空数组。
	@example
	var divArray = K.query('#id div');
	var spanArray = K.query('span.class', div);
*/
function _queryAll(expr, root) {
	root = root || document;
	function escape(str) {
		if (typeof str != 'string') {
			return str;
		}
		return str.replace(/([^\w\-])/g, '\\$1');
	}
	function stripslashes(str) {
		return str.replace(/\\/g, '');
	}
	function cmpTag(tagA, tagB) {
		return tagA === '*' || tagA.toLowerCase() === escape(tagB.toLowerCase());
	}
	function byId(id, tag, root) {
		var arr = [],
			doc = root.ownerDocument || root,
			el = doc.getElementById(stripslashes(id));
		if (el) {
			if (cmpTag(tag, el.nodeName) && _contains(root, el)) {
				arr.push(el);
			}
		}
		return arr;
	}
	function byClass(className, tag, root) {
		var doc = root.ownerDocument || root, arr = [], els, i, len, el;
		if (root.getElementsByClassName) {
			els = root.getElementsByClassName(stripslashes(className));
			for (i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (cmpTag(tag, el.nodeName)) {
					arr.push(el);
				}
			}
		} else if (doc.querySelectorAll) {
			els = doc.querySelectorAll((root.nodeName !== '#document' ? root.nodeName + ' ' : '') + tag + '.' + className);
			for (i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (_contains(root, el)) {
					arr.push(el);
				}
			}
		} else {
			els = root.getElementsByTagName(tag);
			className = ' ' + className + ' ';
			for (i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (el.nodeType == 1) {
					var cls = el.className;
					if (cls && (' ' + cls + ' ').indexOf(className) > -1) {
						arr.push(el);
					}
				}
			}
		}
		return arr;
	}
	function byName(name, tag, root) {
		var arr = [], els = root.getElementsByName(stripslashes(name)), el;
		for (var i = 0, len = els.length; i < len; i++) {
			el = els[i];
			if (cmpTag(tag, el.nodeName)) {
				if (el.getAttributeNode('name')) {
					arr.push(el);
				}
			}
		}
		return arr;
	}
	function byAttr(key, val, tag, root) {
		var arr = [], els = root.getElementsByTagName(tag), el;
		for (var i = 0, len = els.length; i < len; i++) {
			el = els[i];
			if (el.nodeType == 1) {
				if (val === null) {
					if (_getAttr(el, key) !== null) {
						arr.push(el);
					}
				} else {
					if (val === escape(_getAttr(el, key))) {
						arr.push(el);
					}
				}
			}
		}
		return arr;
	}
	function select(expr, root) {
		var arr = [], matches;
		matches = /^((?:\\.|[^.#\s\[<>])+)/.exec(expr);
		var tag = matches ? matches[1] : '*';
		if ((matches = /#((?:[\w\-]|\\.)+)$/.exec(expr))) {
			arr = byId(matches[1], tag, root);
		} else if ((matches = /\.((?:[\w\-]|\\.)+)$/.exec(expr))) {
			arr = byClass(matches[1], tag, root);
		} else if ((matches = /\[((?:[\w\-]|\\.)+)\]/.exec(expr))) {
			arr = byAttr(matches[1].toLowerCase(), null, tag, root);
		} else if ((matches = /\[((?:[\w\-]|\\.)+)\s*=\s*['"]?((?:\\.|[^'"]+)+)['"]?\]/.exec(expr))) {
			var key = matches[1].toLowerCase(), val = matches[2];
			if (key === 'id') {
				arr = byId(val, tag, root);
			} else if (key === 'class') {
				arr = byClass(val, tag, root);
			} else if (key === 'name') {
				arr = byName(val, tag, root);
			} else {
				arr = byAttr(key, val, tag, root);
			}
		} else {
			var els = root.getElementsByTagName(tag), el;
			for (var i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (el.nodeType == 1) {
					arr.push(el);
				}
			}
		}
		return arr;
	}
	var parts = [], arr, re = /((?:\\.|[^\s>])+|[\s>])/g;
	while ((arr = re.exec(expr))) {
		if (arr[1] !== ' ') {
			parts.push(arr[1]);
		}
	}
	var results = [];
	if (parts.length == 1) {
		return select(parts[0], root);
	}
	var isChild = false, part, els, subResults, val, v, i, j, k, length, len, l;
	for (i = 0, lenth = parts.length; i < lenth; i++) {
		part = parts[i];
		if (part === '>') {
			isChild = true;
			continue;
		}
		if (i > 0) {
			els = [];
			for (j = 0, len = results.length; j < len; j++) {
				val = results[j];
				subResults = select(part, val);
				for (k = 0, l = subResults.length; k < l; k++) {
					v = subResults[k];
					if (isChild) {
						if (val === v.parentNode) {
							els.push(v);
						}
					} else {
						els.push(v);
					}
				}
			}
			results = els;
		} else {
			results = select(part, root);
		}
		if (results.length === 0) {
			return [];
		}
	}
	return results;
}

/**
	@name KindEditor.query
	@function
	@param {String} expr 选择器查询语句。
	@param {element} root
	@returns {element}
	@description
	根据expr在root范围内查找DOM元素，并返回第一个元素。没找到则返回null。
	@example
	// Only support the following selector syntax.
	// Patterns:
	// *: any element
	// E: an element of type E
	// E[foo]: an E element with a "foo" attribute
	// E[foo="bar"]: an E element whose "foo" attribute value is exactly equal to "bar"
	// E.warning: an E element whose class is "warning" (the document language specifies how class is determined)
	// E#myid: an E element with ID equal to "myid"
	// E F: an F element descendant of an E element
	// E > F: an F element child of an E element

	var div = K.query('#id div');
	var span = K.query('span.class', div);
	@see <a href="http://www.w3.org/TR/css3-selectors/" target="_blank">Selectors Level 3</a>
*/
function _query(expr, root) {
	var arr = _queryAll(expr, root);
	return arr.length > 0 ? arr[0] : null;
}

K.query = _query;
K.queryAll = _queryAll;
