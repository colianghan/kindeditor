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

function _getIframeDoc(iframe) {
	return iframe.contentDocument || iframe.contentWindow.document;
}

function _getInitHtml(bodyClass, cssData) {
	var arr = ['<!doctype html><html><head><meta charset="utf-8" /><title>KindEditor</title>'];
	if (cssData) {
		if (typeof cssData == 'string' && !/\{[\s\S]*\}/.test(cssData)) {
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
		designMode = options.designMode === undefined ? true : options.designMode,
		bodyClass = options.bodyClass,
		cssData = options.cssData,
		div = self.div().addClass('ke-edit'),
		iframe = K('<iframe class="ke-edit-iframe" frameborder="0"></iframe>'),
		textarea = K('<textarea class="ke-edit-textarea" kindeditor="true"></textarea>');
	iframe.css('width', '100%');
	textarea.css('width', '100%');
	//set width
	self.width = function(val) {
		div.css('width', val);
		return self;
	};
	//set height
	self.height = function(val) {
		div.css('height', val);
		iframe.css('height', val);
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
	var doc = _getIframeDoc(iframe.get());
	if (!_IE) {
		doc.designMode = 'on';
	}
	doc.open();
	doc.write(_getInitHtml(bodyClass, cssData));
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
