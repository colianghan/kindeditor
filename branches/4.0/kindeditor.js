/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2010 Longhao Luo
*
* @author Longhao Luo <luolonghao@gmail.com>
* @website http:
* @licence LGPL(http:
* @version 4.0 (2010-07-14)
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
		if (val === arr[i]) {
			return i;
		}
	}
	return -1;
}

function _each(obj, fn) {
	if (_isArray(obj)) {
		for (var i = 0, len = obj.length; i < len; i++) {
			if (fn.call(obj[i], i, obj[i]) === false) {
				break;
			}
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn.call(obj[key], key, obj[key]) === false) {
					break;
				}
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
	function hex(d) {
		var s = parseInt(d, 10).toString(16).toUpperCase();
		return s.length > 1 ? s : '0' + s;
	}
	return color.replace(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/ig,
		function($0, $1, $2, $3) {
			return '#' + hex($1) + hex($2) + hex($3);
		}
	);
}

function _toMap(str, delimiter) {
	delimiter = delimiter === undefined ? ',' : delimiter;
	var map = {}, arr = str.split(delimiter), match;
	_each(arr, function(key, val) {
		if ((match = /^(\d+)\.\.(\d+)$/.exec(val))) {
			for (var i = parseInt(match[1], 10); i <= parseInt(match[2], 10); i++) {
				map[i.toString()] = true;
			}
		} else {
			map[val] = true;
		}
	});
	return map;
}

var _INLINE_TAG_MAP = _toMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),
	_BLOCK_TAG_MAP = _toMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul'),
	_SINGLE_TAG_MAP = _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),
	_AUTOCLOSE_TAG_MAP = _toMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),
	_FILL_ATTR_MAP = _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'),
	_VALUE_TAG_MAP = _toMap('input,button,textarea,select');

var K = {
	IE : _IE,
	GECKO : _GECKO,
	WEBKIT : _WEBKIT,
	OPERA : _OPERA,
	VERSION : _VERSION,
	each : _each,
	isArray : _isArray,
	inArray : _inArray,
	inString : _inString,
	trim : _trim,
	toHex : _toHex,
	toMap : _toMap
};

function _bindEvent(el, type, fn) {
	if (el.addEventListener){
		el.addEventListener(type, fn, false);
	} else if (el.attachEvent){
		el.attachEvent('on' + type, fn);
	}
}

function _unbindEvent(el, type, fn) {
	if (el.removeEventListener){
		el.removeEventListener(type, fn, false);
	} else if (el.detachEvent){
		el.detachEvent('on' + type, fn);
	}
}

var _EVENT_PROPS = 'altKey,attrChange,attrName,bubbles,button,cancelable,charCode,clientX,clientY,ctrlKey,currentTarget,data,detail,eventPhase,fromElement,handler,keyCode,layerX,layerY,metaKey,newValue,offsetX,offsetY,originalTarget,pageX,pageY,prevValue,relatedNode,relatedTarget,screenX,screenY,shiftKey,srcElement,target,toElement,view,wheelDelta,which'.split(',');

function _event(el, event) {
	if (!event) {
		return;
	}
	var e = {},
		doc = el.ownerDocument || el.document || el;
	_each(_EVENT_PROPS, function(key, val) {
		e[val] = event[val];
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

	switch (e.which) {
	case 186 :
		e.which = 59;
		break;
	case 187 :
	case 107 :
	case 43 :
		e.which = 61;
		break;
	case 189 :
	case 45 :
		e.which = 109;
		break;
	case 42 :
		e.which = 106;
		break;
	case 47 :
		e.which = 111;
		break;
	case 78 :
		e.which = 110;
		break;
	}
	if (e.which >= 96 && e.which <= 105) {
		e.which -= 48;
	}
	e.preventDefault = function() {
		if (event.preventDefault) {
			event.preventDefault();
		}
		event.returnValue = false;
	};
	e.stopPropagation = function() {
		if (event.stopPropagation) {
			event.stopPropagation();
		}
		event.cancelBubble = true;
	};
	e.stop = function() {
		this.preventDefault();
		this.stopPropagation();
	};
	return e;
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
	if (type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_bind(el, this, fn);
		});
		return;
	}
	var id = _getId(el);
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		_each(_data[id][type], function(key, val) {
			if (val === undefined) {
				_data[id][type].splice(key, 1);
			}
		});
		_unbindEvent(el, type, _data[id][type][0]);
	} else {
		_data[id][type] = [];
	}
	if (_data[id][type].length === 0) {
		_data[id][type][0] = function(e) {
			_each(_data[id][type], function(key, val) {
				if (key > 0 && val) {
					val.call(el, _event(el, e));
				}
			});
		};
	}
	if (_inArray(fn, _data[id][type]) < 0) {
		_data[id][type].push(fn);
	}
	_bindEvent(el, type, _data[id][type][0]);
}

function _unbind(el, type, fn) {
	if (type && type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_unbind(el, this, fn);
		});
		return;
	}
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
				if (_data[id][type][i] === fn) {
					delete _data[id][type][i];
				}
			}
			if (_data[id][type].length == 2 && _data[id][type][1] === undefined) {
				_unbindEvent(el, type, _data[id][type][0]);
				_data[id][type] = [];
			}
		}
	}
}

function _fire(el, type) {
	if (type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_fire(el, this);
		});
		return;
	}
	var id = _getId(el);
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		_data[id][type][0]();
	}
}

function _ready(fn, doc) {
	doc = doc || document;
	var win = doc.parentWindow || doc.defaultView, loaded = false;
	function readyFunc() {
		if (!loaded) {
			loaded = true;
			fn(window.KindEditor);
		}
		_unbind(doc, 'DOMContentLoaded');
		_unbind(doc, 'readystatechange');
		_unbind(win, 'load');
	}
	function ieReadyFunc() {
		if (!loaded) {
			try {
				doc.documentElement.doScroll('left');
			} catch(e) {
				win.setTimeout(ieReadyFunc, 0);
				return;
			}
			readyFunc();
		}
	}
	if (doc.addEventListener) {
		_bind(doc, 'DOMContentLoaded', readyFunc);
	} else if (doc.attachEvent) {
		_bind(doc, 'readystatechange', function() {
			if (doc.readyState === 'complete') {
				readyFunc();
			}
		});
		if (doc.documentElement.doScroll && win.frameElement === undefined) {
			ieReadyFunc();
		}
	}
	_bind(win, 'load', readyFunc);
}

K.bind = _bind;
K.unbind = _unbind;
K.fire = _fire;
K.ready = _ready;

function _getCssList(css) {
	var list = {},
		reg = /\s*([\w\-]+)\s*:([^;]*)(;|$)/g,
		match;
	while ((match = reg.exec(css))) {
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
	while ((match = reg.exec(tag))) {
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

function _formatHtml(html) {
	var re = /((?:[\r\n])*)<(\/)?([\w-:]+)(\s*(?:[\w-:]+)(?:=(?:"[^"]*"|'[^']*'|[^\s"'<>]*))?)*\s*(\/)?>((?:[\r\n])*)/g;
	html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
		var startNewline = $1 || '',
			startSlash = $2 || '',
			tagName = $3.toLowerCase(),
			attr = $4 || '',
			endSlash = $5 ? ' ' + $5 : '',
			endNewline = $6 || '';
		if (endSlash === '' && _SINGLE_TAG_MAP[tagName]) {
			endSlash = ' /';
		}
		if (endNewline) {
			endNewline = '';
		}
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
						if (val === '') {
							return '';
						}
						val = '"' + val + '"';
					}
					if (!/^['"]/.test(val)) {
						val = '"' + val + '"';
					}
				}
				return ' ' + key + '=' + val + ' ';
			});
			attr = _trim(attr);
			attr = attr.replace(/\s+/g, ' ');
			if (attr) {
				attr = ' ' + attr;
			}
			return startNewline + '<' + startSlash + tagName + attr + endSlash + '>' + endNewline;
		} else {
			return startNewline + '<' + startSlash + tagName + endSlash + '>' + endNewline;
		}
	});
	return _trim(html);
}

K.formatHtml = _formatHtml;

function _contains(nodeA, nodeB) {
	var docA = nodeA.ownerDocument || nodeA,
		docB = nodeB.ownerDocument || nodeB;
	if (docA !== docB) {
		return false;
	}
	if (nodeB === docB) {
		return false;
	}
	if (nodeA === docA) {
		return true;
	}
	if (nodeA.nodeType === 3) {
		return false;
	}
	if (nodeB.nodeType === 3) {
		nodeB = nodeB.parentNode;
		if (!nodeB) {
			return false;
		}
		if (nodeA === nodeB) {
			return true;
		}
	}
	if (nodeA.compareDocumentPosition) {
		return !!(nodeA.compareDocumentPosition(nodeB) & 16);
	}
	return nodeA !== nodeB && nodeA.contains(nodeB);
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
		var arr = [];
		var doc = root.ownerDocument || root;
		var el = doc.getElementById(stripslashes(id));
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
		var arr = [];
		var els = root.getElementsByName(stripslashes(name));
		for (var i = 0, len = els.length, el; i < len; i++) {
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
		var arr = [];
		var els = root.getElementsByTagName(tag);
		for (var i = 0, len = els.length, el; i < len; i++) {
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
			var els = root.getElementsByTagName(tag);
			for (var i = 0, len = els.length, el; i < len; i++) {
				el = els[i];
				if (el.nodeType == 1) {
					arr.push(el);
				}
			}
		}
		return arr;
	}
	var parts = [];
	var arr, re = /((?:\\.|[^\s>])+|[\s>])/g;
	while ((arr = re.exec(expr))) {
		if (arr[1] !== ' ') {
			parts.push(arr[1]);
		}
	}
	var results = [];
	if (parts.length == 1) {
		return select(parts[0], root);
	}
	var isChild = false;
	for (var i = 0, lenth = parts.length; i < lenth; i++) {
		var part = parts[i];
		if (part === '>') {
			isChild = true;
			continue;
		}
		if (i > 0) {
			var els = [];
			for (var j = 0, len = results.length, val = results[j]; j < len; j++) {
				var subResults = select(part, val);
				for (var k = 0, l = subResults.length, v = subResults[k]; k < l; k++) {
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

function _query(expr, root) {
	var arr = _queryAll(expr, root);
	return arr.length > 0 ? arr[0] : null;
}

K.query = _query;
K.queryAll = _queryAll;

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

function KNode(node) {
	var self = this;
	self.node = node;

	self.doc = self.node.ownerDocument || self.node;

	self.name = self.node.nodeName.toLowerCase();

	self.type = self.node.nodeType;
	self.win = self.doc.parentWindow || self.doc.defaultView;

	self._data = {};
	self._prevDisplay = '';
}

KNode.prototype = {

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
	opacity : function(val) {
		var self = this, node = self.node;
		if (node.style.opacity === undefined) {
			node.style.filter = val == 1 ? '' : 'alpha(opacity=' + (val * 100) + ')';
			return self;
		}
		node.style.opacity = val == 1 ? '' : val;
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
	if (expr && expr.get) {
		return expr;
	}
	return newNode(expr);
}

K.node = _node;

var _START_TO_START = 0,
	_START_TO_END = 1,
	_END_TO_END = 2,
	_END_TO_START = 3;

function _updateCollapsed() {
	this.collapsed = (this.startContainer === this.endContainer && this.startOffset === this.endOffset);
}

function _updateCommonAncestor() {
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
		parentA = parentsA[lenA - i];
		parentB = parentsB[lenB - i];
		if (!parentA || !parentB || parentA !== parentB) {
			break;
		}
	}
	this.commonAncestorContainer = parentsA[lenA - i + 1];
}

function _copyAndDelete(isCopy, isDelete) {
	var self = this, doc = self.doc,
		sc = self.startContainer, so = self.startOffset,
		ec = self.endContainer, eo = self.endOffset,
		nodeList = [], selfRange = self;
	if (isDelete) {
		selfRange = self.cloneRange();
		if (sc.nodeType == 3 && so === 0) {
			self.setStart(sc.parentNode, 0);
		}
		self.collapse(true);
	}
	function splitTextNode(node, startOffset, endOffset) {
		var length = node.nodeValue.length, centerNode;
		if (isCopy) {
			var cloneNode = node.cloneNode(true);
			centerNode = cloneNode.splitText(startOffset);
			centerNode.splitText(endOffset - startOffset);
		}
		if (isDelete) {
			var center = node;
			if (startOffset > 0) {
				center = node.splitText(startOffset);
			}
			if (endOffset < length) {
				center.splitText(endOffset - startOffset);
			}
			nodeList.push(center);
		}
		return centerNode;
	}
	function extractNodes(parent, frag) {
		var textNode;
		if (parent.nodeType == 3) {
			textNode = splitTextNode(parent, so, eo);
			if (isCopy) {
				frag.appendChild(textNode);
			}
			return false;
		}
		var node = parent.firstChild, testRange, nextNode;
		while (node) {
			testRange = new KRange(doc);
			testRange.selectNode(node);
			if (testRange.compareBoundaryPoints(_END_TO_START, selfRange) >= 0) {
				return false;
			}
			nextNode = node.nextSibling;
			if (testRange.compareBoundaryPoints(_START_TO_END, selfRange) > 0) {
				if (node.nodeType == 1) {
					if (testRange.compareBoundaryPoints(_START_TO_START, selfRange) >= 0 && testRange.compareBoundaryPoints(_END_TO_END, selfRange) <= 0) {
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
						if (extractNodes(node, childFlag) === false) {
							return false;
						}
					}
				} else if (node.nodeType == 3) {
					if (node == sc && node == ec) {
						textNode = splitTextNode(node, so, eo);
					} else if (node == sc) {
						textNode = splitTextNode(node, so, node.nodeValue.length);
					} else if (node == ec) {
						textNode = splitTextNode(node, 0, eo);
					} else {
						textNode = splitTextNode(node, 0, node.nodeValue.length);
					}
					if (isCopy) {
						frag.appendChild(textNode);
					}
				}
			}
			node = nextNode;
		}
	}
	var frag = doc.createDocumentFragment();
	extractNodes(selfRange.commonAncestorContainer, frag);

	for (var i = 0, len = nodeList.length; i < len; i++) {
		var node = nodeList[i];
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}
	return isCopy ? frag : self;
}

function _getStartEnd(rng, isStart) {
	var doc = rng.parentElement().ownerDocument,
		pointRange = rng.duplicate();
	pointRange.collapse(isStart);
	var parent = pointRange.parentElement(),
		children = parent.childNodes;
	if (children.length === 0) {
		return {node: parent.parentNode, offset: _node(parent).index()};
	}
	var startNode = doc, startPos = 0, isEnd = false;
	var testRange = rng.duplicate();
	testRange.moveToElementText(parent);
	for (var i = 0, len = children.length; i < len; i++) {
		var node = children[i];
		var cmp = testRange.compareEndPoints('StartToStart', pointRange);
		if (cmp > 0) {
			isEnd = true;
		}
		if (cmp === 0) {
			return {node: node.parentNode, offset: i};
		}
		if (node.nodeType == 1) {
			var nodeRange = rng.duplicate();
			nodeRange.moveToElementText(node);
			testRange.setEndPoint('StartToEnd', nodeRange);
			if (isEnd) {
				startPos += nodeRange.text.length;
			} else {
				startPos = 0;
			}
		} else if (node.nodeType == 3) {
			testRange.moveStart('character', node.nodeValue.length);
			startPos += node.nodeValue.length;
		}
		if (!isEnd) {
			startNode = node;
		}
	}
	if (!isEnd && startNode.nodeType == 1) {
		return {node: parent, offset: _node(parent.lastChild).index() + 1};
	}
	testRange = rng.duplicate();
	testRange.moveToElementText(parent);
	testRange.setEndPoint('StartToEnd', pointRange);
	startPos -= testRange.text.length;
	return {node: startNode, offset: startPos};
}

function _toRange(rng) {
	var doc, range;
	if (_IE) {
		doc = rng.parentElement().ownerDocument;
		if (rng.item) {
			range = new KRange(doc);
			range.selectNode(rng.item(0));
			return range;
		}
		var start = _getStartEnd(rng, true),
			end = _getStartEnd(rng, false);
		range = new KRange(doc);
		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);
		return range;
	} else {
		var startContainer = rng.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		range = new KRange(doc);
		range.setStart(startContainer, rng.startOffset);
		range.setEnd(rng.endContainer, rng.endOffset);
		return range;
	}
}

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

function _getEndRange(node, offset) {
	var doc = node.ownerDocument || node,
		range = doc.body.createTextRange();
	if (doc == node) {
		range.collapse(true);
		return range;
	}
	if (node.nodeType == 1) {
		var children = node.childNodes, isStart, child, isTemp = false, temp;
		if (offset === 0) {
			child = children[0];
			isStart = true;
		} else {
			child = children[offset - 1];
			isStart = false;
		}
		if (!child) {
			temp = doc.createTextNode(' ');
			node.appendChild(temp);
			child = temp;
			isTemp = true;
		}
		if (child.nodeName.toLowerCase() === 'head') {
			if (offset === 1) {
				isStart = true;
			}
			if (offset === 2) {
				isStart = false;
			}
			range.collapse(isStart);
			return range;
		}
		if (child.nodeType == 1) {
			range.moveToElementText(child);
			range.collapse(isStart);
		} else {
			range.moveToElementText(node);
			if (isTemp) {
				node.removeChild(temp);
			}
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

function KRange(doc) {
	var self = this;

	self.startContainer = doc;

	self.startOffset = 0;

	self.endContainer = doc;

	self.endOffset = 0;

	self.collapsed = true;

	self.commonAncestorContainer = doc;
	self.doc = doc;
}

KRange.prototype = {

	setStart : function(node, offset) {
		var self = this, doc = self.doc;
		self.startContainer = node;
		self.startOffset = offset;
		if (self.endContainer === doc) {
			self.endContainer = node;
			self.endOffset = offset;
		}
		_updateCollapsed.call(this);
		_updateCommonAncestor.call(this);
		return self;
	},

	setEnd : function(node, offset) {
		var self = this, doc = self.doc;
		self.endContainer = node;
		self.endOffset = offset;
		if (self.startContainer === doc) {
			self.startContainer = node;
			self.startOffset = offset;
		}
		_updateCollapsed.call(this);
		_updateCommonAncestor.call(this);
		return self;
	},

	setStartBefore : function(node) {
		return this.setStart(node.parentNode || this.doc, _node(node).index());
	},

	setStartAfter : function(node) {
		return this.setStart(node.parentNode || this.doc, _node(node).index() + 1);
	},

	setEndBefore : function(node) {
		return this.setEnd(node.parentNode || this.doc, _node(node).index());
	},

	setEndAfter : function(node) {
		return this.setEnd(node.parentNode || this.doc, _node(node).index() + 1);
	},

	selectNode : function(node) {
		return this.setStartBefore(node).setEndAfter(node);
	},

	selectNodeContents : function(node) {
		var knode = _node(node);
		if (knode.type == 3 || knode.isSingle()) {
			return this.selectNode(node);
		}
		var children = knode.children();
		if (children.length > 0) {
			return this.setStartBefore(children[0].get()).setEndAfter(children[children.length - 1].get());
		}
		return this.setStart(node, 0).setEnd(node, 0);
	},

	collapse : function(toStart) {
		if (toStart) {
			return this.setEnd(this.startContainer, this.startOffset);
		}
		return this.setStart(this.endContainer, this.endOffset);
	},

	compareBoundaryPoints : function(how, range) {
		var rangeA = this.get(), rangeB = range.get();
		if (!this.doc.createRange) {
			var arr = {};
			arr[_START_TO_START] = 'StartToStart';
			arr[_START_TO_END] = 'EndToStart';
			arr[_END_TO_END] = 'EndToEnd';
			arr[_END_TO_START] = 'StartToEnd';
			var cmp = rangeA.compareEndPoints(arr[how], rangeB);
			if (cmp !== 0) {
				return cmp;
			}
			var nodeA, nodeB, nodeC, posA, posB;
			if (how === _START_TO_START || how === _END_TO_START) {
				nodeA = this.startContainer;
				posA = this.startOffset;
			}
			if (how === _START_TO_END || how === _END_TO_END) {
				nodeA = this.endContainer;
				posA = this.endOffset;
			}
			if (how === _START_TO_START || how === _START_TO_END) {
				nodeB = range.startContainer;
				posB = range.startOffset;
			}
			if (how === _END_TO_END || how === _END_TO_START) {
				nodeB = range.endContainer;
				posB = range.endOffset;
			}

			if (nodeA === nodeB) {
				var diff = posA - posB;
				return diff > 0 ? 1 : (diff < 0 ? -1 : 0);
			}

			nodeC = nodeB;
			while (nodeC && nodeC.parentNode !== nodeA) {
				nodeC = nodeC.parentNode;
			}
			if (nodeC) {
				return _node(nodeC).index() >= posA ? -1 : 1;
			}

			nodeC = nodeA;
			while (nodeC && nodeC.parentNode !== nodeB) {
				nodeC = nodeC.parentNode;
			}
			if (nodeC) {
				return _node(nodeC).index() >= posB ? 1 : -1;
			}

		} else {
			return rangeA.compareBoundaryPoints(how, rangeB);
		}
	},

	cloneRange : function() {
		return new KRange(this.doc).setStart(this.startContainer, this.startOffset).setEnd(this.endContainer, this.endOffset);
	},

	toString : function() {

		var rng = this.get(),
			str = this.doc.createRange ? rng.toString() : rng.text;
		return str.replace(/\r\n|\n|\r/g, '');
	},

	cloneContents : function() {
		return _copyAndDelete.call(this, true, false);
	},

	deleteContents : function() {
		return _copyAndDelete.call(this, false, true);
	},

	extractContents : function() {
		return _copyAndDelete.call(this, true, true);
	},

	insertNode : function(node) {
		var self = this,
			sc = self.startContainer, so = self.startOffset,
			ec = self.endContainer, eo = self.endOffset,
			firstChild, lastChild, c, nodeCount = 1;

		if (node.nodeName.toLowerCase() === '#document-fragment') {
			firstChild = node.firstChild;
			lastChild = node.lastChild;
			nodeCount = node.childNodes.length;
		}

		if (sc.nodeType == 1) {
			c = sc.childNodes[so];
			if (c) {
				sc.insertBefore(node, c);

				if (sc === ec) {
					eo += nodeCount;
				}
			} else {
				sc.appendChild(node);
			}

		} else if (sc.nodeType == 3) {
			if (so === 0) {
				sc.parentNode.insertBefore(node, sc);

				if (sc.parentNode === ec) {
					eo += nodeCount;
				}
			} else if (so >= sc.nodeValue.length) {
				sc.parentNode.appendChild(node);
			} else {
				c = sc.splitText(so);
				sc.parentNode.insertBefore(node, c);

				if (sc === ec) {
					ec = c;
					eo -= so;
				}
			}
		}
		if (firstChild) {
			self.setStartBefore(firstChild).setEndAfter(lastChild);
		} else {
			self.selectNode(node);
		}
		return self.setEnd(ec, eo);
	},

	surroundContents : function(node) {
		node.appendChild(this.extractContents());
		return this.insertNode(node).selectNode(node);
	},

	get : function() {
		var self = this, doc = self.doc,
			sc = self.startContainer, so = self.startOffset,
			ec = self.endContainer, eo = self.endOffset, rng;
		if (doc.createRange) {
			rng = doc.createRange();
			try {
				rng.setStart(sc, so);
				rng.setEnd(ec, eo);
			} catch (e) {}
		} else {
			rng = doc.body.createTextRange();
			rng.setEndPoint('StartToStart', _getEndRange(sc, so));
			rng.setEndPoint('EndToStart', _getEndRange(ec, eo));
		}
		return rng;
	},

	html : function() {
		return _node(this.cloneContents()).outer();
	}
};

function _range(mixed) {
	if (!mixed.nodeName) {
		return mixed.get ? mixed : _toRange(mixed);
	}
	return new KRange(mixed);
}

K.range = _range;
K.START_TO_START = _START_TO_START;
K.START_TO_END = _START_TO_END;
K.END_TO_END = _END_TO_END;
K.END_TO_START = _END_TO_START;

var _INPUT_KEY_MAP = _toMap('9,32,48..57,59,61,65..90,106,109..111,188,190..192,219..222');

var _CURSORMOVE_KEY_MAP = _toMap('8,13,33..40,46');

var _CHANGE_KEY_MAP = {};
_each(_INPUT_KEY_MAP, function(key, val) {
	_CHANGE_KEY_MAP[key] = val;
});
_each(_CURSORMOVE_KEY_MAP, function(key, val) {
	_CHANGE_KEY_MAP[key] = val;
});

function _nativeCommandValue(doc, cmd) {
	var val = '';
	try {
		val = doc.queryCommandValue(cmd);
	} catch (e) {}
	if (typeof val !== 'string') {
		val = '';
	}
	return val;
}

function _getWin(doc) {
	return doc.parentWindow || doc.defaultView;
}

function _getSel(doc) {
	var win = _getWin(doc);
	return win.getSelection ? win.getSelection() : doc.selection;
}

function _getRng(doc) {
	var sel = _getSel(doc), rng;
	try {
		if (sel.rangeCount > 0) {
			rng = sel.getRangeAt(0);
		} else {
			rng = sel.createRange();
		}
	} catch(e) {}
	rng = rng || doc;
	if (_IE && (!rng || rng.parentElement().ownerDocument !== doc)) {
		return null;
	}
	return rng;
}

function _singleKeyMap(map) {
	var newMap = {}, arr, v;
	_each(map, function(key, val) {
		arr = key.split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			v = arr[i];
			newMap[v] = val;
		}
	});
	return newMap;
}

function _hasAttrOrCss(knode, map) {
	return _hasAttrOrCssByKey(knode, map, '*') || _hasAttrOrCssByKey(knode, map);
}
function _hasAttrOrCssByKey(knode, map, mapKey) {
	mapKey = mapKey || knode.name;
	if (knode.type !== 1) {
		return false;
	}
	var newMap = _singleKeyMap(map), arr, key, val, method;
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			key = arr[i];
			if (key === '*') {
				return true;
			}
			var match = /^(\.?)([^=]+)(?:=([^=]+))?$/.exec(key);
			method = match[1] ? 'css' : 'attr';
			key = match[2];
			val = match[3] || '';
			if (val === '' && knode[method](key) !== '') {
				return true;
			}
			if (val !== '' && knode[method](key) === val) {
				return true;
			}
		}
	}
	return false;
}

function _removeAttrOrCss(knode, map) {
	_removeAttrOrCssByKey(knode, map, '*');
	_removeAttrOrCssByKey(knode, map);
}
function _removeAttrOrCssByKey(knode, map, mapKey) {
	mapKey = mapKey || knode.name;
	if (knode.type !== 1) {
		return;
	}
	var newMap = _singleKeyMap(map), arr, key;
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		allFlag = false;
		for (var i = 0, len = arr.length; i < len; i++) {
			key = arr[i];
			if (key === '*') {
				allFlag = true;
				break;
			}
			var match = /^(\.?)([^=]+)(?:=([^=]+))?$/.exec(key);
			key = match[2];
			if (match[1]) {
				knode.css(key, '');
			} else {
				knode.removeAttr(key);
			}
		}
		if (allFlag) {
			if (knode.first()) {
				var kchild = knode.first();
				while (kchild) {
					var next = kchild.next();
					knode.before(kchild);
					kchild = next;
				}
			}
			knode.remove();
		}
	}
}

function _getInnerNode(knode) {
	var inner = knode;
	while (inner.first()) {
		inner = inner.first();
	}
	return inner;
}

function _isEmptyNode(knode) {
	return _getInnerNode(knode).isInline();
}

function _mergeWrapper(a, b) {
	a = a.clone(true);
	var lastA = _getInnerNode(a), childA = a, merged = false;
	while (b) {
		while (childA) {
			if (childA.name === b.name) {
				_mergeAttrs(childA, b.attr(), b.css());
				merged = true;
			}
			childA = childA.first();
		}
		if (!merged) {
			lastA.append(b.clone(false));
		}
		merged = false;
		b = b.first();
	}
	return a;
}

function _wrapNode(knode, wrapper) {
	wrapper = wrapper.clone(true);

	if (knode.type == 3) {
		_getInnerNode(wrapper).append(knode.clone(false));
		knode.before(wrapper);
		knode.remove();
		return wrapper;
	}

	var nodeWrapper = knode, child;
	while ((child = knode.first()) && child.children().length == 1) {
		knode = child;
	}

	var next, frag = knode.doc.createDocumentFragment();
	while ((child = knode.first())) {
		next = child.next();
		frag.appendChild(child.get());
		child = next;
	}
	wrapper = _mergeWrapper(nodeWrapper, wrapper);
	if (frag.firstChild) {
		_getInnerNode(wrapper).append(frag);
	}
	nodeWrapper.before(wrapper);
	nodeWrapper.remove();
	return wrapper;
}

function _mergeAttrs(knode, attrs, styles) {
	_each(attrs, function(key, val) {
		if (key !== 'style') {
			knode.attr(key, val);
		}
	});
	_each(styles, function(key, val) {
		knode.css(key, val);
	});
}

function _getCommonNode(range, map) {
	var ec = range.endContainer, eo = range.endOffset,
		knode = _node((ec.nodeType == 3 || eo === 0) ? ec : ec.childNodes[eo - 1]),
		child = knode;
	while (child && (child = child.firstChild) && child.childNodes.length == 1) {
		if (_hasAttrOrCss(child, map)) {
			return child;
		}
	}
	while (knode) {
		if (_hasAttrOrCss(knode, map)) {
			return knode;
		}
		knode = knode.parent();
	}
	return null;
}

function KCmd(range) {
	var self = this, doc = range.doc;

	self.doc = doc;
	self.win = _getWin(doc);
	self.sel = _getSel(doc);
	self.range = range;

	self._preformat = null;
	self._preremove = null;
}

KCmd.prototype = {
	select : function() {
		var self = this, sel = self.sel, range = self.range.cloneRange(),
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset,
			doc = sc.ownerDocument || sc, win = _getWin(doc), rng;

		if (_IE && sc.nodeType == 1 && range.collapsed) {
			var empty = _node('<span>&nbsp;</span>', doc);
			range.insertNode(empty.get());
			rng = doc.body.createTextRange();
			rng.moveToElementText(empty.get());
			rng.collapse(false);
			rng.select();
			empty.remove();
			win.focus();
			return self;
		}

		rng = range.get();
		if (_IE) {
			rng.select();
		} else {
			sel.removeAllRanges();
			sel.addRange(rng);
		}
		win.focus();
		return self;
	},
	wrap : function(val) {
		var self = this, doc = self.doc, range = self.range, wrapper,
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;

		if (typeof val == 'string') {
			wrapper = _node(val, doc);

		} else {
			wrapper = val;
		}

		if (range.collapsed) {

			if (self._preformat) {
				wrapper = _mergeWrapper(self._preformat.wrapper, wrapper);
			}
			self._preformat = {
				wrapper : wrapper,
				range : range.cloneRange()
			};
			return self;
		}

		if (!wrapper.isInline()) {
			var w = wrapper.clone(true), child = w;

			while (child.first()) {
				child = child.first();
			}
			child.append(range.extractContents());
			range.insertNode(w.get()).selectNode(w.get());
			return self;
		}

		function wrapTextNode(node, startOffset, endOffset) {
			var length = node.nodeValue.length, center = node;
			if (endOffset <= startOffset) {
				return;
			}
			if (startOffset > 0) {
				center = node.splitText(startOffset);
			}
			if (endOffset < length) {
				center.splitText(endOffset - startOffset);
			}
			var parent, knode = _node(center),
				isStart = sc == node, isEnd = ec == node;

			while ((parent = knode.parent()) && parent.isInline() && parent.children().length == 1) {
				if (!isStart) {
					isStart = sc == parent.get();
				}
				if (!isEnd) {
					isEnd = ec == parent.get();
				}
				knode = parent;
			}
			var el = _wrapNode(knode, wrapper).get();
			if (isStart) {
				range.setStartBefore(el);
			}
			if (isEnd) {
				range.setEndAfter(el);
			}
		}

		function wrapRange(parent) {
			var node = parent.firstChild;
			if (parent.nodeType == 3) {
				wrapTextNode(parent, so, eo);
				return false;
			}
			var testRange, nextNode, knode;
			while (node) {
				testRange = _range(doc);
				testRange.selectNode(node);
				if (testRange.compareBoundaryPoints(_END_TO_START, range) >= 0) {
					return false;
				}
				nextNode = node.nextSibling;
				if (testRange.compareBoundaryPoints(_START_TO_END, range) > 0) {
					if (node.nodeType == 1) {
						if (wrapRange(node) === false) {
							return false;
						}
					} else if (node.nodeType == 3) {
						if (node == sc && node == ec) {
							wrapTextNode(node, so, eo);
						} else if (node == sc) {
							wrapTextNode(node, so, node.nodeValue.length);
						} else if (node == ec) {
							wrapTextNode(node, 0, eo);
						} else {
							wrapTextNode(node, 0, node.nodeValue.length);
						}
					}
				}
				node = nextNode;
			}
		}
		wrapRange(range.commonAncestorContainer);

		return self;
	},
	split : function(isStart, map) {
		var range = this.range, doc = range.doc,
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;

		var tempRange = range.cloneRange().collapse(isStart);
		var node = tempRange.startContainer, pos = tempRange.startOffset,
			parent = node.nodeType == 3 ? node.parentNode : node,
			needSplit = false;
		while (parent && parent.parentNode) {
			var knode = _node(parent);
			if (!knode.isInline()) {
				break;
			}
			if (!_hasAttrOrCss(knode, map)) {
				break;
			}
			needSplit = true;
			parent = parent.parentNode;
		}

		if (needSplit) {
			var mark = doc.createElement('span');
			range.cloneRange().collapse(!isStart).insertNode(mark);
			if (isStart) {
				tempRange.setStartBefore(parent.firstChild).setEnd(node, pos);
			} else {
				tempRange.setStart(node, pos).setEndAfter(parent.lastChild);
			}
			var frag = tempRange.extractContents(),
				first = frag.firstChild, last = frag.lastChild;
			if (isStart) {
				tempRange.insertNode(frag);
				range.setStartAfter(last).setEndBefore(mark);
			} else {
				parent.appendChild(frag);
				range.setStartBefore(mark).setEndBefore(first);
			}
			var markParent = mark.parentNode;
			markParent.removeChild(mark);
			if (!isStart && markParent === range.endContainer) {
				range.setEnd(range.endContainer, range.endOffset - 1);
			}
		}
		return this;
	},
	remove : function(map) {
		var self = this, doc = self.doc, range = self.range;

		if (range.collapsed) {
			self._preremove = {
				map : map,
				range : range.cloneRange()
			};
			return self;
		}

		self.split(true, map);
		self.split(false, map);

		var nodeList = [];
		_node(range.commonAncestorContainer).each(function(knode) {
			var testRange = _range(doc);
			testRange.selectNode(knode.get());
			if (testRange.compareBoundaryPoints(_END_TO_START, range) >= 0) {
				return false;
			}
			if (testRange.compareBoundaryPoints(_START_TO_START, range) >= 0) {
				nodeList.push(knode);
			}
		});

		var sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		if (so > 0) {
			var before = _node(sc.childNodes[so - 1]);
			if (before && _isEmptyNode(before)) {
				before.remove();
				range.setStart(sc, so - 1);
				if (sc == ec) {
					range.setEnd(ec, eo - 1);
				}
			}

			before = _node(sc.childNodes[so]);
			if (before && _isEmptyNode(before)) {
				before.remove();
				if (sc == ec) {
					range.setEnd(ec, eo - 1);
				}
			}
		}
		var after = _node(ec.childNodes[range.endOffset]);
		if (after && _isEmptyNode(after)) {
			after.remove();
		}

		_each(nodeList, function() {
			_removeAttrOrCss(this, map);
		});

		return self;
	},
	_applyPreformat : function() {
		var self = this, range = self.range,
			format = self._preformat, remove = self._preremove;
		if (format || remove) {
			if (format) {
				range.setStart(format.range.startContainer, format.range.startOffset);
			} else {
				range.setStart(remove.range.startContainer, remove.range.startOffset);
			}
			if (format) {
				self.wrap(format.wrapper);
			}
			if (remove) {
				self.remove(remove.map);
			}

			var sc = range.startContainer, so = range.startOffset,
				textNode = _getInnerNode(_node(sc.nodeType == 3 ? sc : sc.childNodes[so])).get();
			range.setEnd(textNode, textNode.nodeValue.length);
			range.collapse(false);
			self.select();
			self._preformat = null;
			self._preremove = null;
		}
	},

	exec : function(cmd, val) {
		return this[cmd.toLowerCase()](val);
	},

	state : function(cmd) {
		var self = this, doc = self.doc, range = self.range, bool = false;
		try {
			bool = doc.queryCommandState(cmd);
		} catch (e) {}
		return bool;
	},

	val : function(cmd) {
		var self = this, doc = self.doc, range = self.range;
		function lc(val) {
			return val.toLowerCase();
		}
		cmd = lc(cmd);
		var val = '', knode;
		if (cmd === 'fontfamily' || cmd === 'fontname') {
			val = _nativeCommandValue(doc, 'fontname');
			val = val.replace(/['"]/g, '');
			return lc(val);
		}
		if (cmd === 'formatblock') {
			val = _nativeCommandValue(doc, cmd);
			if (val === '') {
				knode = _getCommonNode(range, {'h1,h2,h3,h4,h5,h6,p,div,pre,address' : '*'});
				if (knode) {
					val = knode.name;
				}
			}
			if (val === 'Normal') {
				val = 'p';
			}
			return lc(val);
		}
		if (cmd === 'fontsize') {
			knode = _getCommonNode(range, {'*' : '.font-size'});
			if (knode) {
				val = knode.css('font-size');
			}
			return lc(val);
		}
		if (cmd === 'forecolor') {
			knode = _getCommonNode(range, {'*' : '.color'});
			if (knode) {
				val = knode.css('color');
			}
			val = _toHex(val);
			if (val === '') {
				val = 'default';
			}
			return lc(val);
		}
		if (cmd === 'hilitecolor') {
			knode = _getCommonNode(range, {'*' : '.background-color'});
			if (knode) {
				val = knode.css('background-color');
			}
			val = _toHex(val);
			if (val === '') {
				val = 'default';
			}
			return lc(val);
		}
		return val;
	},
	toggle : function(wrapper, map) {
		var self = this;
		if (_getCommonNode(self.range, map)) {
			self.remove(map);
		} else {
			self.wrap(wrapper);
		}
		return self.select();
	},
	bold : function() {
		return this.toggle('<strong></strong>', {
			span : '.font-weight=bold',
			strong : '*',
			b : '*'
		});
	},
	italic : function() {
		return this.toggle('<em></em>', {
			span : '.font-style=italic',
			em : '*',
			i : '*'
		});
	},
	underline : function() {
		return this.toggle('<u></u>', {
			span : '.text-decoration=underline',
			u : '*'
		});
	},
	strikethrough : function() {
		return this.toggle('<s></s>', {
			span : '.text-decoration=line-through',
			s : '*'
		});
	},
	forecolor : function(val) {
		return this.toggle('<span style="color:' + val + ';"></span>', {
			span : '.color=' + val,
			font : 'color'
		});
	},
	hilitecolor : function(val) {
		return this.toggle('<span style="background-color:' + val + ';"></span>', {
			span : '.background-color=' + val
		});
	},
	fontsize : function(val) {
		return this.toggle('<span style="font-size:' + val + ';"></span>', {
			span : '.font-size=' + val,
			font : 'size'
		});
	},
	fontname : function(val) {
		return this.fontfamily(val);
	},
	fontfamily : function(val) {
		return this.toggle('<span style="font-family:' + val + ';"></span>', {
			span : '.font-family=' + val,
			font : 'face'
		});
	},
	removeformat : function() {
		var map = {
			'*' : 'class,style'
		},
		tags = _INLINE_TAG_MAP;
		_each(tags, function(key, val) {
			map[key] = '*';
		});
		this.remove(map);
		return this.select();
	},

	oninput : function(fn) {
		var self = this, doc = self.doc;
		_node(doc).bind('keyup', function(e) {
			if (!e.ctrlKey && !e.altKey && _INPUT_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
			}
		});
		return self;
	},

	oncursormove : function(fn) {
		var self = this, doc = self.doc;
		_node(doc).bind('keyup', function(e) {
			if (!e.ctrlKey && !e.altKey && _CURSORMOVE_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
			}
		});
		_node(doc).bind('mouseup', fn);
		return self;
	},

	onchange : function(fn) {
		var self = this, doc = self.doc, body = doc.body;
		_node(doc).bind('keyup', function(e) {
			if (!e.ctrlKey && !e.altKey && _CHANGE_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
			}
		});
		_node(doc).bind('mouseup', fn);
		if (doc !== document) {
			_node(document).bind('mousedown', fn);
		}
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

function _cmd(mixed) {

	if (mixed.nodeName) {
		var doc = mixed.ownerDocument || mixed,
			rng = _getRng(doc),
			cmd = new KCmd(_range(rng || doc));

		cmd.onchange(function(e) {
			rng = _getRng(doc);
			if (rng) {
				cmd.range = _range(rng);
			}
		});

		cmd.oninput(function(e) {
			cmd._applyPreformat();
		});

		cmd.oncursormove(function(e) {
			cmd._preformat = null;
			cmd._preremove = null;
		});
		return cmd;
	}

	return new KCmd(mixed);
}

K.cmd = _cmd;

function _getIframeDoc(iframe) {
	return iframe.contentDocument || iframe.contentWindow.document;
}

function _getInitHtml(bodyClass, cssData) {
	var arr = ['<!doctype html><html><head><meta charset="utf-8" /><title>KindEditor</title>'];
	if (cssData) {
		if (typeof cssData == 'string' && !/\{[\s\S]*\}/g.test(cssData)) {
			cssData = [cssData];
		}
		if (_isArray(cssData)) {
			_each(cssData, function(i, path) {
				if (path !== '') {
					arr.push('<link href="' + path + '" rel="stylesheet" />');
				}
			});
		} else {
			arr.push('<style>' + cssData + '</style>');
		}
	}
	arr.push('</head><body ' + (bodyClass ? 'class="' + bodyClass + '"' : '') + '></body></html>');
	return arr.join('');
}

function _iframeVal(val) {
	var self = this,
		body = self.doc.body;
	if (val === undefined) {
		return _node(body).html();
	} else {
		_node(body).html(val);
		return self;
	}
}

function _textareaVal(val) {
	var self = this,
		textarea = self.textarea;
	if (val === undefined) {
		return textarea.val();
	} else {
		textarea.val(val);
		return self;
	}
}

function _elementVal(knode, val) {
	return knode.hasVal() ? knode.val(val) : knode.html(val);
}

function KEdit(options) {
	var self = this;
	self.srcElement = _node(options.srcElement);
	self.width = options.width || 0;
	self.height = options.height || 0;
	self.designMode = options.designMode === undefined ? true : options.designMode;
	self.bodyClass = options.bodyClass;
	self.cssData = options.cssData;
}

KEdit.prototype = {
	html : function(val) {
		this.val(val);
	},
	val : function(val) {
		var self = this;
		if (self.designMode) {
			return _iframeVal.call(self, val);
		} else {
			return _textareaVal.call(self, val);
		}
	},
	create : function(expr) {
		var self = this;
		if (self.div) {
			return self;
		}

		var div = _node(expr).addClass('ke-edit'),
		iframe = _node('<iframe class="ke-edit-iframe" frameborder="0"></iframe>'),
		textarea = _node('<textarea class="ke-edit-textarea"></textarea>'),
		srcElement = self.srcElement,
		commonCss = {
			display : 'block',
			width : self.width,
			height : self.height
		};
		div.css(commonCss);
		iframe.css(commonCss);
		textarea.css(commonCss);
		if (self.designMode) {
			textarea.hide();
		} else {
			iframe.hide();
		}
		div.append(iframe);
		div.append(textarea);
		srcElement.hide();
		var doc = _getIframeDoc(iframe.get());
		doc.designMode = 'on';
		doc.open();
		doc.write(_getInitHtml(self.bodyClass, self.cssData));
		doc.close();
		self.div = div;
		self.iframe = iframe;
		self.textarea = textarea;
		self.doc = doc;
		if (self.designMode) {
			_iframeVal.call(self, _elementVal(srcElement));
		} else {
			_textareaVal.call(self, _elementVal(srcElement));
		}
		self.cmd = _cmd(doc);
		return self;
	},
	remove : function() {
		var self = this,
			div = self.div,
			iframe = self.iframe,
			textarea = self.textarea,
			doc = self.doc,
			srcElement = self.srcElement;
		if (!div) {
			return self;
		}

		_node(doc).unbind();
		_node(doc.body).unbind();
		_node(document).unbind();

		_elementVal(srcElement, self.val());
		srcElement.show();
		iframe.remove();
		textarea.remove();
		div.removeClass('ke-edit').css({
			display : '',
			width : '',
			height : ''
		});
		self.div = self.iframe = self.textarea = null;
		return self;
	},
	design : function(bool) {
		var self = this,
			iframe = self.iframe,
			textarea = self.textarea;
		if (!iframe) {
			return self;
		}
		if (bool === undefined ? !self.designMode : bool) {
			if (!self.designMode) {
				textarea.hide();
				_iframeVal.call(self, _textareaVal.call(self));
				iframe.show();
				self.designMode = true;
			}
		} else {
			if (self.designMode) {
				iframe.hide();
				_textareaVal.call(self, _iframeVal.call(self));
				textarea.show();
				self.designMode = false;
			}
		}
		return self;
	},
	focus : function() {
		var self = this;
		if (self.iframe && self.designMode) {
			self.iframe.contentWindow.focus();
		}
		return self;
	}
};

function _edit(options) {
	return new KEdit(options);
}

K.edit = _edit;

function _bindToolbarEvent(itemNode, item) {
	itemNode.bind('mouseover', function(e) {
		this.addClass('ke-toolbar-icon-outline-on');
		e.stop();
	});
	itemNode.bind('mouseout', function(e) {
		this.removeClass('ke-toolbar-icon-outline-on');
		e.stop();
	});
	itemNode.bind('click', function(e) {
		item.click.call(this);
		e.stop();
	});
}

function KToolbar(options) {
	var self = this;
	self.width = options.width || 0;
	self.height = options.height || 0;
	self.items = [];
	self.itemNodes = [];
	self.disableMode = options.disableMode === undefined ? false : options.disableMode;
	self.noDisableItems = options.noDisableItems === undefined ? [] : options.noDisableItems;
}

KToolbar.prototype = {
	addItem : function(item) {
		this.items.push(item);
	},
	create : function(expr) {
		var self = this;
		if (self.div) {
			return self;
		}
		var div = _node(expr).addClass('ke-toolbar').css('width', self.width), itemNode,
			inner = _node('<div class="ke-toolbar-inner"></div>');
		div.bind('contextmenu,dbclick,mousedown,mousemove', function(e) {
			e.stop();
		});
		_each(self.items, function(i, item) {
			if (item.name == '|') {
				itemNode = _node('<span class="ke-inline-block ke-toolbar-separator"></span>');
			} else if (item.name == '/') {
				itemNode = _node('<br />');
			} else {
				itemNode = _node('<a class="ke-inline-block ke-toolbar-icon-outline" href="#"></a>');
				itemNode.append(_node('<span class="ke-inline-block ke-toolbar-icon ke-toolbar-icon-url ke-icon-' + item.name + '"></span>'));
				_bindToolbarEvent(itemNode, item);
			}
			itemNode.data('item', item);
			self.itemNodes.push(itemNode);
			inner.append(itemNode);
		});
		self.div = div.append(inner);
		return self;
	},
	remove : function() {
		var self = this;
		if (!self.div) {
			return self;
		}
		_each(self.itemNodes, function() {
			this.remove();
		});
		self.itemNodes = [];
		self.div.removeClass('ke-toolbar').css('width', '').unbind();
		self.div.html('');
		self.div = null;
		return self;
	},
	disable : function(bool) {
		var self = this, arr = self.noDisableItems, item;

		if (bool === undefined ? !self.disableMode : bool) {
			_each(self.itemNodes, function() {
				item = this.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					this.addClass('ke-toolbar-icon-outline-disabled');
					this.opacity(0.5);
					if (item.name !== '|') {
						this.unbind();
					}
				}
			});
			self.disableMode = true;

		} else {
			_each(self.itemNodes, function() {
				item = this.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					this.removeClass('ke-toolbar-icon-outline-disabled');
					this.opacity(1);
					if (item.name !== '|') {
						_bindToolbarEvent(this, item);
					}
				}
			});
			self.disableMode = false;
		}
		return self;
	}
};

function _toolbar(options) {
	return new KToolbar(options);
}

K.toolbar = _toolbar;

var _plugins = {};

function _plugin(name, obj) {
	if (obj === undefined) {
		return _plugins[name];
	}
	_plugins[name] = obj;
}

var _scriptPath = (function() {
	var els = document.getElementsByTagName('script'), src;
	for (var i = 0, len = els.length; i < len; i++) {
		src = els[i].src || '';
		if (src.match(/kindeditor[\w\-\.]*\.js/)) {
			return src.substring(0, src.lastIndexOf('/') + 1);
		}
	}
	return '';
})();

var _options = {
	designMode : true,
	fullscreenMode : false,
	filterMode : false,
	shadowMode : true,
	scriptPath : _scriptPath,
	urlType : '',
	newlineType : 'p',
	resizeType : 2,
	dialogAlignType : 'page',
	bodyClass : 'ke-content',
	cssData : '',
	minWidth : 200,
	minHeight : 100,
	minChangeSize : 5,
	items : [
		'source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		'superscript', '|', 'selectall', '/',
		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
		'flash', 'media', 'advtable', 'hr', 'emoticons', 'link', 'unlink', '|', 'about'
	],
	colors : [
		['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
		['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
		['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
		['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
	],
	htmlTags : {
		font : ['color', 'size', 'face', '.background-color'],
		span : [
			'.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align'
		],
		div : [
			'align', '.border', '.margin', '.padding', '.text-align', '.color',
			'.background-color', '.font-size', '.font-family', '.font-weight', '.background',
			'.font-style', '.text-decoration', '.vertical-align', '.margin-left'
		],
		table: [
			'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
			'.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
			'.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
			'.width', '.height'
		],
		'td,th': [
			'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
			'.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
			'.font-style', '.text-decoration', '.vertical-align', '.background'
		],
		a : ['href', 'target', 'name'],
		embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', '/'],
		img : ['src', 'width', 'height', 'border', 'alt', 'title', '.width', '.height', '/'],
		hr : ['/'],
		br : ['/'],
		'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
			'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
		],
		'tbody,tr,strong,b,sub,sup,em,i,u,strike' : []
	}
};

function KEditor(options) {
	var self = this;
	_each(options, function(key, val) {
		self[key] = options[key];
	});
	_each(_options, function(key, val) {
		if (self[key] === undefined) {
			self[key] = val;
		}
	});
	var se = _node(self.srcElement);
	if (!self.width) {
		self.width = se.css('width') || (se.offsetWidth || self.minWidth) + 'px';
	}
	if (!self.height) {
		self.height = se.css('height') || (se.offsetHeight || self.minHeight) + 'px';
	}
	self.srcElement = se;
}

KEditor.prototype = {
	create : function() {
		var self = this,
			containerDiv = _node('<div></div>').css('width', self.width),
			toolbarDiv = _node('<div></div>'),
			editDiv = _node('<div></div>'),
			statusbarDiv = _node('<div></div>');
		containerDiv.append(toolbarDiv).append(editDiv).append(statusbarDiv);
		if (self.fullscreenMode) {
			_node(document.body).append(containerDiv);
		} else {
			self.srcElement.before(containerDiv);
		}
		var toolbar = _toolbar({
				width : '100%',
				noDisableItems : 'source,fullscreen'.split(',')
			}),
			edit = _edit({
				srcElement : self.srcElement,
				width : '100%',
				height : self.height,
				designMode : self.designMode,
				bodyClass : self.bodyClass,
				cssData : self.cssData
			}).create(editDiv);
		_each(self.items, function(i, name) {
			toolbar.addItem({
				name : name,
				click : function() {
					_plugin(name).click(self);
				}
			});
		});
		toolbar.create(toolbarDiv);
		self.containerDiv = containerDiv;
		self.toolbar = toolbar;
		self.edit = edit;
		return self;
	},
	remove : function() {
		var self = this;
		self.toolbar.remove();
		self.edit.remove();
		self.containerDiv.remove();
		self.containerDiv = self.toolbar = self.edit = null;
	}
};

var _editors = {};

function _create(id, options) {
	if (!options) {
		options = {};
	}
	if (!options.srcElement) {
		options.srcElement = _node('#' + id) || _node('[name=' + id + ']');
	}
	var editor = new KEditor(options).create();
	_editors[id] = editor;
	return editor;
}

function _remove(id) {
	_editors[id].remove();
}

if (_IE && _VERSION < 7) {
	try {
		document.execCommand('BackgroundImageCache', false, true);
	} catch (e) {}
}

_plugin('source', {
	click : function(editor) {
		editor.toolbar.disable();
		editor.edit.design();
	}
});

_each('bold,italic,underline,strikethrough,removeformat'.split(','), function(i, name) {
	_plugin(name, {
		click : function(editor) {
			editor.edit.cmd[name]();
		}
	});
});

K.create = _create;
K.remove = _remove;
K.plugin = _plugin;

var _K = K;
K = function(id, options) {
	_ready(function() {
		_create(id, options);
	});
};
_each(_K, function(key, val) {
	K[key] = val;
});
if (window.K === undefined) {
	window.K = K;
}
window.KindEditor = K;

})(window);
