/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name edit.js
 * @fileOverview iframe编辑区域
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "node.js"
#using "cmd.js"
*/

function _iframeDoc(iframe) {
	iframe = _get(iframe);
	return iframe.contentDocument || iframe.contentWindow.document;
}

function _getInitHtml(themesPath, bodyClass, cssPath, cssData) {
	var arr = [
		'<html><head><meta charset="utf-8" /><title>KindEditor</title>',
		'<style>',
		'html {margin:0;padding:0;}',
		'body {margin:0;padding:0;}',
		'body, td {font:12px/1.5 "sans serif",tahoma,verdana,helvetica;}',
		'p {margin:5px 0;}',
		'table {border-collapse:collapse;}',
		'table.ke-zeroborder td {border:1px dotted #AAAAAA;}',
		'.ke-flash {',
		'	border:1px solid #AAAAAA;',
		'	background-image:url(' + themesPath + 'common/flash.gif);',
		'	background-position:center center;',
		'	background-repeat:no-repeat;',
		'	width:100px;',
		'	height:100px;',
		'}',
		'.ke-rm {',
		'	border:1px solid #AAAAAA;',
		'	background-image:url(' + themesPath + 'common/rm.gif);',
		'	background-position:center center;',
		'	background-repeat:no-repeat;',
		'	width:100px;',
		'	height:100px;',
		'}',
		'.ke-media {',
		'	border:1px solid #AAAAAA;',
		'	background-image:url(' + themesPath + 'common/media.gif);',
		'	background-position:center center;',
		'	background-repeat:no-repeat;',
		'	width:100px;',
		'	height:100px;',
		'}',
		'</style>'
	];
	if (_isArray(cssPath)) {
		_each(cssPath, function(i, path) {
			if (path !== '') {
				arr.push('<link href="' + path + '" rel="stylesheet" />');
			}
		});
	} else {
		if (cssPath) {
			arr.push('<link href="' + cssPath + '" rel="stylesheet" />');
		}
	}
	if (cssData) {
		arr.push('<style>' + cssData + '</style>');
	}
	arr.push('</head><body ' + (bodyClass ? 'class="' + bodyClass + '"' : '') + '></body></html>');
	return arr.join('');
}

function _elementVal(knode, val) {
	return knode.hasVal() ? knode.val(val) : knode.html(val);
}

/**
	@name KindEditor.edit
	@class 可视化控件类
	@param {String|Node} expr DOM元素、选择器字符串
	@param {Object} options 可选配置
	@description
	可视化控件类。
*/
function _edit(options) {
	var self = _widget(options),
		remove = self.remove,
		width = _addUnit(options.width),
		height = _addUnit(options.height),
		srcElement = K(options.srcElement),
		designMode = _undef(options.designMode, true),
		themesPath = _undef(options.themesPath, ''),
		bodyClass = options.bodyClass,
		cssPath = options.cssPath,
		cssData = options.cssData,
		div = self.div().addClass('ke-edit'),
		iframe = K('<iframe class="ke-edit-iframe" frameborder="0"></iframe>'),
		textarea = K('<textarea class="ke-edit-textarea" kindeditor="true"></textarea>');
	iframe.css('width', '100%');
	textarea.css('width', '100%');
	//set width
	self.width = function(val) {
		div.css('width', _addUnit(val));
		return self;
	};
	//set height
	self.height = function(val) {
		val = _addUnit(val);
		div.css('height', val);
		iframe.css('height', val);
		//校正IE6和IE7的textarea高度
		if ((_IE && _VERSION < 8) || document.compatMode != 'CSS1Compat') {
			val = _addUnit(_removeUnit(val) - 2);
		}
		textarea.css('height', val);
		return self;
	};
	if (width) {
		self.width(width);
	}
	if (height) {
		self.height(height);
	}
	if (designMode) {
		textarea.hide();
	} else {
		iframe.hide();
	}
	div.append(iframe);
	div.append(textarea);
	srcElement.hide();
	var doc = _iframeDoc(iframe);
	if (!_IE) {
		doc.designMode = 'on';
	}
	doc.open();
	doc.write(_getInitHtml(themesPath, bodyClass, cssPath, cssData));
	doc.close();
	if (_IE) {
		doc.body.contentEditable = 'true';
	}
	self.iframe = iframe;
	self.textarea = textarea;
	self.doc = doc;
	//remove edit
	self.remove = function() {
		//remove events
		K(doc).unbind();
		K(doc.body).unbind();
		K(document).unbind();
		//remove elements
		_elementVal(srcElement, self.html());
		srcElement.removeAttr('kindeditor');
		srcElement.show();
		doc.write('');
		doc.clear();
		iframe.remove();
		textarea.remove();
		remove.call(self);
		return self;
	};
	//get or set value
	self.html = function(val) {
		if (designMode) {
			var body = doc.body;
			if (val === undefined) {
				return K(body).html();
			}
			K(body).html(val);
			return self;
		}
		if (val === undefined) {
			return textarea.val();
		}
		textarea.val(val);
		return self;
	};
	//toggle design/source mode
	self.design = function(bool) {
		var val;
		if (bool === undefined ? !designMode : bool) {
			if (!designMode) {
				val = self.html();
				designMode = true;
				self.html(val);
				textarea.hide();
				iframe.show();
			}
		} else {
			if (designMode) {
				val = self.html();
				designMode = false;
				self.html(val);
				iframe.hide();
				textarea.show();
			}
		}
		self.focus();
		return self;
	};
	self.focus = function() {
		if (designMode) {
			iframe.get().contentWindow.focus();
		} else {
			textarea.get().focus();
		}
		return self;
	};
	//set default value
	self.html(_elementVal(srcElement));
	self.cmd = _cmd(doc);
	return self;
}

K.edit = _edit;
K.iframeDoc = _iframeDoc;
