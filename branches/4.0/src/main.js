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

var _scriptPath = (function() {
	var els = document.getElementsByTagName('script'), src;
	for (var i = 0, len = els.length; i < len; i++) {
		src = els[i].src || '';
		if (src.match(/kindeditor[\w\-\.]*\.js/)) {
			return src.substring(0, src.lastIndexOf('/') + 1);
		}
	}
	return '';
})();

var _options = {
	designMode : true,
	fullscreenMode : false,
	filterMode : false,
	shadowMode : true,
	scriptPath : _scriptPath,
	urlType : '', //"",relative,absolute,domain
	newlineType : 'p', //p,br
	resizeType : 2, //0,1,2
	dialogAlignType : 'page', //page,editor
	bodyClass : 'ke-content',
	cssData : '', //cssPath, cssContent
	minWidth : 200,
	minHeight : 100,
	minChangeSize : 5,
	items : [
		'source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		'superscript', '|', 'selectall', '/',
		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
		'flash', 'media', 'advtable', 'hr', 'emoticons', 'link', 'unlink', '|', 'about'
	],
	colors : [
		['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
		['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
		['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
		['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
	],
	htmlTags : {
		font : ['color', 'size', 'face', '.background-color'],
		span : [
			'.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align'
		],
		div : [
			'align', '.border', '.margin', '.padding', '.text-align', '.color',
			'.background-color', '.font-size', '.font-family', '.font-weight', '.background',
			'.font-style', '.text-decoration', '.vertical-align', '.margin-left'
		],
		table: [
			'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
			'.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
			'.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
			'.width', '.height'
		],
		'td,th': [
			'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
			'.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
			'.font-style', '.text-decoration', '.vertical-align', '.background'
		],
		a : ['href', 'target', 'name'],
		embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', '/'],
		img : ['src', 'width', 'height', 'border', 'alt', 'title', '.width', '.height', '/'],
		hr : ['/'],
		br : ['/'],
		'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
			'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
		],
		'tbody,tr,strong,b,sub,sup,em,i,u,strike' : []
	}
};

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
			container = _node('<div></div>').css('width', self.width);
		if (self.fullscreenMode) {
			_node(document.body).append(container);
		} else {
			self.srcElement.before(container);
		}
		//create toolbar
		var toolbar = _toolbar({
				width : '100%',
				noDisableItems : 'source,fullscreen'.split(',')
			});
		_each(self.items, function(i, name) {
			toolbar.addItem({
				name : name,
				click : function(e) {
					_plugin(name).call(this, self);
				}
			});
		});
		toolbar.create(container);
		//create edit
		var edit = _edit({
			srcElement : self.srcElement,
			width : '100%',
			height : self.height,
			designMode : self.designMode,
			bodyClass : self.bodyClass,
			cssData : self.cssData
		}).create(container);
		_node(edit.doc).bind('click', function(e) {
			if (self.menu) {
				self.menu.remove();
				self.menu = null;
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
		self.toolbar.remove();
		self.edit.remove();
		self.container.remove();
		self.container = self.toolbar = self.edit = null;
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
	var editor = new KEditor(options).create();
	_editors[id] = editor;
	return editor;
}

function _remove(id) {
	_editors[id].remove();
}

//解决IE6浏览器重复下载背景图片的问题
if (_IE && _VERSION < 7) {
	try {
		document.execCommand('BackgroundImageCache', false, true);
	} catch (e) {}
}

//define core plugins
_plugin('source', function(editor) {
	editor.toolbar.disable();
	editor.edit.design();
});

_each('bold,italic,underline,strikethrough,removeformat'.split(','), function(i, name) {
	_plugin(name, function(editor) {
		editor.edit.cmd[name]();
	});
});

_plugin('fontname', function(editor) {
	if (editor.menu) {
		editor.menu.remove();
		editor.menu = null;
		return;
	}
	var pos = this.pos();
	editor.menu = _menu({
		width : 150,
		x : pos.x,
		y : pos.y + this.height() + 5,
		z : 19811212
	});
	_each(_pluginLang('fontname').fontName, function(key, val) {
		editor.menu.addItem({
			title : '<span style="font-family: ' + key + ';">' + val + '</span>',
			click : function(e) {
				editor.edit.cmd.fontname(val);
				editor.menu.remove();
				editor.menu = null;
				e.stop();
			}
		});
	});
	editor.menu.create();
});

K.create = _create;
K.remove = _remove;
K.plugin = _plugin;

var _K = K;
K = function(id, options) {
	_ready(function() {
		_create(id, options);
	});
};
_each(_K, function(key, val) {
	K[key] = val;
});
if (window.K === undefined) {
	window.K = K;
}
window.KindEditor = K;
