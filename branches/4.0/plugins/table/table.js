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
		lang = self.lang(name + '.');
	self.clickToolbar(name, function() {
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
			height : 290,
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
						borderColor = K(colorBox[0]).html(),
						bgColor = K(colorBox[1]).html();
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
				picker = _colorpicker({
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
		//get selected image node
		//var range = self.edit.cmd.range,
		//	sc = range.startContainer, so = range.startOffset;
		//if (!K.WEBKIT && !range.isControl()) {
		//	return;
		//}
		//var img = K(sc.childNodes[so]);
		//if (img.name !== 'img' || img[0].className !== 'ke-flash') {
		//	return;
		//}
		//var attrs = K.mediaAttrs(img.attr('kesrctag'));
		//urlBox.val(attrs.src);
		//widthBox.val(K.removeUnit(img.css('width')) || attrs.width || 0);
		//heightBox.val(K.removeUnit(img.css('height')) || attrs.height || 0);
		//urlBox[0].focus();
	});
});
