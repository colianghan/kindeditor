/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name main.js
 * @fileOverview 组装、初始化编辑器
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "config.js"
#using "node.js"
#using "main.js"
*/

var _plugins = {};

function _plugin(name, obj) {
	if (obj === undefined) {
		return _plugins[name];
	}
	_plugins[name] = obj;
}

var _language = {};

function _lang(key, langType) {
	langType = langType === undefined ? _LANG_TYPE : langType;
	return _language[langType][key];
}

function _pluginLang(key, langType) {
	return _lang('plugins', langType)[key];
}

function KEditor(options) {
	var self = this;
	_each(options, function(key, val) {
		self[key] = options[key];
	});
	_each(_options, function(key, val) {
		if (self[key] === undefined) {
			self[key] = val;
		}
	});
	var se = _node(self.srcElement);
	if (!self.width) {
		self.width = se.width() || self.minWidth;
	}
	if (!self.height) {
		self.height = se.height() || self.minHeight;
	}
	self.width = _addUnit(self.width);
	self.height = _addUnit(self.height);
	self.srcElement = se;
}

KEditor.prototype = {
	create : function() {
		var self = this,
			fullscreenMode = self.fullscreenMode,
			width = fullscreenMode ? document.documentElement.clientWidth + 'px' : self.width,
			height = fullscreenMode ? document.documentElement.clientHeight + 'px' : self.height,
			container = _node('<div></div>').css('width', width);
		if (fullscreenMode) {
			var pos = _getScrollPos();
			container.css({
				position : 'absolute',
				left : _addUnit(pos.x),
				top : _addUnit(pos.y),
				'z-index' : 19811211
			});
			_node(document.body).append(container);
		} else {
			self.srcElement.before(container);
		}
		//create toolbar
		var toolbar = _toolbar({
				parent : container,
				width : '100%',
				noDisableItems : 'source,fullscreen'.split(',')
			});
		_each(self.items, function(i, name) {
			toolbar.addItem({
				name : name,
				title : _lang(name),
				click : function(e) {
					if (self.menu) {
						var menuName = self.menu.name;
						self.menu.remove();
						self.menu = null;
						if (menuName === name) {
							return;
						}
					}
					_plugin(name).call(this, self);
				}
			});
		});
		if (fullscreenMode) {
			height = _removeUnit(height) - toolbar.div().height();
		}
		//create edit
		var edit = _edit({
				srcElement : self.srcElement,
				width : '100%',
				height : height,
				designMode : self.designMode,
				bodyClass : self.bodyClass,
				cssData : self.cssData
			}).create(container),
			doc = edit.doc, textarea = edit.textarea;
		//bind events
		_node(doc, document).click(function(e) {
			if (self.menu) {
				self.menu.remove();
				self.menu = null;
			}
		});
		_each({
			undo : 'Z', redo : 'Y', bold : 'B', italic : 'I', underline : 'U',
			selectall : 'A', print : 'P'
		}, function(name, key) {
			_ctrl(doc, key, function() {
				_plugin(name).call(doc, self);
			});
			if (key == 'Z' || key == 'Y') {
				_ctrl(textarea.get(), key, function() {
					_plugin(name).call(textarea, self);
				});
			}
		});
		//properties
		self.container = container;
		self.toolbar = toolbar;
		self.edit = edit;
		return self;
	},
	remove : function() {
		var self = this;
		if (self.menu) {
			self.menu.remove();
		}
		self.toolbar.remove();
		self.edit.remove();
		self.container.remove();
		self.container = self.toolbar = self.edit = self.menu = null;
		return self;
	},
	fullscreen : function(bool) {
		var self = this;
		self.fullscreenMode = (bool === undefined ? !self.fullscreenMode : bool);
		self.remove();
		return self.create();
	}
};

var _editors = {};

function _create(id, options) {
	if (!options) {
		options = {};
	}
	if (!options.srcElement) {
		options.srcElement = _node('#' + id) || _node('[name=' + id + ']');
	}
	return (_editors[id] = new KEditor(options).create());
}

function _remove(id) {
	if (_editors[id]) {
		_editors[id].remove();
		delete _editors[id];
	}
}

//解决IE6浏览器重复下载背景图片的问题
if (_IE && _VERSION < 7) {
	try {
		document.execCommand('BackgroundImageCache', false, true);
	} catch (e) {}
}

K.create = _create;
K.remove = _remove;
K.plugin = _plugin;

if (window.K === undefined) {
	window.K = K;
}
window.KindEditor = K;

//define core plugins
_plugin('about', function(editor) {
	var html = '<div style="margin:20px;">' +
		'<div>KindEditor ${VERSION}</div>' +
		'<div>Copyright &copy; <a href="http://www.kindsoft.net/" target="_blank">kindsoft.net</a> All rights reserved.</div>' +
		'</div>';
	var dialog = K.dialog({
		width : 300,
		title : _lang('about'),
		body : html,
		noBtn : {
			name : _lang('close'),
			click : function(e) {
				dialog.remove();
				editor.edit.focus();
			}
		}
	});
});

_plugin('plainpaste', function(editor) {
	var lang = _pluginLang('plainpaste'),
		html = '<div style="margin:10px;">' +
			'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
			'<textarea id="ke_plainpaste_textarea" style="width:99%;height:260px;border:1px solid #A0A0A0;"></textarea>' +
			'</div>';
	var dialog = K.dialog({
		width : 450,
		title : _lang('plainpaste'),
		body : html,
		yesBtn : {
			name : _lang('yes'),
			click : function(e) {
				var html = _node('#ke_plainpaste_textarea').val();
				html = _escape(html);
				html = html.replace(/ /g, '&nbsp;');
				html = html.replace(/\r\n|\n|\r/g, "<br />$&");
				editor.edit.cmd.inserthtml(html);
				dialog.remove();
				editor.edit.focus();
			}
		},
		noBtn : {
			name : _lang('close'),
			click : function(e) {
				dialog.remove();
				editor.edit.focus();
			}
		}
	});
});

_plugin('source', function(editor) {
	editor.toolbar.disable();
	editor.edit.design();
});

_plugin('fullscreen', function(editor) {
	editor.fullscreen();
});

_plugin('formatblock', function(editor) {
	var pos = this.pos(),
		blocks = _pluginLang('formatblock').formatblock,
		heights = {
			h1 : 28,
			h2 : 24,
			h3 : 18,
			H4 : 14,
			p : 12
		},
		cmd = editor.edit.cmd,
		curVal = cmd.val('formatblock');
	editor.menu = _menu({
		name : 'formatblock',
		width : _LANG_TYPE == 'en' ? 200 : 150,
		x : pos.x,
		y : pos.y + this.height(),
		centerLineMode : false
	});
	_each(blocks, function(key, val) {
		var style = 'font-size:' + heights[key] + 'px;';
		if (key.charAt(0) === 'h') {
			style += 'font-weight:bold;';
		}
		editor.menu.addItem({
			title : '<span style="' + style + '">' + val + '</span>',
			height : heights[key] + 12,
			checked : (curVal === key || curVal === val),
			click : function(e) {
				cmd.select();
				cmd.formatblock('<' + key.toUpperCase() + '>');
				editor.menu.remove();
				editor.menu = null;
				e.stop();
			}
		});
	});
});

_plugin('fontname', function(editor) {
	var pos = this.pos(),
		cmd = editor.edit.cmd,
		curVal = cmd.val('fontname');
	editor.menu = _menu({
		name : 'fontname',
		width : 150,
		x : pos.x,
		y : pos.y + this.height(),
		centerLineMode : false
	});
	_each(_pluginLang('fontname').fontName, function(key, val) {
		editor.menu.addItem({
			title : '<span style="font-family: ' + key + ';">' + val + '</span>',
			checked : (curVal === key.toLowerCase() || curVal === val.toLowerCase()),
			click : function(e) {
				cmd.fontname(val);
				editor.menu.remove();
				editor.menu = null;
				e.stop();
			}
		});
	});
});

_plugin('fontsize', function(editor) {
	var fontSize = ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
		pos = this.pos(),
		cmd = editor.edit.cmd,
		curVal = cmd.val('fontsize');
	editor.menu = _menu({
		name : 'fontsize',
		width : 150,
		x : pos.x,
		y : pos.y + this.height(),
		centerLineMode : false
	});
	_each(fontSize, function(i, val) {
		editor.menu.addItem({
			title : '<span style="font-size:' + val + ';">' + val + '</span>',
			height : _removeUnit(val) + 12,
			checked : curVal === val,
			click : function(e) {
				cmd.fontsize(val);
				editor.menu.remove();
				editor.menu = null;
				e.stop();
			}
		});
	});
});

_each('forecolor,hilitecolor'.split(','), function(i, name) {
	_plugin(name, function(editor) {
		var pos = this.pos(),
			cmd = editor.edit.cmd,
			curVal = cmd.val(name);
		editor.menu = _colorpicker({
			name : name,
			x : pos.x,
			y : pos.y + this.height(),
			selectedColor : curVal || 'default',
			click : function(color) {
				cmd[name](color);
				editor.menu.remove();
				editor.menu = null;
			}
		});
	});
});

_each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
	'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,cut,copy,paste,' +
	'bold,italic,underline,strikethrough,removeformat').split(','), function(i, name) {
	_plugin(name, function(editor) {
		editor.edit.focus();
		editor.edit.cmd[name](null);
	});
});
