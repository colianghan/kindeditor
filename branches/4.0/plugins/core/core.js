
KindEditor.plugin('core', function(K) {
	var self = this,
		shortcutKeys = {
			undo : 'Z', redo : 'Y', bold : 'B', italic : 'I', underline : 'U', print : 'P', selectall : 'A'
		};
	// source
	self.clickToolbar('source', function() {
		if (self.edit.designMode) {
			self.toolbar.disable(true);
			self.edit.design(false);
			self.toolbar.select('source');
		} else {
			self.toolbar.disable(false);
			self.edit.design(true);
			self.toolbar.unselect('source');
		}
		self.designMode = self.edit.designMode;
	});
	self.afterCreate(function() {
		if (this.designMode) {
			this.toolbar.unselect('source');
		} else {
			this.toolbar.disable(true).select('source');
		}
	});
	// fullscreen
	self.clickToolbar('fullscreen', function() {
		self.fullscreen();
	});
	var loaded = false;
	self.afterCreate(function() {
		K(self.edit.doc, self.edit.textarea).keyup(function(e) {
			if (e.which == 27) {
				self.clickToolbar('fullscreen');
			}
		});
		if (loaded) {
			self.focus();
		}
		if (!loaded) {
			loaded = true;
		}
	});
	// undo, redo
	K.each('undo,redo'.split(','), function(i, name) {
		if (shortcutKeys[name]) {
			self.afterCreate(function() {
				K.ctrl(this.edit.doc, shortcutKeys[name], function() {
					self.clickToolbar(name);
				});
			});
		}
		self.clickToolbar(name, function() {
			self[name]();
		});
	});
	// formatblock
	self.clickToolbar('formatblock', function() {
		var blocks = self.lang('formatblock.formatBlock'),
			heights = {
				h1 : 28,
				h2 : 24,
				h3 : 18,
				H4 : 14,
				p : 12
			},
			curVal = self.val('formatblock'),
			menu = self.createMenu({
				name : 'formatblock',
				width : self.langType == 'en' ? 200 : 150
			});
		K.each(blocks, function(key, val) {
			var style = 'font-size:' + heights[key] + 'px;';
			if (key.charAt(0) === 'h') {
				style += 'font-weight:bold;';
			}
			menu.addItem({
				title : '<span style="' + style + '">' + val + '</span>',
				height : heights[key] + 12,
				checked : (curVal === key || curVal === val),
				click : function() {
					self.select().exec('formatblock', '<' + key.toUpperCase() + '>').hideMenu();
				}
			});
		});
	});
	// fontname
	self.clickToolbar('fontname', function() {
		var curVal = self.val('fontname'),
			menu = self.createMenu({
				name : 'fontname',
				width : 150
			});
		K.each(self.lang('fontname.fontName'), function(key, val) {
			menu.addItem({
				title : '<span style="font-family: ' + key + ';">' + val + '</span>',
				checked : (curVal === key.toLowerCase() || curVal === val.toLowerCase()),
				click : function() {
					self.exec('fontname', key).hideMenu();
				}
			});
		});
	});
	// fontsize
	self.clickToolbar('fontsize', function() {
		var curVal = self.val('fontsize');
			menu = self.createMenu({
				name : 'fontsize',
				width : 150
			});
		K.each(self.fontSizeTable, function(i, val) {
			menu.addItem({
				title : '<span style="font-size:' + val + ';">' + val + '</span>',
				height : K.removeUnit(val) + 12,
				checked : curVal === val,
				click : function() {
					self.exec('fontsize', val).hideMenu();
				}
			});
		});
	});
	// forecolor,hilitecolor
	K.each('forecolor,hilitecolor'.split(','), function(i, name) {
		self.clickToolbar(name, function() {
			self.createMenu({
				name : name,
				selectedColor : self.val(name) || 'default',
				colors : self.colorTable,
				click : function(color) {
					self.exec(name, color).hideMenu();
				}
			});
		});
	});
	// cut,copy,paste
	K.each(('cut,copy,paste').split(','), function(i, name) {
		self.clickToolbar(name, function() {
			self.focus();
			try {
				self.exec(name, null);
			} catch(e) {
				alert(self.lang(name + 'Error'));
			}
		});
	});
	// about
	self.clickToolbar('about', function() {
		var html = '<div style="margin:20px;">' +
			'<div>KindEditor ' + K.VERSION + '</div>' +
			'<div>Copyright &copy; <a href="http://www.kindsoft.net/" target="_blank">kindsoft.net</a> All rights reserved.</div>' +
			'</div>';
		self.createDialog({
			name : 'about',
			width : 300,
			title : self.lang('about'),
			body : html
		});
	});
	// link,image,flash,media
	self.plugin.getSelectedLink = function() {
		return self.cmd.commonAncestor('a');
	};
	self.plugin.getSelectedImage = function() {
		var range = self.edit.cmd.range,
			sc = range.startContainer, so = range.startOffset;
		if (!K.WEBKIT && !range.isControl()) {
			return null;
		}
		var img = K(sc.childNodes[so]);
		if (img.name !== 'img' || /^ke-\w+$/i.test(img[0].className)) {
			return null;
		}
		return img;
	};
	self.plugin.getSelectedFlash = function() {
		var range = self.edit.cmd.range,
			sc = range.startContainer, so = range.startOffset;
		if (!K.WEBKIT && !range.isControl()) {
			return null;
		}
		var img = K(sc.childNodes[so]);
		if (img.name !== 'img' || img[0].className !== 'ke-flash') {
			return null;
		}
		return img;
	};
	self.plugin.getSelectedMedia = function() {
		var range = self.edit.cmd.range,
			sc = range.startContainer, so = range.startOffset;
		if (!K.WEBKIT && !range.isControl()) {
			return null;
		}
		var img = K(sc.childNodes[so]);
		if (img.name !== 'img' || !/^ke-\w+$/.test(img[0].className)) {
			return null;
		}
		if (img[0].className == 'ke-flash') {
			return null;
		}
		return img;
	};
	K.each('link,image,flash,media'.split(','), function(i, name) {
		var uName = name.charAt(0).toUpperCase() + name.substr(1);
		K.each('edit,delete'.split(','), function(j, val) {
			self.addContextmenu({
				title : self.lang(val + uName),
				click : function() {
					self.loadPlugin(name, function() {
						self.plugin[name][val]();
						self.hideMenu();
					});
				},
				cond : self.plugin['getSelected' + uName],
				width : 150,
				iconClass : val == 'edit' ? 'ke-icon-' + name : undefined
			});
		});
		self.addContextmenu({ title : '-' });
	});
	self.afterGetHtml(function(html) {
		return html.replace(/<img[^>]*class="?ke-\w+"?[^>]*>/ig, function(full) {
			var imgAttrs = K.getAttrList(full),
				attrs = K.mediaAttrs(imgAttrs['data-ke-tag']);
			return K.mediaEmbed(attrs);
		});
	});
	self.beforeSetHtml(function(html) {
		return html.replace(/<embed[^>]*type="([^"]+)"[^>]*>(?:<\/embed>)?/ig, function(full) {
			var attrs = K.getAttrList(full);
			attrs.src = K.undef(attrs.src, '');
			attrs.width = K.undef(attrs.width, 0);
			attrs.height = K.undef(attrs.height, 0);
			return K.mediaImg(self.themesPath + 'common/blank.gif', attrs);
		});
	});
	// table
	self.plugin.getSelectedTable = function() {
		return self.cmd.commonAncestor('table');
	};
	self.plugin.getSelectedRow = function() {
		return self.cmd.commonAncestor('tr');
	};
	self.plugin.getSelectedCell = function() {
		return self.cmd.commonAncestor('td');
	};
	K.each(('prop,cellprop,colinsertleft,colinsertright,rowinsertabove,rowinsertbelow,coldelete,' +
	'rowdelete,insert,delete').split(','), function(i, val) {
		var cond = K.inArray(val, ['prop', 'delete']) < 0 ? self.plugin.getSelectedCell : self.plugin.getSelectedTable;
		self.addContextmenu({
			title : self.lang('table' + val),
			click : function() {
				self.loadPlugin('table', function() {
					self.plugin.table[val]();
					self.hideMenu();
				});
			},
			cond : cond,
			width : 170,
			iconClass : 'ke-icon-table' + val
		});
	});
	self.addContextmenu({ title : '-' });
	// other
	K.each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
		'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,' +
		'bold,italic,underline,strikethrough,removeformat,unlink').split(','), function(i, name) {
		if (shortcutKeys[name]) {
			self.afterCreate(function() {
				K.ctrl(this.edit.doc, shortcutKeys[name], function() {
					self.cmd.selection();
					self.clickToolbar(name);
				});
			});
		}
		self.clickToolbar(name, function() {
			self.focus().exec(name, null);
		});
	});
});
