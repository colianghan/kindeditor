/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name table.js
 * @fileOverview 表格插件
 * @author Longhao Luo
 */

KindEditor.plugin('table', function(K) {
	var self = this, name = 'table',
		lang = self.lang(name + '.'),
		cmd = self.edit.cmd;
	function getSelectedTable() {
		return cmd.commonNode({ table : '*' });
	}
	function getSelectedRow() {
		return cmd.commonNode({ tr : '*' });
	}
	function getSelectedCell() {
		return cmd.commonNode({ td : '*' });
	}
	var functions = {
		//insert or modify table
		prop : function(isInsert) {
			var html = [
				'<div style="margin:10px;">',
				//rows, cols
				'<div class="ke-dialog-row">',
				'<label for="keRows">' + lang.cells + '</label>',
				lang.rows + ' <input type="text" id="keRows" class="ke-input-number" name="rows" value="" maxlength="4" /> ',
				lang.cols + ' <input type="text" class="ke-input-number" name="cols" value="" maxlength="4" /> ',
				'</div>',
				//width, height
				'<div class="ke-dialog-row">',
				'<label for="keWidth">' + lang.size + '</label>',
				lang.width + ' <input type="text" id="keWidth" class="ke-input-number" name="width" value="" maxlength="4" /> ',
				'<select name="widthType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select> ',
				lang.height + ' <input type="text" class="ke-input-number" name="height" value="" maxlength="4" /> ',
				'<select name="heightType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select> ',
				'</div>',
				//space, padding
				'<div class="ke-dialog-row">',
				'<label for="kePadding">' + lang.space + '</label>',
				lang.padding + ' <input type="text" id="kePadding" class="ke-input-number" name="padding" value="" maxlength="4" /> ',
				lang.spacing + ' <input type="text" class="ke-input-number" name="spacing" value="" maxlength="4" /> ',
				'</div>',
				//align
				'<div class="ke-dialog-row">',
				'<label for="keAlign">' + lang.align + '</label>',
				'<select id="keAlign" name="align">',
				'<option value="">' + lang.alignDefault + '</option>',
				'<option value="left">' + lang.alignLeft + '</option>',
				'<option value="center">' + lang.alignCenter + '</option>',
				'<option value="right">' + lang.alignRight + '</option>',
				'</select>',
				'</div>',
				//border
				'<div class="ke-dialog-row">',
				'<label for="keBorder">' + lang.border + '</label>',
				lang.borderWidth + ' <input type="text" id="keBorder" class="ke-input-number" name="border" value="" maxlength="4" /> ',
				lang.borderColor + ' <span class="ke-inline-block ke-input-color"></span>',
				'</div>',
				//background color
				'<div class="ke-dialog-row">',
				'<label for="keBgColor">' + lang.backgroundColor + '</label>',
				'<span class="ke-inline-block ke-input-color"></span> ',
				'</div>',
				'</div>'
			].join('');
			var picker, currentElement;
			function removePicker() {
				if (picker) {
					picker.remove();
					picker = null;
					currentElement = null;
				}
			}
			var dialog = self.createDialog({
				name : name,
				width : 400,
				height : 300,
				title : self.lang(name),
				body : html,
				beforeDrag : removePicker,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var rows = rowsBox.val(),
							cols = colsBox.val(),
							width = widthBox.val(),
							height = heightBox.val(),
							widthType = widthTypeBox.val(),
							heightType = heightTypeBox.val(),
							padding = paddingBox.val(),
							spacing = spacingBox.val(),
							align = alignBox.val(),
							border = borderBox.val(),
							borderColor = K(colorBox[0]).html() || '',
							bgColor = K(colorBox[1]).html() || '';
						//modify table
						if (table) {
							if (width !== '') {
								table.width(width + widthType);
							} else {
								table.css('width', '');
							}
							if (table[0].width !== undefined) {
								table.removeAttr('width');
							}
							if (height !== '') {
								table.height(height + heightType);
							} else {
								table.css('height', '');
							}
							if (table[0].height !== undefined) {
								table.removeAttr('height');
							}
							table.css('background-color', bgColor);
							if (table[0].bgColor !== undefined) {
								table.removeAttr('bgColor');
							}
							if (padding !== '') {
								table[0].cellPadding = padding;
							} else {
								table.removeAttr('cellPadding');
							}
							if (spacing !== '') {
								table[0].cellSpacing = spacing;
							} else {
								table.removeAttr('cellSpacing');
							}
							if (align !== '') {
								table[0].align = align;
							} else {
								table.removeAttr('align');
							}
							if (border !== '') {
								table.attr('border', border);
							} else {
								table.removeAttr('border');
							}
							if (borderColor !== '') {
								table.attr('borderColor', borderColor);
							} else {
								table.removeAttr('borderColor');
							}
							self.hideDialog().focus();
							return;
						}
						//insert new table
						var style = '';
						if (width !== '') {
							style += 'width:' + width + widthType + ';';
						}
						if (height !== '') {
							style += 'height:' + height + heightType + ';';
						}
						if (bgColor !== '') {
							style += 'background-color:' + bgColor + ';';
						}
						var html = '<table';
						if (style !== '') {
							html += ' style="' + style + '"';
						}
						if (padding !== '') {
							html += ' cellpadding="' + padding + '"';
						}
						if (spacing !== '') {
							html += ' cellspacing="' + spacing + '"';
						}
						if (align !== '') {
							html += ' align="' + align + '"';
						}
						if (border !== '') {
							html += ' border="' + border + '"';
						}
						if (borderColor !== '') {
							html += ' bordercolor="' + borderColor + '"';
						}
						html += '>';
						for (var i = 0; i < rows; i++) {
							html += '<tr>';
							for (var j = 0; j < cols; j++) {
								html += '<td>&nbsp;</td>';
							}
							html += '</tr>';
						}
						html += '</table>';
						self.insertHtml(html).hideDialog().focus();
					}
				}
			}),
			div = dialog.div(),
			rowsBox = K('[name="rows"]', div).val(3),
			colsBox = K('[name="cols"]', div).val(2),
			widthBox = K('[name="width"]', div).val(100),
			heightBox = K('[name="height"]', div),
			widthTypeBox = K('[name="widthType"]', div),
			heightTypeBox = K('[name="heightType"]', div),
			paddingBox = K('[name="padding"]', div).val(2),
			spacingBox = K('[name="spacing"]', div).val(0),
			alignBox = K('[name="align"]', div),
			borderBox = K('[name="border"]', div).val(1),
			colorBox = K('.ke-input-color', div);
			function setColor(box, color) {
				color = color.toUpperCase();
				box.css('background-color', color);
				box.css('color', color === '#000000' ? '#FFFFFF' : '#000000');
				box.html(color);
			}
			setColor(K(colorBox[0]), '#000000');
			setColor(K(colorBox[1]), '');
			function clickHandler(e) {
				removePicker();
				if (!picker || this !== currentElement) {
					var box = K(this),
						pos = box.pos();
					picker = K.colorpicker({
						x : pos.x,
						y : pos.y + box.height(),
						z : 811214,
						selectedColor : K(this).html(),
						noColor : self.lang('noColor'),
						click : function(color) {
							setColor(box, color);
							removePicker();
						}
					});
					currentElement = this;
				}
			}
			colorBox.click(clickHandler);
			self.beforeHideDialog(function() {
				removePicker();
				colorBox.unbind();
			});
			var table;
			if (isInsert) {
				return;
			}
			//get selected table node
			table = getSelectedTable();
			if (table) {
				rowsBox.val(table[0].rows.length);
				colsBox.val(table[0].rows.length > 0 ? table[0].rows[0].cells.length : 0);
				rowsBox.attr('disabled', true);
				colsBox.attr('disabled', true);
				var match,
					tableWidth = table[0].style.width || table[0].width,
					tableHeight = table[0].style.height || table[0].height;
				if (tableWidth !== undefined && (match = /^(\d+)((?:px|%)*)$/.exec(tableWidth))) {
					widthBox.val(match[1]);
					widthTypeBox.val(match[2]);
				} else {
					widthBox.val('');
				}
				if (tableHeight !== undefined && (match = /^(\d+)((?:px|%)*)$/.exec(tableHeight))) {
					heightBox.val(match[1]);
					heightTypeBox.val(match[2]);
				}
				paddingBox.val(table[0].cellPadding || '');
				spacingBox.val(table[0].cellSpacing || '');
				alignBox.val(table[0].align || '');
				borderBox.val(table[0].border === undefined ? '' : table[0].border);
				setColor(K(colorBox[0]), K.toHex(table.attr('borderColor')) || '');
				setColor(K(colorBox[1]), K.toHex(table[0].style.backgroundColor || table[0].bgColor || ''));
			}
		},
		insert : function() {
			this.prop(true);
		},
		'delete' : function() {
			getSelectedTable().remove();
		},
		colinsert : function(offset) {
			var table = getSelectedTable()[0], cell = getSelectedCell()[0],
				index = cell.cellIndex + offset;
			for (var i = 0, len = table.rows.length; i < len; i++) {
				var newCell = table.rows[i].insertCell(index);
				newCell.innerHTML = '&nbsp;';
			}
		},
		colinsertleft : function() {
			this.colinsert(0);
		},
		colinsertright : function() {
			this.colinsert(1);
		},
		rowinsert : function(offset) {
			var table = getSelectedTable()[0], row = getSelectedRow()[0],
				newRow = table.insertRow(row.rowIndex + offset);
			for (var i = 0, len = row.cells.length; i < len; i++) {
				var cell = newRow.insertCell(i);
				cell.innerHTML = '&nbsp;';
			}
		},
		rowinsertabove : function() {
			this.rowinsert(0);
		},
		rowinsertbelow : function() {
			this.rowinsert(1);
		},
		coldelete : function() {
			var table = getSelectedTable()[0], cell = getSelectedCell()[0];
			for (var i = 0, len = table.rows.length; i < len; i++) {
				table.rows[i].deleteCell(cell.cellIndex);
			}
		},
		rowdelete : function() {
			var table = getSelectedTable()[0], row = getSelectedRow()[0];
			table.deleteRow(row.rowIndex);
		}
	};
	self.clickToolbar(name, functions.prop);
	K.each(('prop,colinsertleft,colinsertright,rowinsertabove,rowinsertbelow,coldelete,' +
	'rowdelete,insert,delete').split(','), function(i, val) {
		var cond = K.inArray(val, ['prop', 'delete']) < 0 ? getSelectedCell : getSelectedTable;
		self.addContextmenu({
			title : self.lang('table' + val),
			click : function() {
				functions[val]();
				self.hideMenu();
			},
			cond : cond,
			width : 170,
			iconClass : 'ke-icon-table' + val
		});
	});
	self.addContextmenu({ title : '-' });
});
