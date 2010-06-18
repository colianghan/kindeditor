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
#using "html.js"
*/
(function (K, undefined) {

var _IE = K.IE,
	_VERSION = K.VERSION,
	_query = K.query,
	_formatStyle = K.formatStyle,
	_trim = K.trim;

function _node(expr, root) {
	var node;
	if (typeof expr === 'string') {
		if (/<.+>/.test(expr)) {
			node = jQuery(expr, root).get(0);
		} else {
			node = _query(expr, root);
		}
	} else {
		node = expr;
	}
	var obj = {
		name : node.nodeName.toLowerCase(),
		type : node.nodeType,
		doc : node.ownerDocument,
		attr : function(key, val) {
			if (val === undefined) {
				key = key.toLowerCase();
				if (_IE && _VERSION < 8) {
					var div = this.doc.createElement('div');
					div.appendChild(node.cloneNode(false));
					var re = /\s+(?:([\w-:]+)|(?:([\w-:]+)=([^\s"'<>]+))|(?:([\w-:]+)="([^"]*)")|(?:([\w-:]+)='([^']*)'))(?=(?:\s|\/|>)+)/g;
					var arr, k, v, list = {};
					while ((arr = re.exec(div.innerHTML.toLowerCase()))) {
						k = arr[1] || arr[2] || arr[4] || arr[6];
						v = arr[1] || (arr[2] ? arr[3] : (arr[4] ? arr[5] : arr[7]));
						if (k === key) {
							val = v;
							break;
						}
					}
				} else {
					val = node.getAttribute(key, 2);
				}
				val = val === undefined ? null : val;
				if (key === 'style' && val !== null) {
					val = _formatStyle(val);
				}
				return val;
			} else {
				jQuery(node).attr(key, val);
				return this;
			}
		},
		delAttr : function(key) {
			jQuery(node).removeAttr(key);
			return this;
		},
		get : function() {
			return node;
		},
		hasCls : function(cls) {
			return jQuery(node).hasClass(cls);
		},
		addCls : function(cls) {
			jQuery(node).addClass(cls);
			return this;
		},
		delCls : function(cls) {
			jQuery(node).removeClass(cls);
			return this;
		},
		html : function(val) {
			if (val === undefined) {
				return jQuery(node).html();
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
		append : function(val) {
			jQuery(node).append(val);
			return this;
		},
		remove : function() {
			jQuery(node).remove();
			return this;
		},
		outer : function() {
			return _node('<div></div>').html(node.cloneNode(true)).html();
		},
		paired : function() {
			var temp = _node('<div></div>').append(node.cloneNode(false));
			return /<\/.*>/.test(temp.html());
		},
		each : function(fn, order) {
			order = (order === undefined) ? true : order;
			function walk(parent) {
				if (!parent) return;
				var n = order ? parent.firstChild : parent.lastChild;
				if (!n) return;
				while (n) {
					var next = order ? n.nextSibling : n.previousSibling;
					if (fn(n)) return true;
					walk(n);
					n = next;
				}
			}
			fn(node);
			walk(node);
		}
	};
	function updateProp() {
		//get and set firstChild, lastChild, children
		var list = [], child = node.firstChild;
		while (child) {
			if (child.nodeType != 3 || _trim(child.nodeValue) !== '') {
				list.push(child);
			}
			child = child.nextSibling;
		}
		if (list.length > 0) {
			this.firstChild = list[0];
			this.lastChild = list[list.length - 1];
		} else {
			this.firstChild = this.lastChild = null;
		}
		this.children = list;
		//get and set the index of the node
		var i = -1, sibling = node;
		while (sibling) {
			i++;
			sibling = sibling.previousSibling;
		}
		this.index = i;
	}
	updateProp.call(obj);
	return obj;
}

K.node = _node;

})(KindEditor);