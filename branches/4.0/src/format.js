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
*/
(function (K, undefined) {

var _SINGLE_TAGS = K.SINGLE_TAGS,
	_trim = K.trim,
	_formatStyle = K._formatStyle,
	_inString = K.inString;

function _formatHtml(html) {
	html = html.replace(/(<pre[^>]*>)([\s\S]*?)(<\/pre>)/ig, function($0, $1, $2, $3){
		return $1 + $2.replace(/<br[^>]*>/ig, '\n') + $3;
	});
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

})(KindEditor);
