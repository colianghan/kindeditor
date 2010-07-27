/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name default.js
 * @fileOverview 编辑器默认插件
 * @author Longhao Luo
 */

(function(K, undefined) {

K.plugin(function() {
	this.clickToolbar('source', function() {
		this.toolbar.disable();
		this.edit.design();
	});
});

K.plugin(function() {
	this.clickToolbar('fullscreen', function() {
		this.fullscreen();
	});
});

K.plugin(function() {
	this.clickToolbar('formatblock', function() {
		var self = this,
			blocks = self.lang('formatblock.formatBlock'),
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
});

K.plugin(function() {
	this.clickToolbar('fontname', function() {
		var self = this;
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
});

K.plugin(function() {
	this.clickToolbar('fontsize', function() {
		var self = this,
			fontSize = ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
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
});

K.each('forecolor,hilitecolor'.split(','), function(i, name) {
	K.plugin(function() {
		this.clickToolbar(name, function() {
			var self = this;
			self.createMenu({
				name : name,
				selectedColor : self.val(name) || 'default',
				click : function(color) {
					self.exec(name, color).hideMenu();
				}
			});
		});
	});
});

K.each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
	'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,' +
	'bold,italic,underline,strikethrough,removeformat,unlink').split(','), function(i, name) {
	K.plugin(function() {
		var self = this;
		if (self.shortcutKeys[name]) {
			self.afterCreate(function() {
				K.ctrl(this.edit.doc, self.shortcutKeys[name], function() {
					self.clickToolbar(name);
				});
			});
		}
		self.clickToolbar(name, function() {
			self.focus().exec(name, null);
		});
	});
});

K.each(('cut,copy,paste').split(','), function(i, name) {
	K.plugin(function() {
		this.clickToolbar(name, function() {
			this.focus();
			try {
				this.exec(name, null);
			} catch(e) {
				alert(this.lang(name + 'Error'));
			}
		});
	});
});

K.plugin(function() {
	this.clickToolbar('about', function() {
		var html = '<div style="margin:20px;">' +
			'<div>KindEditor ' + K.kindeditor + '</div>' +
			'<div>Copyright &copy; <a href="http://www.kindsoft.net/" target="_blank">kindsoft.net</a> All rights reserved.</div>' +
			'</div>';
		this.createDialog({
			name : 'about',
			width : 300,
			title : this.lang('about'),
			body : html
		});
	});
});

K.plugin(function() {
	this.clickToolbar('plainpaste', function() {
		var self = this,
			lang = self.lang('plainpaste.'),
			html = '<div style="margin:10px;">' +
				'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
				'<textarea style="width:415px;height:260px;border:1px solid #A0A0A0;"></textarea>' +
				'</div>',
			dialog = self.createDialog({
				name : 'plainpaste',
				width : 450,
				title : self.lang('plainpaste'),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var html = textarea.val();
						html = K.escape(html);
						html = html.replace(/ /g, '&nbsp;');
						html = html.replace(/\r\n|\n|\r/g, "<br />$&");
						self.insertHtml(html).hideDialog().focus();
					}
				}
			}),
			textarea = K('textarea', dialog.div());
		textarea.get().focus();
	});
});

K.plugin(function() {
	this.clickToolbar('wordpaste', function() {
		var self = this,
			lang = self.lang('wordpaste.'),
			html = '<div style="margin:10px;">' +
				'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
				'<iframe style="width:415px;height:260px;border:1px solid #A0A0A0;" frameborder="0"></iframe>' +
				'</div>',
			dialog = self.createDialog({
				name : 'wordpaste',
				width : 450,
				title : self.lang('wordpaste'),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var str = doc.body.innerHTML;
						str = str.replace(/<meta(\n|.)*?>/ig, '');
						str = str.replace(/<!(\n|.)*?>/ig, '');
						str = str.replace(/<style[^>]*>(\n|.)*?<\/style>/ig, '');
						str = str.replace(/<script[^>]*>(\n|.)*?<\/script>/ig, '');
						str = str.replace(/<w:[^>]+>(\n|.)*?<\/w:[^>]+>/ig, '');
						str = str.replace(/<xml>(\n|.)*?<\/xml>/ig, '');
						str = str.replace(/\r\n|\n|\r/ig, '');
						self.insertHtml(str).hideDialog().focus();
					}
				}
			}),
			div = dialog.div(),
			iframe = K('iframe', div.get());
		var doc = K.iframeDoc(iframe);
		if (!K.IE) {
			doc.designMode = 'on';
		}
		doc.open();
		doc.write('<html><head><title>WordPaste</title></head>');
		doc.write('<body style="background-color:#FFFFFF;font-size:12px;margin:2px;" />');
		if (!K.IE) {
			doc.write('<br />');
		}
		doc.write('</body></html>');
		doc.close();
		if (K.IE) {
			doc.body.contentEditable = 'true';
		}
		iframe.get().contentWindow.focus();
	});
});

K.plugin(function() {
	this.clickToolbar('link', function() {
		var self = this,
			lang = self.lang('link.'),
			html = '<div style="margin:10px;">' +
				'<div style="margin-bottom:10px;"><label>' + lang.url + '</label>' +
				'<input type="text" name="url" value="" style="width:90%;" /></div>' +
				'<div style="margin-bottom:10px;"><label>' + lang.linkType + '</label>' +
				'<select name="type"></select>' +
				'</div>',
			dialog = self.createDialog({
				name : 'link',
				width : 400,
				title : self.lang('link'),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						self.exec('createlink', urlBox.val(), typeBox.val()).hideDialog().focus();
					}
				}
			}),
			div = dialog.div(),
			urlBox = K('input[name="url"]', div),
			typeBox = K('select[name="type"]', div);
		typeBox.get().options[0] = new Option(lang.newWindow, '_blank');
		typeBox.get().options[1] = new Option(lang.selfWindow, '');
		urlBox.val(self.val('createlink'));
		urlBox.get().focus();
	});
});

K.plugin(function() {
	var self = this,
		path = (this.emoticonsPath || this.scriptPath + 'emoticons/'),
		allowPreview = this.allowPreviewEmoticons === undefined ? true : this.allowPreviewEmoticons;
	self.clickToolbar('emoticons', function() {
		var rows = 5, cols = 9, total = 135, startNum = 0,
			cells = rows * cols, pages = Math.ceil(total / cells),
			colsHalf = Math.floor(cols / 2),
			wrapperDiv = K('<div class="ke-plugin-emoticons-wrapper"></div>'),
			elements = [],
			menu = self.createMenu({
				name : 'emoticons'
			});
		menu.div().append(wrapperDiv);
		var previewDiv, previewImg;
		if (allowPreview) {
			previewDiv = K('<div class="ke-plugin-emoticons-preview"></div>').css('right', 0);
			previewImg = K('<img class="ke-plugin-emoticons-preview-img" src="' + path + startNum + '.gif" />');
			wrapperDiv.append(previewDiv);
			previewDiv.append(previewImg);
		}
		function createEmoticonsTable(pageNum, parentDiv) {
			var table = document.createElement('table');
			parentDiv.append(table);
			if (previewDiv) {
				K(table).mouseover(function() {
					previewDiv.show();
				});
				K(table).mouseout(function() {
					previewDiv.hide();
				});
				elements.push(K(table));
			}
			table.className = 'ke-plugin-emoticons-table';
			table.cellPadding = 0;
			table.cellSpacing = 0;
			table.border = 0;
			var num = (pageNum - 1) * cells + startNum;
			for (var i = 0; i < rows; i++) {
				var row = table.insertRow(i);
				for (var j = 0; j < cols; j++) {
					var cell = K(row.insertCell(j));
					cell.addClass('ke-plugin-emoticons-cell');
					if (previewDiv) {
						(function(j, num) {
							cell.mouseover(function() {
								if (j > colsHalf) {
									previewDiv.css('left', 0);
									previewDiv.css('right', '');
								} else {
									previewDiv.css('left', '');
									previewDiv.css('right', 0);
								}
								previewImg.attr('src', path + num + '.gif');
								K(this).addClass('ke-plugin-emoticons-cell-on');
							});
						})(j, num);
					} else {
						cell.mouseover(function() {
							K(this).addClass('ke-plugin-emoticons-cell-on');
						});
					}
					cell.mouseout(function() {
						K(this).removeClass('ke-plugin-emoticons-cell-on');
					});
					(function(num) {
						cell.click(function(e) {
							self.insertHtml('<img src="' + path + num + '.gif" border="0" alt="" />').hideMenu().focus();
							e.stop();
						});
					})(num);
					var span = K('<span class="ke-plugin-emoticons-img"></span>')
						.css('background-position', '-' + (24 * num) + 'px 0px')
						.css('background-image', 'url(' + path + 'static.gif)');
					cell.append(span);
					elements.push(cell);
					num++;
				}
			}
			return table;
		}
		var table = createEmoticonsTable(1, wrapperDiv);
		function removeEvent() {
			K.each(elements, function() {
				this.unbind();
			});
		}
		function createPageTable(currentPageNum) {
			var pageDiv = K('<div class="ke-plugin-emoticons-page"></div>');
			wrapperDiv.append(pageDiv);
			for (var pageNum = 1; pageNum <= pages; pageNum++) {
				if (currentPageNum !== pageNum) {
					var a = K('<a href="javascript:;">[' + pageNum + ']</a>');
					(function(pageNum) {
						a.click(function(e) {
							removeEvent();
							table.parentNode.removeChild(table);
							pageDiv.remove();
							table = createEmoticonsTable(pageNum, wrapperDiv);
							createPageTable(pageNum);
							e.stop();
						});
					})(pageNum);
					pageDiv.append(a);
					elements.push(a);
				} else {
					pageDiv.append(K('@[' + pageNum + ']'));
				}
				pageDiv.append(K('@&nbsp;'));
			}
		}
		createPageTable(1);
		self.beforeHideMenu(function() {
			removeEvent();
		});
	});
});

})(KindEditor);
