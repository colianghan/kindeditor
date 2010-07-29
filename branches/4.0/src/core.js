/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name core.js
 * @fileOverview 共同变量和函数
 * @author Longhao Luo
 */

/**
	@name KindEditor
	@namespace KindEditor 命名空间
	@description
	KindEditor 命名空间
*/

/**
	@name K
	@namespace 命名空间 KindEditor 的简写
	@description
	<p>命名空间 KindEditor 的简写。</p>
	<p>注：当页面上已经有K全局变量时，不会覆盖原来的变量K，这时可以使用KindEditor变量。</p>
	@see KindEditor
*/

/**
	@name KE
	@namespace 命名空间，为了兼容3.x
	@description
	命名空间，为了兼容3.x
*/

/**/ var undefined;

/**
	@name KindEditor.kindeditor
	@type {String}
	@description
	当前KindEditor的版本号。
*/
/**
	@name KindEditor.IE
	@type {Boolean}
	@description
	当前浏览器内核为IE时true，否则false。
*/
/**
	@name KindEditor.GECKO
	@type {Boolean}
	@description
	当前浏览器内核为Gecko（Firefox）时true，否则false。
*/
/**
	@name KindEditor.WEBKIT
	@type {Boolean}
	@description
	当前浏览器内核为Webkit（Safari、Chrome）时true，否则false。
*/
/**
	@name KindEditor.OPERA
	@type {Boolean}
	@description
	当前浏览器内核为Opera时true，否则false。
*/
/**
	@name KindEditor.VERSION
	@type {Boolean}
	@description
	当前浏览器的版本号。
*/
var _kindeditor = '${VERSION}',
	_ua = navigator.userAgent.toLowerCase(),
	_IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1,
	_GECKO = _ua.indexOf('gecko') > -1 && _ua.indexOf('khtml') == -1,
	_WEBKIT = _ua.indexOf('applewebkit') > -1,
	_OPERA = _ua.indexOf('opera') > -1,
	_matches = /(?:msie|firefox|webkit|opera)[\/:\s](\d+)/.exec(_ua),
	_VERSION = _matches ? _matches[1] : '0';

/**
	@name KindEditor.isArray
	@function
	@param {Mixed} val 要判断的变量
	@returns {Boolean} 变量为数组时返回true，否则返回false。
	@description
	判断一个变量是不是数组。
	@example
	var bool = K.isArray([1, 2, 3]); //返回true
	bool = K.isArray({one : 1}); //返回false
*/
function _isArray(val) {
	if (!val) {
		return false;
	}
	return Object.prototype.toString.call(val) === '[object Array]';
}

/**
	@name KindEditor.isFunction
	@function
	@param {Mixed} val 要判断的变量
	@returns {Boolean} 变量为函数时返回true，否则返回false。
	@description
	判断一个变量是不是函数。
	@example
	var bool = K.isArray(function () { }); //返回true
	bool = K.isArray({}); //返回false
*/
function _isFunction(val) {
	if (!val) {
		return false;
	}
	return Object.prototype.toString.call(val) === '[object Function]';
}

/**
	@name KindEditor.inArray
	@function
	@param {Mixed} val 要查找的变量
	@param {Array} arr 目标数组
	@returns {Int}
	@description
	查找一个变量在一个数组中第一次出现的索引位置。如果没找到，则返回-1。
	@example
	var index = K.inArray(2, [1, 2, 3]); //返回1
	index = K.inArray(1, [1, 2, 3]); //返回0
	index = K.inArray(10, [1, 2, 3]); //返回-1
*/
function _inArray(val, arr) {
	for (var i = 0, len = arr.length; i < len; i++) {
		if (val === arr[i]) {
			return i;
		}
	}
	return -1;
}

/**
	@name KindEditor.each
	@function
	@param {Object|Array} obj 要遍历的对象或数组
	@param {function} fn 回调函数，回调函数的第一个参数为key，第二个参数为value。
	@returns {undefined}
	@description
	遍历一个对象或数组。
	@example
	//遍历数组
	K.each([1, 2, 3], function (i) {
		console.log(i + ':' + this);
	});
	//遍历对象
	K.each({one : 1, two : 2}, function (key, val) {
		console.log(key + ':' + val);
	});
*/
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

/**
	@name KindEditor.trim
	@function
	@param {String} str
	@returns {String}
	@description
	清除字符串两边的空白。
	@example
	var str = K.trim(' abc '); //返回"abc"
*/
function _trim(str) {
	return str.replace(/^\s+|\s+$/g, '');
}

/**
	@name KindEditor.inString
	@function
	@param {String} val 要判断的字符串
	@param {String} str 用delimiter分隔的目标字符串
	@param {String} [delimiter = ","] 分隔符
	@returns {Boolean}
	@description
	判断一个字符串是否包含在目标字符串里。
	@example
	var bool = K.inString('aaa', 'abc,aaa,bbb,ccc'); //返回true
	bool = K.inString('aaa', 'abc aaa bbb ccc', ' '); //返回true
*/
function _inString(val, str, delimiter) {
	delimiter = delimiter === undefined ? ',' : delimiter;
	return (delimiter + str + delimiter).indexOf(delimiter + val + delimiter) >= 0;
}

/**
	@name KindEditor.addUnit
	@function
	@param {String|Int} val 长度
	@returns {String} 带单位的完整长度
	@description
	一个数字后面加px，如果已经有单位则返回原值。
	@example
	var width = K.addUnit(100); //返回"100px"
*/
function _addUnit(val) {
	return val && /^\d+$/.test(val) ? val + 'px' : val;
}

/**
	@name KindEditor.removeUnit
	@function
	@param {String} val 长度
	@returns {Int} 带单位的完整长度
	@description
	从一个字符串中提取数字，如果没有数字则返回0。
	@example
	var width = K.removeUnit('100px'); //返回100
*/
function _removeUnit(val) {
	var match;
	return val && (match = /(\d+)/.exec(val)) ? parseInt(match[1], 10) : 0;
}

/**
	@name KindEditor.escape
	@function
	@param {String} val The string being converted.
	@returns {String} The converted string.
	@description
	Convert special characters to HTML entities
*/
function _escape(val) {
	return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
	@name KindEditor.unescape
	@function
	@param {String} val The string to decode.
	@returns {String} The decoded string.
	@description
	Convert special HTML entities back to characters
*/
function _unescape(val) {
	return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

/**
	@name KindEditor.toHex
	@function
	@param {String} color RGB颜色
	@returns {String} 16进制颜色
	@description
	将RGB颜色转换成16进制颜色。
	@example
	var color = K.toHex('rgb(0, 0, 0)'); //返回"#000000"
*/
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

/**
	@name KindEditor.toMap
	@function
	@param {String|Array} 字符串或者数组，字符串时用delimiter分隔的字符串
	@param {String} [delimiter = ","] 分隔符，第一个参数为字符串时有效
	@returns {Object}
	@description
	将一个字符串转换成对象。
	@example
	var map = K.toMap('abc,aaa,bbb'); //返回{abc : true, aaa : true, bbb : true}
*/
function _toMap(val, delimiter) {
	delimiter = delimiter === undefined ? ',' : delimiter;
	var map = {}, arr = _isArray(val) ? val : val.split(delimiter), match;
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

//From http://www.json.org/json2.js
function _json(text) {
	var match;
	if ((match = /\{[\s\S]*\}|\[[\s\S]*\]/.exec(text))) {
		text = match[0];
	}
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	cx.lastIndex = 0;
	if (cx.test(text)) {
		text = text.replace(cx, function (a) {
			return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		});
	}
	if (/^[\],:{}\s]*$/.
	test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
	replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
	replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
		return eval('(' + text + ')');
	}
	throw 'JSON parse error';
}

function _toArray(obj, offset) {
	return Array.prototype.slice.call(obj, offset || 0);
}

function _undef(val, defaultValue) {
	return val === undefined ? defaultValue : val;
}

var _round = Math.round;

var K = {
	kindeditor : _kindeditor,
	IE : _IE,
	GECKO : _GECKO,
	WEBKIT : _WEBKIT,
	OPERA : _OPERA,
	VERSION : _VERSION,
	each : _each,
	isArray : _isArray,
	isFunction : _isFunction,
	inArray : _inArray,
	inString : _inString,
	trim : _trim,
	addUnit : _addUnit,
	removeUnit : _removeUnit,
	escape : _escape,
	unescape : _unescape,
	toHex : _toHex,
	toMap : _toMap,
	toArray : _toArray,
	undef : _undef,
	json : _json
};

var _INLINE_TAG_MAP = _toMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),
	_BLOCK_TAG_MAP = _toMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul'),
	_SINGLE_TAG_MAP = _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),
	_AUTOCLOSE_TAG_MAP = _toMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),
	_FILL_ATTR_MAP = _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'),
	_VALUE_TAG_MAP = _toMap('input,button,textarea,select');
