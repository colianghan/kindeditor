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

/**
	@name KindEditor.edit
	@class 可视化控件类
	@param {String|Node} expr DOM元素、选择器字符串
	@param {Object} options 可选配置
	@description
	可视化控件类。
	@example
	K.edit('textarea').create(); //将第一个匹配的textarea转换成可视化控件
	K.edit(document.getElementById('textarea_id')).create();
*/
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
		//create elements
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
		//remove events
		_node(doc).unbind();
		_node(doc.body).unbind();
		_node(document).unbind();
		//remove elements
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
	toggle : function(bool) {
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
	toDesign : function() {
		return this.toggle(true);
	},
	toSource : function() {
		return this.toggle(false);
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
