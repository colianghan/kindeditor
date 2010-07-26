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

function _parseLangKey(key) {
	var match, ns = 'core';
	if ((match = /^(\w+)\.(\w+)$/.exec(key))) {
		ns = match[1];
		key = match[2];
	}
	return { ns : ns, key : key };
}
/**
	@example
	K.lang('about'); //get core.about
	K.lang('about.version'); // get about.version
	K.lang('about.').version; // get about.version
	K.lang('about', 'en'); //get English core.about
	K.lang({
		core.about : '关于',
		about.version : '4.0'
	}, 'zh_CN'); //add language
*/
function _lang(mixed, langType) {
	langType = langType === undefined ? _options.langType : langType;
	if (typeof mixed === 'string') {
		if (!_language[langType]) {
			return 'no language';
		}
		var pos = mixed.length - 1;
		if (mixed.substr(pos) === '.') {
			return _language[langType][mixed.substr(0, pos)];
		}
		var obj = _parseLangKey(mixed);
		return _language[langType][obj.ns][obj.key];
	}
	_each(mixed, function(key, val) {
		var obj = _parseLangKey(key);
		if (!_language[langType]) {
			_language[langType] = {};
		}
		if (!_language[langType][obj.ns]) {
			_language[langType][obj.ns] = {};
		}
		_language[langType][obj.ns][obj.key] = val;
	});
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
	var se = K(self.srcElement);
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
	lang : function(mixed) {
		return _lang(mixed, this.langType);
	},
	create : function() {
		var self = this,
			fullscreenMode = self.fullscreenMode;
		if (fullscreenMode) {
			_docElement().style.overflow = 'hidden';
		} else {
			_docElement().style.overflow = 'auto';
		}
		var width = fullscreenMode ? _docWidth() + 'px' : self.width,
			height = fullscreenMode ? _docHeight() + 'px' : self.height,
			container = K('<div class="ke-container"></div>').css('width', width);
		if (fullscreenMode) {
			var pos = _getScrollPos();
			container.css({
				position : 'absolute',
				left : _addUnit(pos.x),
				top : _addUnit(pos.y),
				'z-index' : 19811211
			});
			K(document.body).append(container);
		} else {
			self.srcElement.before(container);
		}
		//create toolbar
		var toolbar = _toolbar({
				parent : container,
				noDisableItems : 'source,fullscreen'.split(',')
			});
		_each(self.items, function(i, name) {
			toolbar.addItem({
				name : name,
				title : self.lang(name),
				click : function(e) {
					if (self.menu) {
						var menuName = self.menu.name;
						self.hideMenu();
						if (menuName === name) {
							return;
						}
					}
					_plugin(name).call(this, self);
				}
			});
		});
		if (!self.designMode) {
			toolbar.disable(true);
		}
		//create edit
		var edit = _edit({
				parent : container,
				srcElement : self.srcElement,
				designMode : self.designMode,
				bodyClass : self.bodyClass,
				cssData : self.cssData
			}),
			doc = edit.doc, textarea = edit.textarea;
		//bind events
		K(doc, document).click(function(e) {
			if (self.menu) {
				self.hideMenu();
			}
		});
		_each({
			undo : 'Z', redo : 'Y', bold : 'B', italic : 'I',
			underline : 'U', selectall : 'A', print : 'P'
		}, function(name, key) {
			_ctrl(doc, key, function() {
				if (_plugin(name)) {
					_plugin(name).call(doc, self);
				}
			});
			if (key == 'Z' || key == 'Y') {
				_ctrl(textarea.get(), key, function() {
					if (_plugin(name)) {
						_plugin(name).call(textarea, self);
					}
				});
			}
		});
		//create statusbar
		var statusbar = K('<div class="ke-statusbar"></div>');
		container.append(statusbar);
		if (!fullscreenMode) {
			var rightIcon = K('<span class="ke-inline-block ke-statusbar-right-icon"></span>');
			statusbar.append(rightIcon);
			_bindDragEvent({
				moveEl : container,
				clickEl : rightIcon,
				moveFn : function(x, y, width, height, diffX, diffY) {
					width += diffX;
					height += diffY;
					if (width >= self.minWidth) {
						self.resize(width, null);
					}
					if (height >= self.minHeight) {
						self.resize(null, height);
					}
				}
			});
		}
		if (self._resizeListener) {
			K(window).unbind('resize', self._resizeListener);
			self._resizeListener = null;
		}
		function resizeListener(e) {
			if (self.container) {
				self.resize(_docElement().clientWidth, _docElement().clientHeight);
			}
		}
		if (self.fullscreenMode) {
			K(window).bind('resize', resizeListener);
			self._resizeListener = resizeListener;
		}
		//properties
		self.container = container;
		self.toolbar = toolbar;
		self.edit = edit;
		self.statusbar = statusbar;
		self.menu = self.dialog = null;
		//reset size
		self.resize(width, height);
		return self;
	},
	remove : function() {
		var self = this;
		if (self.menu) {
			self.menu.remove();
		}
		self.toolbar.remove();
		self.edit.remove();
		self.statusbar.remove();
		self.container.remove();
		self.container = self.toolbar = self.edit = self.menu = self.dialog = null;
		return self;
	},
	resize : function(width, height) {
		var self = this;
		if (width !== null) {
			self.container.css('width', _addUnit(width));
		}
		if (height !== null) {
			height = _removeUnit(height) - self.toolbar.div().height() - self.statusbar.height() - 11;
			if (height > 0) {
				self.edit.height(height);
			}
		}
	},
	fullscreen : function(bool) {
		var self = this;
		self.fullscreenMode = (bool === undefined ? !self.fullscreenMode : bool);
		self.remove();
		return self.create();
	},
	createMenu : function(options) {
		var self = this,
			name = options.name,
			knode = self.toolbar.get(name),
			pos = knode.pos();
		options.x = pos.x;
		options.y = pos.y + knode.height();
		if (options.selectedColor !== undefined) {
			options.noColor = self.lang('noColor');
			self.menu = _colorpicker(options);
		} else {
			options.centerLineMode = false;
			self.menu = _menu(options);
		}
		return self.menu;
	},
	hideMenu : function() {
		this.menu.remove();
		this.menu = null;
	},
	createDialog : function(options) {
		var self = this,
			name = options.name;
		options.shadowMode = self.shadowMode;
		options.closeBtn = {
			name : self.lang('close'),
			click : function(e) {
				self.hideDialog();
				self.edit.focus();
			}
		};
		options.noBtn = {
			name : self.lang('no'),
			click : function(e) {
				self.hideDialog();
				self.edit.focus();
			}
		};
		return (self.dialog = _dialog(options));
	},
	hideDialog : function() {
		this.dialog.remove();
		this.dialog = null;
	}
};

/**
	@example
	K.create('textarea');
	K.create('textarea.class');
	K.create('#id');
*/
function _create(expr, options) {
	if (!options) {
		options = {};
	}
	var knode = K(expr);
	if (knode) {
		options.srcElement = knode[0];
		if (!options.width) {
			options.width = knode.width();
		}
		if (!options.height) {
			options.height = knode.height();
		}
		return new KEditor(options).create();
	}
}

//解决IE6浏览器重复下载背景图片的问题
if (_IE && _VERSION < 7) {
	_nativeCommand(document, 'BackgroundImageCache', true);
}

K.create = _create;
K.plugin = _plugin;
K.lang = _lang;

if (window.K === undefined) {
	window.K = K;
}
window.KindEditor = K;
