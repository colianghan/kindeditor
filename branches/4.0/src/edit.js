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

/**
DOM_VK_BACK_SPACE : 8
DOM_VK_TAB : 9
DOM_VK_RETURN : 13
DOM_VK_PAGE_UP : 33
DOM_VK_PAGE_DOWN : 34
DOM_VK_END : 35
DOM_VK_HOME : 36
DOM_VK_LEFT : 37
DOM_VK_UP : 38
DOM_VK_RIGHT : 39
DOM_VK_DOWN : 40
DOM_VK_DELETE : 46
DOM_VK_0 ~ DOM_VK_9 : 48 ~ 57
DOM_VK_SEMICOLON : 59 (;:)
DOM_VK_EQUALS : 61 (=+) (+)
DOM_VK_A ~ DOM_VK_Z : 65 ~ 90
DOM_VK_MULTIPLY : 106 (*)
DOM_VK_SUBTRACT : 109 (-_) (-)
DOM_VK_DECIMAL : 110 (.)
DOM_VK_DIVIDE : 111 (/)
DOM_VK_COMMA : 188 (,<)
DOM_VK_PERIOD : 190 (.>)
DOM_VK_SLASH : 191 (/?)
DOM_VK_BACK_QUOTE : 192 (`~)
DOM_VK_OPEN_BRACKET : 219 ([{)
DOM_VK_BACK_SLASH : 220 (\|)
DOM_VK_CLOSE_BRACKET : 221 (]})
DOM_VK_QUOTE : 222 ('")

详细请参考 event.js
*/
//输入字符的键值
var _INPUT_KEY_MAP = _toMap('9,48..57,59,61,65..90,109..111,188,190..192,219..222');
//输入字符或移动光标的键值
var _CHANGE_KEY_MAP = _toMap('8,9,13,33..40,46,48..57,59,61,65..90,106,109..111,188,190..192,219..222');

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
				if (path !== '') {
					arr.push('<link href="' + path + '" rel="stylesheet" />');
				}
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
		css = options.css,
		onchangeHandlers = [];
	function srcVal(val) {
		return srcElement.hasVal() ? srcElement.val(val) : srcElement.html(val);
	}
	return {
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
		html : function(val) {
			this.val(val);
		},
		val : function(val) {
			if (designMode) {
				return _iframeVal.call(this, val);
			} else {
				return _textareaVal.call(this, val);
			}
		},
		create : function() {
			var self = this;
			if (self.iframe) {
				return self;
			}
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
			if (designMode) {
				textarea.hide();
			} else {
				iframe.hide();
			}
			srcElement.before(iframe);
			srcElement.before(textarea);
			srcElement.hide();
			var doc = _getIframeDoc(iframe.get());
			doc.open();
			doc.write(_getInitHtml(bodyClass, css));
			doc.close();
			doc.body.contentEditable = 'true';
			self.iframe = iframe;
			self.textarea = textarea;
			self.doc = doc;
			if (designMode) {
				_iframeVal.call(self, srcVal());
			} else {
				_textareaVal.call(self, srcVal());
			}
			self.cmd = _cmd(doc);
			//add events
			//焦点离开编辑区域时保存selection
			function selectionHandler(e) {
				var cmd = _cmd(doc);
				if (cmd) {
					self.cmd = cmd;
				}
			}
			self.onchange(selectionHandler);
			_node(document).bind('mousedown', selectionHandler);
			//点击编辑区域或输入内容时取得commmand value
			//function commandValueHandler(e) {
			//	_each('formatblock,fontfamily,fontsize,forecolor,hilitecolor'.split(','), function() {
			//		var cmdVal = self.cmd.val(this);
			//	});
			//}
			//self.oninput(commandValueHandler);
			//_node(doc).bind('click', commandValueHandler);
			//点击编辑区域或输入内容时取得command state
			//function commandStateHandler(e) {
			//	var cmds = 'justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,insertunorderedlist,indent,outdent,subscript,superscript,bold,italic,underline,strikethrough'.split(',');
			//	_each(cmds, function() {
			//		var cmdState = self.cmd.state(this);
			//	});
			//}
			//self.oninput(commandStateHandler);
			//_node(doc).bind('click', commandStateHandler);
			return self;
		},
		remove : function() {
			var self = this,
				iframe = self.iframe,
				textarea = self.textarea,
				doc = self.doc;
			if (!iframe) {
				return self;
			}
			//remove events
			_node(doc).unbind();
			_node(doc.body).unbind();
			_node(document).unbind();
			//remove elements
			srcElement.show();
			srcVal(self.val());
			iframe.remove();
			textarea.remove();
			self.iframe = self.textarea = null;
			return self;
		},
		toggle : function(bool) {
			var self = this,
				iframe = self.iframe,
				textarea = self.textarea;
			if (!iframe) {
				return self;
			}
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
			if (self.iframe && designMode) {
				self.iframe.contentWindow.focus();
			}
			return self;
		},
		exec : function(cmd, val) {
			this.cmd.exec(cmd, val);
			_each(onchangeHandlers, function() {
				this();
			});
		},
		onchange : function(fn) {
			var self = this, doc = self.doc, body = doc.body;
			_node(doc).bind('keyup', function(e) {
				if (!e.ctrlKey && !e.altKey && _CHANGE_KEY_MAP[e.which]) {
					fn(e);
					e.stop();
				}
			});
			_node(doc).bind('mouseup', fn);
			function timeoutHandler(e) {
				setTimeout(function() {
					fn(e);
				}, 1);
			}
			_node(body).bind('paste', timeoutHandler);
			_node(body).bind('cut', timeoutHandler);
			onchangeHandlers.push(fn);
			return self;
		}
	};
}

K.edit = _edit;
