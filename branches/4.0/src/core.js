/**
* KindEditor - WYSIWYG HTML Editor
* Copyright (C) 2006-${THISYEAR} Longhao Luo
*
* @site http://www.kindsoft.net/
* @licence LGPL
* @version ${VERSION}
*/

(function (window, undefined) {

var _ua = navigator.userAgent.toLowerCase(),
	_IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1,
	_GECKO = _ua.indexOf('gecko') > -1 && _ua.indexOf('khtml') == -1,
	_WEBKIT = _ua.indexOf('applewebkit') > -1,
	_OPERA = _ua.indexOf('opera') > -1,
	_matches = /(?:msie|firefox|webkit|opera)[\/:\s](\d+)/.exec(_ua),
	_VERSION = _matches ? _matches[1] : '0';

function _isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

function _isFunction(obj) {
	return Object.prototype.toString.call(obj) === '[object Function]';
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

window.KindEditor = {
	IE : _IE,
	GECKO : _GECKO,
	WEBKIT : _WEBKIT,
	OPERA : _OPERA,
	VERSION : _VERSION,
	each : _each,
	isArray : _isArray,
	isFunction : _isFunction,
	inArray : _inArray,
	trim : _trim,
	toHex : _toHex
};

})(window);