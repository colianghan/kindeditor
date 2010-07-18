/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name colorpicker.js
 * @fileOverview 颜色选择器
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "node.js"
#using "widget.js"
*/

function _colorpicker(options) {
	options.z = options.z || 19811213;
	var self = _widget(options),
		colors = options.colors || [
			['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
			['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
			['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
			['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
		],
		selectedColor = (options.selectedColor || '').toLowerCase(),
		remove = self.remove,
		cells = [];
	//create color picker
	self.div().addClass('ke-colorpicker');
	function addAttr(cell, color, cls) {
		cell = _node(cell).addClass(cls);
		if (selectedColor === color.toLowerCase()) {
			cell.addClass('ke-colorpicker-cell-selected');
		}
		cell.attr('title', color || _lang('noColor'));
		cell.mouseover(function(e) {
			this.addClass('ke-colorpicker-cell-on');
		});
		cell.mouseout(function(e) {
			this.removeClass('ke-colorpicker-cell-on');
		});
		cell.click(function(e) {
			options.click.call(this, color);
			e.stop();
		});
		if (color) {
			cell.append(_node('<div class="ke-colorpicker-cell-color"></div>').css('background-color', color));
		} else {
			cell.html(_lang('noColor'));
		}
		cells.push(cell);
	}
	var table = self.doc.createElement('table');
	self.div().append(table);
	table.className = 'ke-colorpicker-table';
	table.cellPadding = 0;
	table.cellSpacing = 0;
	table.border = 0;
	var row = table.insertRow(0), cell = row.insertCell(0);
	cell.colSpan = colors[0].length;
	addAttr(cell, '', 'ke-colorpicker-cell-top');
	for (var i = 0; i < colors.length; i++) {
		row = table.insertRow(i + 1);
		for (var j = 0; j < colors[i].length; j++) {
			cell = row.insertCell(j);
			addAttr(cell, colors[i][j], 'ke-colorpicker-cell');
		}
	}
	//remove color picker
	self.remove = function() {
		_each(cells, function() {
			this.remove();
		});
		remove.call(self);
	};
	return self;
}

K.colorpicker = _colorpicker;
