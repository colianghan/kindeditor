
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
		reg = /\s+(?:([\w\-:]+)|(?:([\w\-:]+)=([^\s"'<>]+))|(?:([\w\-:]+)="([^"]*)")|(?:([\w\-:]+)='([^']*)'))(?=(?:\s|\/|>)+)/g,
		match;
	while ((match = reg.exec(tag))) {
		var key = (match[1] || match[2] || match[4] || match[6]).toLowerCase(),
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
	mode = _undef(mode, '').toLowerCase();
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

function _formatHtml(html, htmlTags, urlType, wellFormatted, indentChar) {
	urlType = urlType || '';
	wellFormatted = _undef(wellFormatted, false);
	indentChar = _undef(indentChar, '\t');
	var fontSizeList = 'xx-small,x-small,small,medium,large,x-large,xx-large'.split(',');
	// 将pre里的br转换成\n
	html = html.replace(/(<pre[^>]*>)([\s\S]*?)(<\/pre>)/ig, function($0, $1, $2, $3){
		return $1 + $2.replace(/<br[^>]*>/ig, '\n') + $3;
	})
	.replace(/<p>\s*<\/p>/ig, '<p>&nbsp;</p>')
	.replace(/<p>\s*<br\s*\/>\s*<\/p>/ig, '<p>&nbsp;</p>')
	.replace(/<br\s*\/>\s*<\/p>/ig, '</p>')
	.replace(/\u200B/g, '');
	var htmlTagMap = {};
	if (htmlTags) {
		// 展开htmlTags里的key
		_each(htmlTags, function(key, val) {
			var arr = key.split(',');
			for (var i = 0, len = arr.length; i < len; i++) {
				htmlTagMap[arr[i]] = _toMap(val);
			}
		});
	}
	var re = /(\s*)<(\/)?([\w\-:]+)((?:\s+|(?:\s+[\w\-:]+)|(?:\s+[\w\-:]+=[^\s"'<>]+)|(?:\s+[\w\-:]+="[^"]*")|(?:\s+[\w\-:]+='[^']*'))*)(\/)?>(\s*)/g;
	var tagStack = [];
	html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
		var full = $0,
			startNewline = $1 || '',
			startSlash = $2 || '',
			tagName = $3.toLowerCase(),
			attr = $4 || '',
			endSlash = $5 ? ' ' + $5 : '',
			endNewline = $6 || '';
		// 不在名单里的过滤掉
		if (htmlTags && !htmlTagMap[tagName]) {
			return '';
		}
		// 无闭合标签的自动添加斜线
		if (endSlash === '' && _SINGLE_TAG_MAP[tagName]) {
			endSlash = ' /';
		}
		// inline tag时自动将多个空白转换成一个空格
		if (_INLINE_TAG_MAP[tagName]) {
			if (startNewline) {
				startNewline = ' ';
			}
			if (endNewline) {
				endNewline = ' ';
			}
		}
		// pre,style,script tag的格式化
		if (_PRE_TAG_MAP[tagName]) {
			if (startSlash) {
				endNewline = '\n';
			} else {
				startNewline = '\n';
			}
		}
		// br tag
		if (wellFormatted && tagName == 'br') {
			endNewline = '\n';
		}
		// block tag的格式化
		if (_BLOCK_TAG_MAP[tagName] && !_PRE_TAG_MAP[tagName]) {
			if (wellFormatted) {
				if (startSlash && tagStack.length > 0 && tagStack[tagStack.length - 1] === tagName) {
					tagStack.pop();
				} else {
					tagStack.push(tagName);
				}
				startNewline = '\n';
				endNewline = '\n';
				for (var i = 0, len = startSlash ? tagStack.length : tagStack.length - 1; i < len; i++) {
					startNewline += indentChar;
					if (!startSlash) {
						endNewline += indentChar;
					}
				}
				if (!startSlash) {
					endNewline += indentChar;
				}
			} else {
				startNewline = endNewline = '';
			}
		}
		if (attr !== '') {
			var attrMap = _getAttrList(full);
			// 将font tag转换成span tag
			if (tagName === 'font') {
				var fontStyleMap = {}, fontStyle = '';
				_each(attrMap, function(key, val) {
					if (key === 'color') {
						fontStyleMap.color = val;
						delete attrMap[key];
					}
					if (key === 'size') {
						fontStyleMap['font-size'] = fontSizeList[parseInt(val, 10) - 1] || '';
						delete attrMap[key];
					}
					if (key === 'face') {
						fontStyleMap['font-family'] = val;
						delete attrMap[key];
					}
					if (key === 'style') {
						fontStyle = val;
					}
				});
				if (fontStyle && !/;$/.test(fontStyle)) {
					fontStyle += ';';
				}
				_each(fontStyleMap, function(key, val) {
					if (val === '') {
						return;
					}
					if (/\s/.test(val)) {
						val = "'" + val + "'";
					}
					fontStyle += key + ':' + val + ';';
				});
				attrMap.style = fontStyle;
			}
			// 处理attribute和style
			_each(attrMap, function(key, val) {
				// 补全单独属性
				if (_FILL_ATTR_MAP[key]) {
					attrMap[key] = key;
				}
				// 过滤属性
				if (htmlTags && key !== 'style' && !htmlTagMap[tagName][key]) {
					delete attrMap[key];
				}
				if (key === 'style' && val !== '') {
					var styleMap = _getCssList(val);
					_each(styleMap, function(k, v) {
						// 过滤样式
						if (htmlTags && !htmlTagMap[tagName].style && !htmlTagMap[tagName]['.' + k]) {
							delete styleMap[k];
						}
					});
					var style = '';
					_each(styleMap, function(k, v) {
						style += k + ':' + v + ';';
					});
					attrMap.style = style;
				}
				// 处理URL
				if (_inArray(key, ['src', 'href']) >= 0) {
					attrMap[key] = _formatUrl(val, urlType);
				}
			});
			attr = '';
			_each(attrMap, function(key, val) {
				if (key === 'style' && val === '') {
					return;
				}
				attr += ' ' + key + '="' + val + '"';
			});
		}
		if (tagName === 'font') {
			tagName = 'span';
		}
		return startNewline + '<' + startSlash + tagName + attr + endSlash + '>' + endNewline;
	});
	html = html.replace(/\n\s*\n/g, '\n');
	return _trim(html);
}
// 根据URL判断 media type
function _mediaType(src) {
	if (/\.(rm|rmvb)(\?|$)/i.test(src)) {
		return 'audio/x-pn-realaudio-plugin';
	}
	if (/\.(swf|flv)(\?|$)/i.test(src)) {
		return 'application/x-shockwave-flash';
	}
	return 'video/x-ms-asf-plugin';
}
// 根据 media type取得className
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
	return _getAttrList(_unescape(srcTag));
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
	html += 'data-ke-tag="' + _escape(srcTag) + '" alt="" />';
	return html;
}

K.formatUrl = _formatUrl;
K.formatHtml = _formatHtml;
K.getAttrList = _getAttrList;
K.mediaType = _mediaType;
K.mediaAttrs = _mediaAttrs;
K.mediaEmbed = _mediaEmbed;
K.mediaImg = _mediaImg;
