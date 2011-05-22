
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

function _formatUrl(url, mode, host, pathname) {
	if (!mode) {
		return url;
	}
	mode = mode.toLowerCase();
	if (_inArray(mode, ['absolute', 'relative', 'domain']) < 0) {
		return url;
	}
	host = host || location.protocol + '//' + location.host;
	if (pathname === undefined) {
		var m = location.pathname.match(/^(\/.*)\//);
		pathname = m ? m[1] : '';
	}
	var match;
	if ((match = /^(\w+:\/\/[^\/]*)/.exec(url))) {
		if (match[1] !== host) {
			return url;
		}
	} else if (/^\w+:/.test(url)) {
		return url;
	}
	function getRealPath(path) {
		var parts = path.split('/'), paths = [];
		for (var i = 0, len = parts.length; i < len; i++) {
			var part = parts[i];
			if (part == '..') {
				if (paths.length > 0) {
					paths.pop();
				}
			} else if (part !== '' && part != '.') {
				paths.push(part);
			}
		}
		return '/' + paths.join('/');
	}
	if (/^\//.test(url)) {
		url = host + getRealPath(url.substr(1));
	} else if (!/^\w+:\/\//.test(url)) {
		url = host + getRealPath(pathname + '/' + url);
	}
	function getRelativePath(path, depth) {
		if (url.substr(0, path.length) === path) {
			var arr = [];
			for (var i = 0; i < depth; i++) {
				arr.push('..');
			}
			var prefix = '.';
			if (arr.length > 0) {
				prefix += '/' + arr.join('/');
			}
			if (pathname == '/') {
				prefix += '/';
			}
			return prefix + url.substr(path.length);
		} else {
			if ((match = /^(.*)\//.exec(path))) {
				return getRelativePath(match[1], ++depth);
			}
		}
	}
	if (mode === 'relative') {
		url = getRelativePath(host + pathname, 0).substr(2);
	} else if (mode === 'absolute') {
		if (url.substr(0, host.length) === host) {
			url = url.substr(host.length);
		}
	}
	return url;
}

function _formatHtml(html, htmlTags, urlType) {
	urlType = urlType || '';
	var isFilter = htmlTags ? true : false;
	html = html.replace(/(<pre[^>]*>)([\s\S]*?)(<\/pre>)/ig, function($0, $1, $2, $3){
		return $1 + $2.replace(/<br[^>]*>/ig, '\n') + $3;
	});
	var htmlTagHash = {};
	var fontSizeHash = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'];
	if (isFilter) {
		_each(htmlTags, function(key, val) {
			var arr = key.split(',');
			for (var i = 0, len = arr.length; i < len; i++) {
				htmlTagHash[arr[i]] = _toMap(val);
			}
		});
	}
	var re = /((?:\r\n|\n|\r)*)<(\/)?([\w-:]+)((?:\s+|(?:\s+[\w-:]+)|(?:\s+[\w-:]+=[^\s"'<>]+)|(?:\s+[\w-:]+="[^"]*")|(?:\s+[\w-:]+='[^']*'))*)(\/)?>((?:\r\n|\n|\r)*)/g;
	html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
		var startNewline = $1 || '',
			startSlash = $2 || '',
			tagName = $3.toLowerCase(),
			attr = $4 || '',
			endSlash = $5 ? ' ' + $5 : '',
			endNewline = $6 || '';
		if (isFilter && !htmlTagHash[tagName]) {
			return '';
		}
		if (endSlash === '' && _SINGLE_TAG_MAP[tagName]) {
			endSlash = ' /';
		}
		if (_BLOCK_TAG_MAP[tagName]) {
			if (startSlash || endSlash) {
				endNewline = '\n';
			}
		} else {
			if (endNewline) {
				endNewline = ' ';
			}
		}
		if (tagName !== 'script' && tagName !== 'style') {
			startNewline = '';
		}
		if (tagName === 'font') {
			var style = {}, styleStr = '';
			attr = attr.replace(/\s*([\w-:]+)=([^\s"'<>]+|"[^"]*"|'[^']*')/g, function($0, $1, $2) {
				var key = $1.toLowerCase(), val = $2 || '';
				val = val.replace(/^["']|["']$/g, '');
				if (key === 'color') {
					style.color = val;
					return ' ';
				}
				if (key === 'size') {
					style['font-size'] = fontSizeHash[parseInt(val, 10) - 1] || '';
					return ' ';
				}
				if (key === 'face') {
					style['font-family'] = val;
					return ' ';
				}
				if (key === 'style') {
					styleStr = val;
					return ' ';
				}
				return $0;
			});
			if (styleStr && !/;$/.test(styleStr)) {
				styleStr += ';';
			}
			_each(style, function(key, val) {
				if (val !== '') { 
					if (/\s/.test(val)) {
						val = "'" + val + "'";
					}
					styleStr += key + ':' + val + ';';
				}
			});
			if (styleStr) {
				attr += ' style="' + styleStr + '"';
			}
			tagName = 'span';
		}
		if (attr !== '') {
			attr = attr.replace(/\s*([\w-:]+)=([^\s"'<>]+|"[^"]*"|'[^']*')/g, function($0, $1, $2) {
				var key = $1.toLowerCase();
				var val = $2 || '';
				if (isFilter) {
					if (key.charAt(0) === "." || (key !== "style" && !htmlTagHash[tagName][key])) {
						return ' ';
					}
				}
				if (val === '') {
					val = '""';
				} else {
					if (key === "style") {
						val = val.substr(1, val.length - 2);
						val = val.replace(/\s*([^\s]+?)\s*:(.*?)(;|$)/g, function($0, $1, $2) {
							var k = $1.toLowerCase();
							if (isFilter) {
								if (!htmlTagHash[tagName].style && !htmlTagHash[tagName]['.' + k]) {
									return '';
								}
							}
							var v = _trim($2);
							v = _toHex(v);
							return k + ':' + v + ';';
						});
						val = _trim(val);
						if (val === '') {
							return '';
						}
						val = '"' + val + '"';
					}
					if (_inArray(key, ['src', 'href']) >= 0) {
						if (val.charAt(0) === '"') {
							val = val.substr(1, val.length - 2);
						}
						val = _formatUrl(val, urlType);
					}
					if (val.charAt(0) !== '"') {
						val = '"' + val + '"';
					}
				}
				return ' ' + key + '=' + val + ' ';
			});
			attr = attr.replace(/\s+(checked|selected|disabled|readonly)(\s+|$)/ig, function($0, $1) {
				var key = $1.toLowerCase();
				if (isFilter) {
					if (key.charAt(0) === "." || !htmlTagHash[tagName][key]) {
						return ' ';
					}
				}
				return ' ' + key + '="' + key + '"' + ' ';
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
	if (!_IE) {
		html = html.replace(/<p><br\s+\/>\n<\/p>/ig, '<p>&nbsp;</p>');
		html = html.replace(/<br\s+\/>\n<\/p>/ig, '</p>');
	}
	return _trim(html);
}

function _mediaType(src) {
	if (/\.(rm|rmvb)(\?|$)/i.test(src)) {
		return 'audio/x-pn-realaudio-plugin';
	}
	if (/\.(swf|flv)(\?|$)/i.test(src)) {
		return 'application/x-shockwave-flash';
	}
	return 'video/x-ms-asf-plugin';
}

function _mediaClass(type) {
	if (/realaudio/i.test(type)) {
		return 'ke-rm';
	}
	if (/flash/i.test(type)) {
		return 'ke-flash';
	}
	return 'ke-media';
}

function _mediaAttrs(srcTag) {
	return _getAttrList(unescape(srcTag));
}

function _mediaEmbed(attrs) {
	var html = '<embed ';
	_each(attrs, function(key, val) {
		html += key + '="' + val + '" ';
	});
	html += '/>';
	return html;
}

function _mediaImg(blankPath, attrs) {
	var width = attrs.width,
		height = attrs.height,
		type = attrs.type || _mediaType(attrs.src),
		srcTag = _mediaEmbed(attrs),
		style = '';
	if (width > 0) {
		style += 'width:' + width + 'px;';
	}
	if (height > 0) {
		style += 'height:' + height + 'px;';
	}
	var html = '<img class="' + _mediaClass(type) + '" src="' + blankPath + '" ';
	if (style !== '') {
		html += 'style="' + style + '" ';
	}
	html += 'kesrctag="' + escape(srcTag) + '" alt="" />';
	return html;
}

K.formatUrl = _formatUrl;
K.formatHtml = _formatHtml;
K.mediaType = _mediaType;
K.mediaAttrs = _mediaAttrs;
K.mediaEmbed = _mediaEmbed;
K.mediaImg = _mediaImg;
