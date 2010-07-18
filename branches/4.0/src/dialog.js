/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name dialog.js
 * @fileOverview 浮动窗口
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "node.js"
*/

function _dialog(options) {
	options.z = options.z || 19811213;
	var self = _widget(options),
		remove = self.remove,
		doc = self.doc,
		title = options.title,
		body = _node(options.body, doc),
		previewBtn = options.previewBtn,
		yesBtn = options.yesBtn,
		noBtn = options.noBtn,
		shadowMode = options.shadowMode === undefined ? true : options.shadowMode;
	//create dialog
	self.div().addClass('ke-dialog').bind('click,mousedown', function(e){
		e.stop();
	});
	var contentCell;
	if (shadowMode) {
		var table = doc.createElement('table');
		table.className = 'ke-dialog-table';
		table.cellPadding = 0;
		table.cellSpacing = 0;
		table.border = 0;
		self.div().append(table);
		var rowNames = ['t', 'm', 'b'],
			colNames = ['l', 'c', 'r'],
			i, j, row, cell;
		for (i = 0, len = 3; i < len; i++) {
			row = table.insertRow(i);
			for (j = 0, l = 3; j < l; j++) {
				cell = row.insertCell(j);
				cell.className = 'ke-' + rowNames[i] + colNames[j];
				if (i == 1 && j == 1) {
					contentCell = _node(cell);
				} else {
					cell.innerHTML = '<span class="ke-dialog-empty"></span>';
				}
			}
		}
		contentCell.css({
			width : self.width,
			height : self.height,
			'vertical-align' : 'top' 
		});
	} else {
		self.div().addClass('ke-dialog-no-shadow');
		contentCell = self.div();
	}
	var headerDiv = _node('<div class="ke-dialog-header"></div>');
	contentCell.append(headerDiv);
	headerDiv.html(title);
	var span = _node('<span class="ke-dialog-icon-close ke-dialog-icon-close-' +
		(shadowMode ? '' : 'no-') + 'shadow" title="' + _plugin('close') + '"></span>')
		.click(function (e) {
			self.remove();
		});
	headerDiv.append(span);
	self.draggable({
		clickEl : headerDiv
	});
	var bodyDiv = _node('<div class="ke-dialog-body"></div>');
	contentCell.append(bodyDiv);
	bodyDiv.append(body);
	var footerDiv = _node('<div class="ke-dialog-footer"></div>');
	if (previewBtn || yesBtn || noBtn) {
		contentCell.append(footerDiv);
	}
	var buttons = [];
	_each([
		{ btn : previewBtn, name : 'preview' },
		{ btn : yesBtn, name : 'yes' },
		{ btn : noBtn, name : 'no' }
	], function() {
		var btn = this.btn;
		if (btn) {
			var button = _node('<input type="button" class="ke-dialog-' + this.name + '" value="' + btn.name + '" />');
			footerDiv.append(button);
			button.click(btn.click);
			buttons.push(button);
		}
	});
	bodyDiv.height(_removeUnit(self.height) - headerDiv.height() - footerDiv.height());
	var docEl = doc.documentElement;
	var mask = _widget({
		x : 0,
		y : 0,
		z : 19811212,
		width : Math.max(docEl.scrollWidth, docEl.clientWidth),
		height : Math.max(docEl.scrollHeight, docEl.clientHeight)
	});
	mask.div().addClass('ke-dialog-mask');
	//remove dialog
	self.remove = function() {
		mask.remove();
		span.remove();
		_each(buttons, function() {
			this.remove();
		});
		footerDiv.remove();
		bodyDiv.remove();
		headerDiv.remove();
		remove.call(self);
	};
	return self;
}

K.dialog = _dialog;
