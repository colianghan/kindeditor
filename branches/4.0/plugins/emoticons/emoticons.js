/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name emoticons.js
 * @fileOverview 编辑器表情插件
 * @author Longhao Luo
 */

KindEditor.plugin(function(K) {
	var self = this,
		path = (this.emoticonsPath || this.scriptPath + 'plugins/emoticons/images/'),
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
