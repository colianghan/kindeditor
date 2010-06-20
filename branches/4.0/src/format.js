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
*/
(function (K, undefined) {

var _SINGLE_TAGS = K.SINGLE_TAGS,
	_trim = K.trim,
	_toHex = K.toHex,
	_inString = K.inString,
	_ATTR_REG = /\s+(?:([\w-:]+)|(?:([\w-:]+)=([^\s"'<>]+))|(?:([\w-:]+)="([^"]*)")|(?:([\w-:]+)='([^']*)'))(?=(?:\s|\/|>)+)/g,
	_STYLE_REG = /\s*([^\s]+?)\s*:(.*?)(;|$)/g;

function _formatStyle(style) {
	return _trim(style.replace(_STYLE_REG, function($0, $1, $2) {
		return _trim($1.toLowerCase()) + ':' + _trim(_toHex($2)) + ';';
	}));
}

function _getAttrList(tag) {
	var list = {},
		match;
	while (match = _ATTR_REG.exec(tag)) {
		var key = match[1] || match[2] || match[4] || match[6],
			val = match[1] || (match[2] ? match[3] : (match[4] ? match[5] : match[7]));
		list[key] = val;
		if (key.toLowerCase() === 'style') {
			var m;
			while (m = _STYLE_REG.exec(val)) {
				var k = _trim(m[1].toLowerCase()),
					v = _trim(_toHex(m[2]));
				list['.' + k] = v;
			}
		}
	}
	return list;
}

function _formatHtml(html) {
	var re = /((?:\r\n|\n|\r)*)<(\/)?([\w-:]+)((?:\s+|(?:\s+[\w-:]+)|(?:\s+[\w-:]+=[^\s"'<>]+)|(?:\s+[\w-:]+="[^"]*")|(?:\s+[\w-:]+='[^']*'))*)(\/)?>((?:\r\n|\n|\r)*)/g;
	html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
		var startNewline = $1 || '',
			startSlash = $2 || '',
			tagName = $3.toLowerCase(),
			attr = $4 || '',
			endSlash = $5 ? ' ' + $5 : '',
			endNewline = $6 || '';
		if (endSlash === '' && _inString(tagName, _SINGLE_TAGS)) endSlash = ' /';
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
						val = _formatStyle(val);
						if (val === '') return '';
						val = '"' + val + '"';
					}
					if (val.charAt(0) !== '"') val = '"' + val + '"';
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
K._formatStyle = _formatStyle;
K._getAttrList = _getAttrList;

})(KindEditor);
