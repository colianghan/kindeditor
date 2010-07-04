/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2010 Longhao Luo
*
* @author Longhao Luo <luolonghao@gmail.com>
* @website http:
* @licence LGPL(http:
* @version 4.0 (2010-07-04)
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
	var map = {}, arr = str.split(delimiter);
	_each(arr, function(key, val) {
		map[val] = true;
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

var _props = 'altKey,attrChange,attrName,bubbles,button,cancelable,charCode,clientX,clientY,ctrlKey,currentTarget,data,detail,eventPhase,fromElement,handler,keyCode,layerX,layerY,metaKey,newValue,offsetX,offsetY,originalTarget,pageX,pageY,prevValue,relatedNode,relatedTarget,screenX,screenY,shiftKey,srcElement,target,toElement,view,wheelDelta,which'.split(',');
function _event(el, e) {
	if (!e) {
		return;
	}
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
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;
	};
	obj.stopPropagation = function() {
		if (e.stopPropagation) {
			e.stopPropagation();
		}
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
	var id = _getId(el);
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		_data[id][type][0]();
	}
}

K.bind = _bind;
K.unbind = _unbind;
K.fire = _fire;

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
			endNewline = ' ';
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
	var el, isChild = false;
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

function KNode(node) {
	var self = this;
	self.node = node;

	self.doc = self.node.ownerDocument || self.node;

	self.name = self.node.nodeName.toLowerCase();

	self.type = self.node.nodeType;
	self.win = self.doc.parentWindow || self.doc.defaultView;

	self._prevDisplay = '';
}

KNode.prototype = {

	bind : function(type, fn) {
		_bind(this.node, type, fn);
		return this;
	},
	unbind : function(type, fn) {
		_unbind(this.node, type, fn);
		return this;
	},
	fire : function(type) {
		_fire(this.node, type);
		return this;
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
			node.innerHTML = _formatHtml(val);
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
		div.appendChild(self.node);
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
		return new KNode(this.node.parentNode);
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
		return new KNode(this.node.previousSibling);
	},
	next : function() {
		return new KNode(this.node.nextSibling);
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
					return;
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
	var node, doc;
	if (typeof expr === 'string') {
		if (/<.+>/.test(expr)) {
			doc = root ? root.ownerDocument || root : document;
			var div = doc.createElement('div');
			div.innerHTML = expr;
			node = div.firstChild;
		} else {
			node = _query(expr, root);
		}
	} else {
		node = expr;
	}
	if (!node) {
		return null;
	}
	return new KNode(node);
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
		this.setStartBefore(node);
		return this.setEndAfter(node);
	},

	selectNodeContents : function(node) {
		var knode = _node(node);
		if (knode.type == 3 || knode.isSingle()) {
			return this.selectNode(node);
		}
		var children = knode.children();
		if (children.length > 0) {
			this.setStartBefore(children[0].get());
			return this.setEndAfter(children[children.length - 1].get());
		}
		this.setStart(node, 0);
		return this.setEnd(node, 0);
	},

	collapse : function(toStart) {
		if (toStart) {
			return this.setEnd(this.startContainer, this.startOffset);
		}
		return this.setStart(this.endContainer, this.endOffset);
	},

	compareBoundaryPoints : function(how, range) {
		var rangeA = this.get(),
			rangeB = range.get();
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
		var range = new KRange(this.doc);
		range.setStart(this.startContainer, this.startOffset);
		range.setEnd(this.endContainer, this.endOffset);
		return range;
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
			self.setStartBefore(firstChild);
			self.setEndAfter(lastChild);
		} else {
			self.selectNode(node);
		}
		return self.setEnd(ec, eo);
	},

	surroundContents : function(node) {
		node.appendChild(this.extractContents());
		this.insertNode(node);
		return this.selectNode(node);
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

function _select() {
	var self = this,
		sel = self.sel,
		range = self.range,
		sc = range.startContainer, so = range.startOffset,
		ec = range.endContainer, eo = range.endOffset,
		doc = sc.ownerDocument || sc, win = _getWin(doc), rng;

	if (_IE && sc.nodeType == 1 && range.collapsed) {
		var empty = doc.createTextNode(' ');
		ec.appendChild(empty);
		rng = doc.body.createTextRange();
		rng.moveToElementText(ec);
		rng.collapse(false);
		rng.select();
		ec.removeChild(empty);
		win.focus();
		return this;
	}

	rng = range.get();
	if (_IE) {
		rng.select();
	} else {
		sel.removeAllRanges();
		sel.addRange(rng);
	}
	win.focus();
	return this;
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

function _removeParent(parent) {
	if (parent.firstChild) {
		var node = parent.firstChild;
		while (node) {
			var nextNode = node.nextSibling;
			parent.parentNode.insertBefore(node, parent);
			node = nextNode;
		}
	}
	parent.parentNode.removeChild(parent);
}

function _hasAttrOrCss(knode, map, mapKey) {
	mapKey = mapKey || knode.name;
	if (knode.type !== 1) {
		return false;
	}
	var newMap = _singleKeyMap(map), arr, val;
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			val = arr[i];
			if (val === '*') {
				return true;
			}
			if (val.charAt(0) === '.' && knode.css(val.substr(1)) !== '') {
				return true;
			}
			if (val.charAt(0) !== '.' && knode.attr(val) !== '') {
				return true;
			}
		}
	}
	return false;
}

function _getCommonNode(range, map) {
	var node = range.commonAncestorContainer;
	while (node) {
		var knode = _node(node);
		if (_hasAttrOrCss(knode, map, '*')) {
			return node;
		}
		if (_hasAttrOrCss(knode, map)) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
}

function _splitStartEnd(range, isStart, map) {
	var rng = range.cloneRange(),
		sc = rng.startContainer, so = rng.startOffset,
		doc = sc.ownerDocument || sc;

	var mark;
	if (isStart) {
		var cloneRange = rng.cloneRange();
		mark = _node('<span id="__ke_temp_mark__"></span>', doc);
		cloneRange.collapse(false);
		cloneRange.insertNode(mark.get());
	}

	rng.collapse(isStart);
	var node = rng.startContainer, pos = rng.startOffset,
		parent = node.nodeType == 3 ? node.parentNode : node, needSplit = false;
	while (parent && parent.parentNode) {
		var knode = _node(parent);
		if (!knode.isInline()) {
			break;
		}
		if (!_hasAttrOrCss(knode, map, '*') && !_hasAttrOrCss(knode, map)) {
			break;
		}
		needSplit = true;
		parent = parent.parentNode;
	}
	var result;

	if (needSplit) {

		var newRange = _range(doc), frag;
		if (isStart) {
			newRange.setStartBefore(parent.firstChild);
			newRange.setEnd(node, pos);
			frag = newRange.extractContents();
			newRange.insertNode(frag);
		} else {
			newRange.setStart(node, pos);
			newRange.setEndAfter(parent.lastChild);
			frag = newRange.extractContents();
			parent.appendChild(frag);
		}

		if (isStart) {
			mark = _node('#__ke_temp_mark__', doc);
			rng = _range(doc);
			rng.setStart(newRange.endContainer, newRange.endOffset);
			rng.setEndBefore(mark.get());
			mark.remove();
		} else {
			rng.setStart(sc, so);
			rng.setEnd(newRange.startContainer, newRange.startOffset);
		}
		result = [newRange, rng];
	} else {
		mark = _node('#__ke_temp_mark__', doc);
		if (mark) {
			mark.remove();
		}
	}
	return result;
}

function KCmd(mixed) {
	var self = this, win, doc, sel, rng, range;
	if (mixed.nodeName) {

		doc = mixed.ownerDocument || mixed;
		sel = _getSel(doc);
		try {
			if (sel.rangeCount > 0) {
				rng = sel.getRangeAt(0);
			} else {
				rng = sel.createRange();
			}
		} catch(e) {}
		mixed = rng || doc;
		if (_IE && (!rng || rng.parentElement().ownerDocument !== doc)) {
			return null;
		}
	} else {

		var startContainer = mixed.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		sel = _getSel(doc);
		rng = mixed.get();
	}

	self.win = _getWin(doc);

	self.doc = doc;

	self.sel = sel;

	self.rng = rng;

	self.range = _range(mixed);
}

KCmd.prototype = {
	wrap : function(val) {
		var self = this, doc = self.doc, range = self.range,
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset,
			wrapper = _node(val, doc);

		if (!wrapper.isInline()) {
			range.surroundContents(wrapper.clone(false).get());
			return _select.call(this);
		}

		if (range.collapsed) {
			var el = wrapper.clone(false).get();
			range.insertNode(el);
			range.selectNodeContents(el);
			return _select.call(this);
		}

		var name = wrapper.name,
			attrs = wrapper.attr(),
			styles = wrapper.css();
		function wrapTextNode(node, startOffset, endOffset) {
			var length = node.nodeValue.length, center = node, el = wrapper.clone(false).get();
			if (startOffset > 0) {
				center = node.splitText(startOffset);
			}
			if (endOffset < length) {
				center.splitText(endOffset - startOffset);
			}
			var kparent = _node(node.parentNode);
			if (center === node && kparent.name === name) {
				mergeAttrs(kparent);
			} else {
				center.parentNode.insertBefore(el, center);
				el.appendChild(center);
				if (sc === node) {
					range.setStartBefore(el);
				}
				if (ec === node) {
					range.setEndAfter(el);
				}
			}
		}
		function mergeAttrs(knode) {
			_each(attrs, function(key, val) {
				if (key !== 'style') {
					knode.attr(key, val);
				}
			});
			_each(styles, function(key, val) {
				knode.css(key, val);
			});
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
						knode = _node(node);
						if (testRange.compareBoundaryPoints(_START_TO_START, range) >= 0 &&
							testRange.compareBoundaryPoints(_END_TO_END, range) <= 0 &&
							knode.name === name) {
							mergeAttrs(knode);
						} else {
							if (wrapRange(node) === false) {
								return false;
							}
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
		return _select.call(this);
	},
	remove : function(map) {
		var self = this, doc = self.doc, range = self.range;

		if (range.collapsed) {
			return this;
		}

		var rangeA = _splitStartEnd(range, true, map);
		var rangeB = _splitStartEnd(rangeA ? rangeA[1] : range, false, map);
		range = rangeB ? rangeB[1] : range;

		function removeAttrOrCss(knode, map, mapKey) {
			mapKey = mapKey || knode.name;
			if (knode.type !== 1) {
				return;
			}
			var newMap = _singleKeyMap(map), arr, val;
			if (newMap[mapKey]) {
				arr = newMap[mapKey].split(',');
				allFlag = false;
				for (var i = 0, len = arr.length; i < len; i++) {
					val = arr[i];
					if (val === '*') {
						allFlag = true;
						break;
					}
					if (val.charAt(0) === '.') {
						knode.css(val.substr(1), '');
					} else {
						knode.removeAttr(val);
					}
				}
				if (allFlag) {
					var parent = knode.get(),
						sc = range.startContainer, so = range.startOffset,
						ec = range.endContainer, eo = range.endOffset;

					var startMark = _node('<span id="__ke_temp_start__">', doc),
						endMark = _node('<span id="__ke_temp_end__">', doc);
					range.insertNode(startMark.get());
					range.collapse(false);
					range.insertNode(endMark.get());

					_removeParent(parent);

					startMark = _node('#__ke_temp_start__', doc);
					endMark = _node('#__ke_temp_end__', doc);
					range = _range(doc);
					range.setStartAfter(startMark.get());
					range.setEndBefore(endMark.get());
					range.setStart(range.startContainer, range.startOffset - 1);
					if (range.startContainer == range.endContainer) {
						range.setEnd(range.endContainer, range.endOffset - 1);
					}
					startMark.remove();
					endMark.remove();
				}
			}
		}
		_node(range.commonAncestorContainer).each(function(knode) {
			var testRange = _range(doc);
			testRange.selectNode(knode.get());
			if (testRange.compareBoundaryPoints(_END_TO_START, range) >= 0) {
				return false;
			}
			if (testRange.compareBoundaryPoints(_START_TO_START, range) >= 0) {
				removeAttrOrCss(knode, map, '*');
				removeAttrOrCss(knode, map);
			}
		});
		self.range = range;
		return _select.call(this);
	},

	exec : function(cmd, val) {
		return this[cmd.toLowerCase()](val);
	},

	state : function(cmd) {
		var bool = false;
		try {
			bool = this.doc.queryCommandState(cmd);
		} catch (e) {}
		return bool;
	},

	val : function(cmd) {
		var self = this, doc = self.doc, range = self.range;
		function lc(val) {
			return val.toLowerCase();
		}
		cmd = lc(cmd);
		var val = '', el;
		if (cmd === 'fontfamily' || cmd === 'fontname') {
			val = _nativeCommandValue(doc, 'fontname');
			val = val.replace(/['"]/g, '');
			return lc(val);
		}
		if (cmd === 'formatblock') {
			val = _nativeCommandValue(doc, cmd);
			if (val === '') {
				el = _getCommonNode(range, {'h1,h2,h3,h4,h5,h6,p,div,pre,address' : '*'});
				if (el) {
					val = el.nodeName;
				}
			}
			if (val === 'Normal') {
				val = 'p';
			}
			return lc(val);
		}
		if (cmd === 'fontsize') {
			el = _getCommonNode(range, {'*' : '.font-size'});
			if (el) {
				val = _node(el).css('font-size');
			}
			return lc(val);
		}
		if (cmd === 'forecolor') {
			el = _getCommonNode(range, {'*' : '.color'});
			if (el) {
				val = _node(el).css('color');
			}
			val = _toHex(val);
			if (val === '') {
				val = 'default';
			}
			return lc(val);
		}
		if (cmd === 'hilitecolor') {
			el = _getCommonNode(range, {'*' : '.background-color'});
			val = _toHex(val);
			if (val === '') {
				val = 'default';
			}
			return lc(val);
		}
		return val;
	},
	bold : function() {
		return this.wrap('<strong></strong>');
	},
	italic : function() {
		return this.wrap('<em></em>');
	},
	forecolor : function(val) {
		return this.wrap('<span style="color:' + val + ';"></span>');
	},
	hilitecolor : function(val) {
		return this.wrap('<span style="background-color:' + val + ';"></span>');
	},
	fontsize : function(val) {
		return this.wrap('<span style="font-size:' + val + ';"></span>');
	},
	fontname : function(val) {
		return this.fontfamily(val);
	},
	fontfamily : function(val) {
		return this.wrap('<span style="font-family:' + val + ';"></span>');
	},
	removeformat : function() {
		var map = {
			'*' : 'class,style'
		},
		tags = _INLINE_TAG_MAP;
		_each(tags, function(key, val) {
			map[key] = '*';
		});
		return this.remove(map);
	}
};

function _cmd(mixed) {
	return new KCmd(mixed);
}

K.cmd = _cmd;

function _getIframeDoc(iframe) {
	return iframe.contentDocument || iframe.contentWindow.document;
}

function _getInitHtml(bodyClass, css) {
	var arr = ['<!doctype html><html><head><meta charset="utf-8" /><title>KindEditor</title>'];
	if (css) {
		if (typeof css == 'string' && !/\{[\s\S]*\}/g.test(css)) {
			css = [css];
		}
		if (_isArray(css)) {
			_each(css, function(i, path) {
				if (path !== '') {
					arr.push('<link href="' + path + '" rel="stylesheet" />');
				}
			});
		} else {
			arr.push('<style>' + css + '</style>');
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

function _edit(expr, options) {
	var srcElement = _node(expr),
		designMode = options.designMode === undefined ? true : options.designMode,
		bodyClass = options.bodyClass,
		css = options.css;
	function srcVal(val) {
		return srcElement.hasVal() ? srcElement.val(val) : srcElement.html(val);
	}
	var obj = {

		width : options.width || 0,
		height : options.height || 0,
		html : function(val) {
			this.val(val);
		},
		val : function(val) {
			if (designMode) {
				return _iframeVal.call(this, val);
			} else {
				return _textareaVal.call(this, val);
			}
		},
		create : function() {
			var self = this;
			if (self.iframe) {
				return self;
			}

			var iframe = _node('<iframe class="ke-iframe" frameborder="0"></iframe>');
			iframe.css({
				display : 'block',
				width : self.width,
				height : self.height
			});
			var textarea = _node('<textarea class="ke-textarea"></textarea>');
			textarea.css({
				display : 'block',
				width : self.width,
				height : self.height
			});
			if (designMode) {
				textarea.hide();
			} else {
				iframe.hide();
			}
			srcElement.before(iframe);
			srcElement.before(textarea);
			srcElement.hide();
			var doc = _getIframeDoc(iframe.get());
			doc.open();
			doc.write(_getInitHtml(bodyClass, css));
			doc.close();
			doc.body.contentEditable = 'true';
			self.iframe = iframe;
			self.textarea = textarea;
			self.doc = doc;
			if (designMode) {
				_iframeVal.call(self, srcVal());
			} else {
				_textareaVal.call(self, srcVal());
			}
			self.cmd = _cmd(doc);

			function selectionHandler(e) {
				var cmd = _cmd(doc);
				if (cmd) {
					self.cmd = cmd;
				}
			}
			self.oninput(selectionHandler);
			_node(doc).bind('mouseup', selectionHandler);
			_node(document).bind('mousedown', selectionHandler);

			return self;
		},
		remove : function() {
			var self = this,
				iframe = self.iframe,
				textarea = self.textarea,
				doc = self.doc;
			if (!iframe) {
				return self;
			}

			_node(doc).unbind();
			_node(doc.body).unbind();
			_node(document).unbind();

			srcElement.show();
			srcVal(self.val());
			iframe.remove();
			textarea.remove();
			self.iframe = self.textarea = null;
			return self;
		},
		toggle : function(bool) {
			var self = this,
				iframe = self.iframe,
				textarea = self.textarea;
			if (!iframe) {
				return self;
			}
			if (bool === undefined ? !designMode : bool) {
				if (!designMode) {
					textarea.hide();
					_iframeVal.call(self, _textareaVal.call(self));
					iframe.show();
					designMode = true;
				}
			} else {
				if (designMode) {
					iframe.hide();
					_textareaVal.call(self, _iframeVal.call(self));
					textarea.show();
					designMode = false;
				}
			}
			return self;
		},
		toDesign : function() {
			return this.toggle(true);
		},
		toSource : function() {
			return this.toggle(false);
		},
		focus : function() {
			var self = this;
			if (self.iframe && designMode) {
				self.iframe.contentWindow.focus();
			}
			return self;
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

var _K = K;

K = function(options) {

};

_each(_K, function(key, val) {
	K[key] = val;
});

if (window.K === undefined) {
	window.K = K;
}
window.KindEditor = K;

})(window);
