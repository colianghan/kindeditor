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
(function (K, undefined) {

var _each = K.each,
	_isArray = K.isArray,
	_node = K.node,
	_cmd = K.cmd;

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
				if (path !== '') arr.push('<link href="' + path + '" rel="stylesheet" />');
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
function _edit(expr, options) {
	var srcElement = _node(expr),
		designMode = options.designMode === undefined ? true : options.designMode,
		bodyClass = options.bodyClass,
		css = options.css;
	function srcVal(val) {
		return srcElement.hasVal() ? srcElement.val(val) : srcElement.html(val);
	}
	var obj = {
		/**
			@name KindEditor.edit#cmd
			@property
			@public
			@type {KCmd}
			@description
			可视化控件的cmd对象，可以执行cmd下的命令。
		*/
		/**
			@name KindEditor.edit#doc
			@property
			@public
			@type {iframeDocument}
			@description
			可视化控件iframe的document对象。
		*/
		/**
			@name KindEditor.edit#iframe
			@property
			@public
			@type {iframeElement}
			@description
			可视化控件的iframe对象。
		*/
		/**
			@name KindEditor.edit#textarea
			@property
			@public
			@type {textareaElement}
			@description
			可视化控件的textarea对象。
		*/
		width : options.width || 0,
		height : options.height || 0,
		val : function(val) {
			if (designMode) {
				return _iframeVal.call(this, val);
			} else {
				return _textareaVal.call(this, val);
			}
		},
		create : function() {
			var self = this;
			if (self.iframe) return self;
			//create elements
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
			if (designMode) textarea.hide()
			else iframe.hide();
			srcElement.before(iframe);
			srcElement.before(textarea);
			srcElement.hide();
			var doc = _getIframeDoc(iframe.get());
			doc.designMode = 'on';
			doc.open();
			doc.write(_getInitHtml(bodyClass, css));
			doc.close();
			self.iframe = iframe;
			self.textarea = textarea;
			self.doc = doc;
			if (designMode) _iframeVal.call(self, srcVal());
			else _textareaVal.call(self, srcVal());
			self.cmd = _cmd(doc);
			//add events
			function selectionHandler(e) {
				var cmd = _cmd(doc);
				if (cmd) self.cmd = cmd;
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
			if (!iframe) return self;
			//remove events
			_node(doc).unbind();
			_node(doc.body).unbind();
			_node(document).unbind();
			//remove elements
			srcElement.show();
			srcVal(self.val());
			doc.src = 'javascript:false';
			iframe.remove();
			textarea.remove();
			self.iframe = self.textarea = null;
			return self;
		},
		toggle : function(bool) {
			var self = this,
				iframe = self.iframe,
				textarea = self.textarea;
			if (!iframe) return self;
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
			if (self.iframe && designMode) self.iframe.contentWindow.focus();
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

})(KindEditor);