
KindEditor.plugin('core', function(K) {
	var self = this;
	// source
	self.clickToolbar('source', function() {
		self.toolbar.disable();
		self.edit.design();
	});
	// fullscreen, undo, redo
	K.each('fullscreen,undo,redo'.split(','), function(i, name) {
		if (self.shortcutKeys[name]) {
			self.afterCreate(function() {
				K.ctrl(this.edit.doc, self.shortcutKeys[name], function() {
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
		var fontSize = ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
			curVal = self.val('fontsize');
			menu = self.createMenu({
				name : 'fontsize',
				width : 150
			});
		K.each(fontSize, function(i, val) {
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
	// other
	K.each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
		'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,' +
		'bold,italic,underline,strikethrough,removeformat,unlink').split(','), function(i, name) {
		if (self.shortcutKeys[name]) {
			self.afterCreate(function() {
				K.ctrl(this.edit.doc, self.shortcutKeys[name], function() {
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
