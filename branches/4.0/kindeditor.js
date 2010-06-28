/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2010 Longhao Luo
*
* @author Longhao Luo <luolonghao@gmail.com>
* @website http://www.kindsoft.net/
* @licence LGPL(http://www.kindsoft.net/lgpl_license.html)
* @version 4.0 (2010-06-28)
*******************************************************************************/

(function (window, undefined) {

var _ua = navigator.userAgent.toLowerCase(),
	_IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1,
	_GECKO = _ua.indexOf('gecko') > -1 && _ua.indexOf('khtml') == -1,
	_WEBKIT = _ua.indexOf('applewebkit') > -1,
	_OPERA = _ua.indexOf('opera') > -1,
	_matches = /(?:msie|firefox|webkit|opera)[\/:\s](\d+)/.exec(_ua),
	_VERSION = _matches ? _matches[1] : '0';

function _isArray(val) {
	return Object.prototype.toString.call(val) === '[object Array]';
}

function _inArray(val, arr) {
	for (var i = 0, len = arr.length; i < len; i++) {
		if (val === arr[i]) return i;
	}
	return -1;
}

function _each(obj, fn) {
	if (_isArray(obj)) {
		for (var i = 0, len = obj.length; i < len; i++) {
			if (fn(i, obj[i]) === false) break;
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn(key, obj[key]) === false) break;
			}
		}
	}
}

function _trim(str) {
	return str.replace(/^\s+|\s+$/g, '');
}

function _inString(val, str, delimiter) {
	delimiter = delimiter === undefined ? ',' : delimiter;
	return (delimiter + str + delimiter).indexOf(delimiter + val + delimiter) >= 0;
}

function _toHex(color) {
	function hex(s) {
		s = parseInt(s).toString(16).toUpperCase();
		return s.length > 1 ? s : '0' + s;
	}
	return color.replace(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/ig,
		function($0, $1, $2, $3) {
			return '#' + hex($1) + hex($2) + hex($3);
		}
	);
}

function _toMap(str, delimiter) {
	var map = {},
		delimiter = delimiter === undefined ? ',' : delimiter,
		arr = str.split(delimiter);
	_each(arr, function(key, val) {
		map[val] = true;
	});
	return map;
}

window.KindEditor = {
	IE : _IE,
	GECKO : _GECKO,
	WEBKIT : _WEBKIT,
	OPERA : _OPERA,
	VERSION : _VERSION,
	// Inspired from http://ejohn.org/files/htmlparser.js
	// Inline Elements - HTML 4.01
	_INLINE_TAG_MAP : _toMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),
	// Block Elements - HTML 4.01
	_BLOCK_TAG_MAP : _toMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul'),
	// Single Elements - HTML 4.01
	_SINGLE_TAG_MAP : _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),
	// Elements that you can, intentionally, leave open (and which close themselves)
	_AUTOCLOSE_TAG_MAP : _toMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),
	// Attributes that have their values filled in disabled="disabled"
	_FILL_ATTR_MAP : _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'),
	each : _each,
	isArray : _isArray,
	inArray : _inArray,
	inString : _inString,
	trim : _trim,
	toHex : _toHex,
	toMap : _toMap
};

})(window);

(function (K, undefined) {

var _each = K.each,
	_inArray = K.inArray;

//add native event
function _bindEvent(el, type, fn) {
	if (el.addEventListener){
		el.addEventListener(type, fn, false);
	} else if (el.attachEvent){
		el.attachEvent('on' + type, fn);
	}
}
//remove native event
function _unbindEvent(el, type, fn) {
	if (el.removeEventListener){
		el.removeEventListener(type, fn, false);
	} else if (el.detachEvent){
		el.detachEvent('on' + type, fn);
	}
}

//Inspired by jQuery
//http://github.com/jquery/jquery/blob/master/src/event.js
var _props = 'altKey,attrChange,attrName,bubbles,button,cancelable,charCode,clientX,clientY,ctrlKey,currentTarget,data,detail,eventPhase,fromElement,handler,keyCode,layerX,layerY,metaKey,newValue,offsetX,offsetY,originalTarget,pageX,pageY,prevValue,relatedNode,relatedTarget,screenX,screenY,shiftKey,srcElement,target,toElement,view,wheelDelta,which'.split(',');
function _event(el, e) {
	if (!e) return;
	var obj = {},
		doc = el.nodeName.toLowerCase() === '#document' ? el : el.ownerDocument;
	_each(_props, function(key, val) {
		obj[val] = e[val];
	});
	if (!e.target) {
		e.target = e.srcElement || doc;
	}
	if (e.target.nodeType === 3) {
		e.target = e.target.parentNode;
	}
	if (!e.relatedTarget && e.fromElement) {
		e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
	}
	if (e.pageX == null && e.clientX != null) {
		var d = doc.documentElement, body = doc.body;
		e.pageX = e.clientX + (d && d.scrollLeft || body && body.scrollLeft || 0) - (d && d.clientLeft || body && body.clientLeft || 0);
		e.pageY = e.clientY + (d && d.scrollTop  || body && body.scrollTop  || 0) - (d && d.clientTop  || body && body.clientTop  || 0);
	}
	if (!e.which && ((e.charCode || e.charCode === 0) ? e.charCode : e.keyCode)) {
		e.which = e.charCode || e.keyCode;
	}
	if (!e.metaKey && e.ctrlKey) {
		e.metaKey = e.ctrlKey;
	}
	if (!e.which && e.button !== undefined) {
		e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
	}
	obj.preventDefault = function() {
		if (e.preventDefault) e.preventDefault();
		e.returnValue = false;
	};
	obj.stopPropagation = function() {
		if (e.stopPropagation) e.stopPropagation();
		e.cancelBubble = true;
	};
	obj.stop = function() {
		this.preventDefault();
		this.stopPropagation();
	};
	return obj;
}

var _elList = [], _data = {};

function _getId(el) {
	var id = _inArray(el, _elList);
	if (id < 0) {
		id = _elList.length;
		_elList.push(el);
		_data[id] = {};
	}
	return id;
}

function _bind(el, type, fn) {
	var id = _getId(el);
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		_each(_data[id][type], function(key, val) {
			if (val === undefined) _data[id][type].splice(key, 1);
		});
		_unbindEvent(el, type, _data[id][type][0]);
	} else {
		_data[id][type] = [];
	}
	if (_data[id][type].length == 0) {
		_data[id][type][0] = function(e) {
			_each(_data[id][type], function(key, val) {
				if (key > 0 && val) val.call(el, _event(el, e));
			});
		};
	}
	if (_inArray(fn, _data[id][type]) < 0) {
		_data[id][type].push(fn);
	}
	_bindEvent(el, type, _data[id][type][0]);
}

function _unbind(el, type, fn) {
	var id = _getId(el);
	if (type === undefined) {
		if (id in _data) {
			_each(_data[id], function(key, val) {
				_unbindEvent(el, key, val[0]);
			});
			_data[id] = {};
		}
		return;
	}
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		if (fn === undefined) {
			_unbindEvent(el, type, _data[id][type][0]);
			_data[id][type] = [];
		} else {
			for (var i = 0, len = _data[id][type].length; i < len; i++) {
				if (_data[id][type][i] === fn) delete _data[id][type][i];
			}
			if (_data[id][type].length == 2 && _data[id][type][1] === undefined) {
				_unbindEvent(el, type, _data[id][type][0]);
				_data[id][type] = [];
			}
		}
	}
}

function _fire(el, type) {
	var id = _getId(el);
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		_data[id][type][0]();
	}
}

K.bind = _bind;
K.unbind = _unbind;
K.fire = _fire;

})(KindEditor);

(function (K, undefined) {

var _SINGLE_TAG_MAP = K._SINGLE_TAG_MAP,
	_each = K.each,
	_trim = K.trim,
	_toHex = K.toHex,
	_inString = K.inString;

function _getCssList(css) {
	var list = {},
		reg = /\s*([\w\-]+)\s*:([^;]*)(;|$)/g,
		match;
	while (match = reg.exec(css)) {
		var key = _trim(match[1].toLowerCase()),
			val = _trim(_toHex(match[2]));
		list[key] = val;
	}
	return list;
}

function _getAttrList(tag) {
	var list = {},
		reg = /\s+(?:([\w-:]+)|(?:([\w-:]+)=([^\s"'<>]+))|(?:([\w-:]+)="([^"]*)")|(?:([\w-:]+)='([^']*)'))(?=(?:\s|\/|>)+)/g,
		match;
	while (match = reg.exec(tag)) {
		var key = match[1] || match[2] || match[4] || match[6],
			val = (match[2] ? match[3] : (match[4] ? match[5] : match[7])) || '';
		list[key] = val;
	}
	return list;
}

function _formatCss(css) {
	var str = '';
	_each(_getCssList(css), function(key, val) {
		str += key + ':' + val + ';';
	});
	return str;
}

//Modified by zhanyi1022
function _formatHtml(html) {
	var re = /((?:[\r\n])*)<(\/)?([\w-:]+)(\s*(?:[\w-:]+)(?:=(?:"[^"]*"|'[^']*'|[^\s"'<>]*))?)*\s*(\/)?>((?:[\r\n])*)/g;
	html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
		var startNewline = $1 || '',
			startSlash = $2 || '',
			tagName = $3.toLowerCase(),
			attr = $4 || '',
			endSlash = $5 ? ' ' + $5 : '',
			endNewline = $6 || '';
		if (endSlash === '' && _SINGLE_TAG_MAP[tagName]) endSlash = ' /';
		if (endNewline) endNewline = ' ';
		if (tagName !== 'script' && tagName !== 'style') {
			startNewline = '';
		}
		if (attr !== '') {
			attr = attr.replace(/\s*([\w-:]+)=([^\s"'<>]+|"[^"]*"|'[^']*')/g, function($0, $1, $2) {
				var key = $1.toLowerCase(),
					val = $2 || '';
				if (val === '') {
					val = '""';
				} else {
					if (key === 'style') {
						val = val.substr(1, val.length - 2);
						val = _formatCss(val);
						if (val === '') return '';
						val = '"' + val + '"';
					}
					if (!/^['"]/.test(val)) val = '"' + val + '"';
				}
				return ' ' + key + '=' + val + ' ';
			});
			attr = _trim(attr);
			attr = attr.replace(/\s+/g, ' ');
			if (attr) attr = ' ' + attr;
			return startNewline + '<' + startSlash + tagName + attr + endSlash + '>' + endNewline;
		} else {
			return startNewline + '<' + startSlash + tagName + endSlash + '>' + endNewline;
		}
	});
	return _trim(html);
}
K.formatHtml = _formatHtml;
K._formatCss = _formatCss;
K._getCssList = _getCssList;
K._getAttrList = _getAttrList;

})(KindEditor);

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

(function (K, undefined) {

var _IE = K.IE,
	_VERSION = K.VERSION,
	_INLINE_TAG_MAP = K._INLINE_TAG_MAP,
	_BLOCK_TAG_MAP = K._BLOCK_TAG_MAP,
	_SINGLE_TAG_MAP = K._SINGLE_TAG_MAP,
	_each = K.each,
	_query = K.query,
	_trim = K.trim,
	_inString = K.inString,
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
			var doc = root ? root.ownerDocument || root : document,
				div = doc.createElement('div');
			div.innerHTML = expr;
			node = div.firstChild;
			div = null;
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
				if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') key = 'className';
				node.setAttribute(key, '' + val);
				return this;
			}
		},
		removeAttr : function(key) {
			if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') key = 'className';
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
			if (!this.hasClass(cls)) node.className = _trim(node.className + ' ' + cls);
			return this;
		},
		removeClass : function(cls) {
			if(this.hasClass(cls))
				node.className = _trim(node.className.replace(new RegExp('\s*' + cls + '\s*'), ''));
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
			var bool = node.value != null && node.value !== '';
			if (val === undefined) {
				return bool ? node.value : this.attr('value');
			} else {
				if (bool) node.value = val;
				else this.attr('value' , val);
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
			if(_IE){
				var div = doc.createElement('div');
				div.appendChild(node);
				div.innerHTML = null;
				div = null;
			}else{
				ndoe.parentNode.removeChild(node);
			}
			this.unbind();
			node = null;
			return this;
		},
		show : function() {
			if (this.computedCss('display') === 'none') 
				this.css('display', prevDisplay);
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
		isSingle : function() {
			return !!_SINGLE_TAG_MAP[this.name];
		},
		isInline : function() {
			return !!_INLINE_TAG_MAP[this.name];
		},
		isBlock : function() {
			return !!_BLOCK_TAG_MAP[this.name];
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
		},
		contain : function(node) {
			var n = this.get();
			return n.contains ? n != node && n.contains(node) : !!(n.compareDocumentPosition(node) & 16);
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

(function (K, undefined) {

var _IE = K.IE,
	_node = K.node,
	_inArray = K.inArray,
	_START_TO_START = 0,
	_START_TO_END = 1,
	_END_TO_END = 2,
	_END_TO_START = 3;

function _range(mixed) {
	if (!mixed.nodeName) {
		return mixed.get ? mixed : _toRange(mixed);
	}
	var doc = mixed;
	return {
		
		startContainer : doc,
		
		startOffset : 0,
		
		endContainer : doc,
		
		endOffset : 0,
		
		collapsed : true,
		
		commonAncestorContainer : doc,
		
		setStart : function(node, offset) {
			this.startContainer = node;
			this.startOffset = offset;
			if (this.endContainer === doc) {
				this.endContainer = node;
				this.endOffset = offset;
			}
			_compareAndUpdate.call(this, doc);
			_updateCollapsed.call(this);
			_updateCommonAncestor.call(this, doc);
			return this;
		},
		
		setEnd : function(node, offset) {
			this.endContainer = node;
			this.endOffset = offset;
			if (this.startContainer === doc) {
				this.startContainer = node;
				this.startOffset = offset;
			}
			_compareAndUpdate.call(this, doc);
			_updateCollapsed.call(this);
			_updateCommonAncestor.call(this, doc);
			return this;
		},
		
		setStartBefore : function(node) {
			return this.setStart(node.parentNode || doc, _node(node).index);
		},
		
		setStartAfter : function(node) {
			return this.setStart(node.parentNode || doc, _node(node).index + 1);
		},
		
		setEndBefore : function(node) {
			return this.setEnd(node.parentNode || doc, _node(node).index);
		},
		
		setEndAfter : function(node) {
			return this.setEnd(node.parentNode || doc, _node(node).index + 1);
		},
		
		selectNode : function(node) {
			this.setStartBefore(node);
			this.setEndAfter(node);
			return this;
		},
		
		selectNodeContents : function(node) {
			var knode = _node(node);
			if (knode.type == 3 || knode.isSingle()) {
				this.selectNode(node);
			} else {
				if (knode.children.length > 0) {
					this.setStartBefore(knode.first.get());
					this.setEndAfter(knode.last.get());
				} else {
					this.setStart(node, 0);
					this.setEnd(node, 0);
				}
			}
			return this;
		},
		
		collapse : function(toStart) {
			if (toStart) this.setEnd(this.startContainer, this.startOffset);
			else this.setStart(this.endContainer, this.endOffset);
			return this;
		},
		
		compareBoundaryPoints : function(how, range) {
			var rangeA = this.get(),
				rangeB = range.get();
			if (_IE) {
				var arr = {};
				arr[_START_TO_START] = 'StartToStart';
				arr[_START_TO_END] = 'EndToStart';
				arr[_END_TO_END] = 'EndToEnd';
				arr[_END_TO_START] = 'StartToEnd';
				var cmp = rangeA.compareEndPoints(arr[how], rangeB);
				if (cmp !== 0) return cmp;
				var nodeA, nodeB, posA, posB;
				if (how === _START_TO_START || how === _END_TO_START) {
					nodeA = this.startContainer;
					posA = this.startOffset;
				}
				if (how === _START_TO_END || how === _END_TO_END) {
					nodeA = this.endContainer;
					posA = nodeA.nodeType == 1 ? this.endOffset - 1 : this.endOffset;
				}
				if (how === _START_TO_START || how === _START_TO_END) {
					nodeB = range.startContainer;
					posB = range.startOffset;
				}
				if (how === _END_TO_END || how === _END_TO_START) {
					nodeB = range.endContainer;
					posB = nodeB.nodeType == 1 ? range.endOffset - 1 : range.endOffset;
				}
				if (nodeA === nodeB) return 0;
				var childA = nodeA,
					childB = nodeB;
				if (nodeA.nodeType === 1) {
					childA = nodeA.childNodes[posA];
					if (childA === nodeB) {
						if (how === _START_TO_START || how === _END_TO_START) return -1;
						if (how === _END_TO_END || how === _START_TO_END) return 1;
					}
				}
				if (nodeB.nodeType === 1) {
					childB = nodeB.childNodes[posB];
					if (childB === nodeA) {
						if (how === _START_TO_START || how === _END_TO_START) return 1;
						if (how === _END_TO_END || how === _START_TO_END) return -1;
					}
				}
				if (childA && childB === childA.nextSibling) return -1;
				if (childB && childA === childB.nextSibling) return 1;
				var bool = _node(childB).isAncestor(childA);
				if (how === _START_TO_START || how === _END_TO_START) return bool ? -1 : 1;
				if (how === _END_TO_END || how === _START_TO_END) return bool ? 1 : -1;
			} else {
				return rangeA.compareBoundaryPoints(how, rangeB);
			}
		},
		
		cloneRange : function() {
			var range = _range(doc);
			range.setStart(this.startContainer, this.startOffset);
			range.setEnd(this.endContainer, this.endOffset);
			return range;
		},
		
		toString : function() {
			//TODO
			var rng = this.get(),
				str = _IE ? rng.text : rng.toString();
			return str.replace(/\r\n|\n|\r/g, '');
		},
		
		cloneContents : function() {
			return _copyAndDelete.call(this, doc, true, false);
		},
		
		deleteContents : function() {
			return _copyAndDelete.call(this, doc, false, true);
		},
		
		extractContents : function() {
			return _copyAndDelete.call(this, doc, true, true);
		},
		
		insertNode : function(node) {
			var startContainer = this.startContainer,
				startOffset = this.startOffset,
				endContainer = this.endContainer,
				endOffset = this.endOffset,
				afterNode,
				parentNode,
				endNode,
				endTextNode,
				endTextPos,
				eq = startContainer == endContainer,
				isFrag = node.nodeName.toLowerCase() === '#document-fragment';
			if (endContainer.nodeType == 1 && endOffset > 0) {
				endNode = endContainer.childNodes[endOffset - 1];
				if (endNode.nodeType == 3) {
					eq = startContainer == endNode;
					if (eq) endTextPos = endNode.nodeValue.length;
				}
			}
			if (startContainer.nodeType == 1) {
				if (startContainer.childNodes.length > 0) {
					afterNode = startContainer.childNodes[startOffset];
				} else {
					parentNode = startContainer;
				}
			} else {
				if (startOffset == 0) {
					afterNode = startContainer;
				} else if (startOffset < startContainer.length) {
					afterNode = startContainer.splitText(startOffset);
					if (eq) {
						endTextNode = afterNode;
						endTextPos = endTextPos ? endTextPos - startOffset : this.endOffset - startOffset;
						this.setEnd(endTextNode, endTextPos);
					}
				} else {
					if (startContainer.nextSibling) {
						afterNode = startContainer.nextSibling;
					} else {
						parentNode = startContainer.parentNode;
					}
				}
			}
			if (afterNode) afterNode.parentNode.insertBefore(node, afterNode);
			if (parentNode) parentNode.appendChild(node);
			if (isFrag) {
				if (node.firstChild) this.setStartBefore(node.firstChild);
				if (this.collapsed) {
					if (afterNode) endNode = afterNode.previousSibling;
					if (parentNode) endNode = parentNode.lastChild;
				}
			} else {
				this.setStartBefore(node);
				if (this.collapsed) endNode = node;
			}
			if (endNode) this.setEndAfter(endNode);
			return this;
		},
		
		surroundContents : function(node) {
			node.appendChild(this.extractContents());
			return this.insertNode(node);
		},
		
		get : function() {
			var startContainer = this.startContainer,
				startOffset = this.startOffset,
				endContainer = this.endContainer,
				endOffset = this.endOffset,
				range;
			if (doc.createRange) {
				range = doc.createRange();
				range.selectNodeContents(doc.body);
			} else {
				range = doc.body.createTextRange();
			}
			if (_IE) {
				range.setEndPoint('StartToStart', _getEndRange(startContainer, startOffset));
				range.setEndPoint('EndToStart', _getEndRange(endContainer, endOffset));
			} else {
				range.setStart(startContainer, startOffset);
				range.setEnd(endContainer, endOffset);
			}
			return range;
		},
		
		html : function() {
			return _node(this.cloneContents()).outer();
		}
	};
}
//更新collapsed
function _updateCollapsed() {
	this.collapsed = (this.startContainer === this.endContainer && this.startOffset === this.endOffset);
}
//更新commonAncestorContainer
function _updateCommonAncestor(doc) {
	function getParents(node) {
		var parents = [];
		while (node) {
			parents.push(node);
			node = node.parentNode;
		}
		return parents;
	}
	var parentsA = getParents(this.startContainer),
		parentsB = getParents(this.endContainer),
		i = 0, lenA = parentsA.length, lenB = parentsB.length, parentA, parentB;
	while (++i) {
		parentA = parentsA[lenA - i], parentB = parentsB[lenB - i];
		if (!parentA || !parentB || parentA !== parentB) break;
	}
	this.commonAncestorContainer = parentsA[lenA - i + 1];
}
//检查开始节点和结束节点的位置，校正错误设置
function _compareAndUpdate(doc) {
	var rangeA = _range(doc),
		rangeB = _range(doc);
	rangeA.startContainer = rangeA.endContainer = this.startContainer;
	rangeA.startOffset = rangeA.endOffset = this.startOffset;
	rangeB.startContainer = rangeB.endContainer = this.endContainer;
	rangeB.startOffset = rangeB.endOffset = this.endOffset;
	if (rangeA.compareBoundaryPoints(_START_TO_START, rangeB) == 1) {
		this.startContainer = this.endContainer;
		this.startOffset = this.endOffset;
	}
}

/*
	根据参数复制或删除KRange的内容。
	cloneContents: copyAndDelete(true, false)
	extractContents: copyAndDelete(true, true)
	deleteContents: copyAndDelete(false, true)
*/
function _copyAndDelete(doc, isCopy, isDelete) {
	var self = this,
		startContainer = self.startContainer,
		startOffset = self.startOffset,
		endContainer = self.endContainer,
		endOffset = self.endOffset,
		nodeList = [],
		selfRange = self;
	if (isDelete) {
		selfRange = self.cloneRange();
		self.collapse(true);
		if (startContainer.nodeType == 3 && startOffset == 0) {
			self.setStart(startContainer.parentNode, 0);
			self.setEnd(startContainer.parentNode, 0);
		}
	}
	function splitTextNode(node, startOffset, endOffset) {
		var length = node.nodeValue.length,
			centerNode;
		if (isCopy) {
			var cloneNode = node.cloneNode(true),
			centerNode = cloneNode.splitText(startOffset);
			centerNode.splitText(endOffset - startOffset);
		}
		if (isDelete) {
			var center = node;
			if (startOffset > 0) center = node.splitText(startOffset);
			if (endOffset < length) center.splitText(endOffset - startOffset);
			nodeList.push(center);
		}
		return centerNode;
	}
	function getTextNode(node) {
		if (node == startContainer && node == endContainer) {
			return splitTextNode(node, startOffset, endOffset);
		} else if (node == startContainer) {
			return splitTextNode(node, startOffset, node.nodeValue.length);
		} else if (node == endContainer) {
			return splitTextNode(node, 0, endOffset);
		} else {
			return splitTextNode(node, 0, node.nodeValue.length);
		}
	}
	function extractNodes(parent, frag) {
		var node = parent.firstChild;
		while (node) {
			var range = _range(doc);
			range.selectNode(node);
			if (range.compareBoundaryPoints(_END_TO_START, selfRange) >= 0) return false;
			var nextNode = node.nextSibling;
			if (range.compareBoundaryPoints(_START_TO_END, selfRange) > 0) {
				var type = node.nodeType;
				if (type == 1) {
					if (range.compareBoundaryPoints(_START_TO_START, selfRange) >= 0) {
						if (isCopy) {
							frag.appendChild(node.cloneNode(true));
						}
						if (isDelete) {
							nodeList.push(node);
						}
					} else {
						var childFlag;
						if (isCopy) {
							childFlag = node.cloneNode(false);
							frag.appendChild(childFlag);
						}
						if (!extractNodes(node, childFlag)) return false;
					}
				} else if (type == 3) {
					var textNode = getTextNode(node);
					if (textNode) frag.appendChild(textNode);
				}
			}
			node = nextNode;
		}
		return true;
	}
	var frag = doc.createDocumentFragment(),
		ancestor = selfRange.commonAncestorContainer;
	if (ancestor.nodeType == 3) {
		var textNode = getTextNode(ancestor);
		if (textNode) frag.appendChild(textNode);
	} else {
		extractNodes(ancestor, frag);
	}
	for (var i = 0, len = nodeList.length; i < len; i++) {
		var node = nodeList[i];
		node.parentNode.removeChild(node);
	}
	return isCopy ? frag : self;
}
//根据原生Range，取得开始节点和结束节点的位置。IE专用
function _getStartEnd(rng, isStart) {
	var doc = rng.parentElement().ownerDocument;
	var range = _range(doc);
	var pointRange = rng.duplicate();
	pointRange.collapse(isStart);
	var parent = pointRange.parentElement();
	var children = parent.childNodes;
	if (children.length == 0) {
		range.selectNode(parent);
		return {node: range.startContainer, offset: range.startOffset};
	}
	var startNode = doc, startPos = 0, isEnd = false;
	var testRange = rng.duplicate();
	testRange.moveToElementText(parent);
	for (var i = 0, len = children.length; i < len; i++) {
		var node = children[i];
		var cmp = testRange.compareEndPoints('StartToStart', pointRange);
		if (cmp > 0) isEnd = true;
		if (cmp == 0) {
			var range = _range(doc);
			if (node.nodeType == 1) range.selectNode(node);
			else range.setStartBefore(node);
			return {node: range.startContainer, offset: range.startOffset};
		}
		if (node.nodeType == 1) {
			var nodeRange = rng.duplicate();
			nodeRange.moveToElementText(node);
			testRange.setEndPoint('StartToEnd', nodeRange);
			if (isEnd) startPos += nodeRange.text.length;
			else startPos = 0;
		} else if (node.nodeType == 3) {
			testRange.moveStart('character', node.nodeValue.length);
			startPos += node.nodeValue.length;
		}
		if (!isEnd) startNode = node;
	}
	if (!isEnd && startNode.nodeType == 1) {
		range.setStartAfter(parent.lastChild);
		return {node: range.startContainer, offset: range.startOffset};
	}
	testRange = rng.duplicate();
	testRange.moveToElementText(parent);
	testRange.setEndPoint('StartToEnd', pointRange);
	startPos -= testRange.text.length;
	return {node: startNode, offset: startPos};
}
//将原生Range转换成KRange
function _toRange(rng) {
	if (_IE) {
		var doc = rng.parentElement().ownerDocument;
		if (rng.item) {
			var range = _range(doc);
			range.selectNode(rng.item(0));
			return range;
		}
		var start = _getStartEnd(rng, true),
			end = _getStartEnd(rng, false),
			range = _range(doc);
		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);
		return range;
	} else {
		var startContainer = rng.startContainer,
			doc = startContainer.ownerDocument || startContainer,
			range = _range(doc);
		range.setStart(startContainer, rng.startOffset);
		range.setEnd(rng.endContainer, rng.endOffset);
		return range;
	}
}
//取得父节点里的该节点前的纯文本长度。IE专用
function _getBeforeLength(node) {
	var doc = node.ownerDocument,
		len = 0,
		sibling = node.previousSibling;
	while (sibling) {
		if (sibling.nodeType == 1) {
			if (!_node(sibling).isSingle()) {
				var range = doc.body.createTextRange();
				range.moveToElementText(sibling);
				len += range.text.length;
			} else {
				len += 1;
			}
		} else if (sibling.nodeType == 3) {
			len += sibling.nodeValue.length;
		}
		sibling = sibling.previousSibling;
	}
	return len;
}
//根据Node和offset，取得表示该位置的原生Range。IE专用
function _getEndRange(node, offset) {
	var doc = node.ownerDocument || node,
		range = doc.body.createTextRange();
	if (doc == node) {
		range.collapse(true);
		return range;
	}
	if (node.nodeType == 1) {
		var children = node.childNodes,
			isStart,
			child,
			isTemp = false;
		if (offset == 0) {
			child = children[0];
			isStart = true;
		} else {
			child = children[offset - 1];
			isStart = false;
		}
		if (!child) {
			var temp = doc.createTextNode(' ');
			node.appendChild(temp);
			child = temp;
			isTemp = true;
		}
		if (child.nodeName.toLowerCase() === 'head') {
			if (offset === 1) isStart = true;
			if (offset === 2) isStart = false;
			range.collapse(isStart);
			return range;
		}
		if (child.nodeType == 1) {
			range.moveToElementText(child);
			range.collapse(isStart);
		} else {
			range.moveToElementText(node);
			if (isTemp) node.removeChild(temp);
			var len = _getBeforeLength(child);
			len = isStart ? len : len + child.nodeValue.length;
			range.moveStart('character', len);
		}
	} else if (node.nodeType == 3) {
		range.moveToElementText(node.parentNode);
		range.moveStart('character', offset + _getBeforeLength(node));
	}
	return range;
}

K.range = _range;
K.START_TO_START = _START_TO_START;
K.START_TO_END = _START_TO_END;
K.END_TO_END = _END_TO_END;
K.END_TO_START = _END_TO_START;

})(KindEditor);

(function (K, undefined) {

var _each = K.each,
	_node = K.node,
	_range = K.range,
	_IE = K.IE,
	_INLINE_TAGS = K.INLINE_TAGS;

//get window by document
function _getWin(doc) {
	return doc.parentWindow || doc.defaultView;
}
//get current selection of a document
function _getSel(doc) {
	var win = _getWin(doc);
	return win.getSelection ? win.getSelection() : doc.selection;
}

function _cmd(mixed) {
	var sel, doc, rng;
	if (mixed.nodeName) {
		//get selection and original range when mixed is a document or a node
		doc = mixed.nodeName.toLowerCase() === '#document' ? mixed : mixed.ownerDocument;
		sel = _getSel(doc);
		try {
			if (sel.rangeCount > 0) rng = sel.getRangeAt(0);
			else rng = sel.createRange();
		} catch(e) {}
		mixed = rng || doc;
		if (_IE) {
			if (!rng || rng.parentElement().ownerDocument !== doc) return null;
		}
	} else {
		//get selection and original range when mixed is K.range
		var startContainer = mixed.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		sel = _getSel(doc);
		rng = mixed.get();
	}
	var win = _getWin(doc);
	var range = _range(mixed);
	//select a K.range (add K.range to the selection)
	function _select(range) {
		var rng = range.get();
		if (_IE) rng.select();
		else sel.addRange(rng);
		win.focus();
	}
	//new K.range object
	return {
		wrap : function(val) {
			var wrapper = _node(val, doc),
			name = wrapper.name,
			frag = range.extractContents();
			_node(frag).each(function(node) {
				if (node.type == 3 && node.parent().name !== name) {
					var clone = wrapper.clone(false);
					clone.append(node.clone(true));
					node.replaceWith(clone);
				} else if (node.name === name) {
					_each(wrapper.attr(), function(key, val) {
						if (key !== 'style') node.attr(key, val);
					});
					_each(wrapper.css(), function(key, val) {
						node.css(key, val);
					});
				}
			});
			range.insertNode(frag);
			_select(range);
		},
		remove : function(options) {
			_select(range);
		},
		bold : function() {
			this.wrap('<strong></strong>');
		},
		italic : function() {
			this.wrap('<em></em>');
		},
		foreColor : function(val) {
			this.wrap('<span style="color:' + val + ';"></span>');
		},
		hiliteColor : function() {
			this.wrap('<span style="background-color:' + val + ';"></span>');
		},
		removeFormat : function() {
			var options = {
				'*' : 'class,style'
			},
			tags = _INLINE_TAGS.split(',');
			_each(tags, function(key, val) {
				options[val] = '*';
			});
			this.remove(options);
		}
	};
}

function _execCommand(doc, cmdName, ui, val) {
	var cmd = _cmd(doc);
	cmd[cmdName].call(cmd, val);
}

function _queryCommandValue(doc, cmdName) {

}

K.cmd = _cmd;
K.execCommand = _execCommand;
K.queryCommandValue = _queryCommandValue;

})(KindEditor);

(function (K, undefined) {

var _each = K.each,
	_node = K.node,
	_cmd = K.cmd;

function _getIframeDoc(iframe) {
	return iframe.contentDocument || iframe.contentWindow.document;
}

function _getInitHtml(bodyClass, cssPaths) {
	//字符串连加效率低，改用[]
	var html = ['<!doctype html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><title>KindEditor</title>'];
	if (cssPaths) {
		_each(cssPaths, function(i, path) {
			if (path !== '') html[i + 1] = '<link href="' + path + '" rel="stylesheet" />';
		});
	}
	html.push('</head><body ' + (bodyClass ? 'class="' + bodyClass + '"' : '') + '></body></html>');
	return html.join('');
}

function _edit(expr, options) {
	var srcElement = _node(expr),
		iframe = null,
		bodyClass = options.bodyClass,
		cssPaths = options.cssPaths;
	var obj = {
		cmd : null,
		doc : null,
		width : options.width || 0,
		height : options.height || 0,
		val : function(val) {
			var self = this,
				body = self.doc.body;
			if (val === undefined) {
				return _node(body).html();
			} else {
				_node(body).html(val);
				return self;
			}
		},
		create : function() {
			var self = this;
			if (iframe !== null) return self;
			//create elements
			iframe = _node('<iframe class="ke-iframe" frameborder="0"></iframe>');
			iframe.css({
				display : 'block',
				width : self.width,
				height : self.height
			});
			srcElement.before(iframe);
			srcElement.hide();
			var doc = _getIframeDoc(iframe.get());
			doc.designMode = 'on';
			doc.open();
			doc.write(_getInitHtml());
			doc.close();
			self.doc = doc;
			self.val(srcElement.val());
			self.cmd = _cmd(doc);
			//add events
			function selectionHandler(e) {
				var cmd = _cmd(doc);
				if (cmd) self.cmd = cmd;
			}
			self.oninput(selectionHandler);
			_node(doc).bind('mouseup', selectionHandler);
			_node(document).bind('mousedown', selectionHandler);
			return self;
		},
		remove : function() {
			var self = this,
				doc = self.doc;
			if (iframe === null) return self;
			//remove events
			_node(doc).unbind();
			_node(doc.body).unbind();
			_node(document).unbind();
			//remove elements
			srcElement.show();
			srcElement.val(self.val());
			doc.src = 'javascript:false';
			iframe.remove();
			iframe = null;
			return self;
		},
		show : function() {
			iframe && iframe.show();                             
			return this;
		},
		hide : function() {
			iframe && iframe.hide();
			return this;
		},
		focus : function() {
			iframe && iframe.contentWindow.focus();
			return this;
		},
		oninput : function(fn) {
			var self = this,
				doc = self.doc,
				body = doc.body;
			_node(doc).bind('keyup', function(e) {
				if (!e.ctrlKey && !e.altKey && (e.keyCode < 16 || e.keyCode > 18) && e.keyCode != 116) {
					fn(e);
					e.stop();
				}
			});
			function timeoutHandler(e) {
				setTimeout(function() {
					fn(e);
				}, 1);
			}
			_node(body).bind('paste', timeoutHandler);
			_node(body).bind('cut', timeoutHandler);
			return self;
		}
	};
	return obj;
}

K.edit = _edit;

})(KindEditor);

(function (K, undefined) {

var _each = K.each,
	_node = K.node,
	_K = K;

var K = function(options) {
	//_node(document).ready(function() {
	//	var el = _K.create(options);
	//	_node(options.src).append(el);
	//});
};

_each(_K, function(key, val) {
	if (!/^_/.test(key)) K[key] = val;
});

if (window.K === undefined) window.K = K;
window.KindEditor = K;

})(KindEditor);