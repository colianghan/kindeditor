/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name menu.js
 * @fileOverview 工具栏菜单、右键菜单
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "node.js"
*/

function _menu(options) {
	options.z = options.z || 19811212;
	var self = _widget(options),
		remove = self.remove,
		centerLineMode = options.centerLineMode === undefined ? true : options.centerLineMode,
		itemNodes = [];
	self.div().addClass('ke-menu');
	//add an item of menu
	self.addItem = function(item) {
		if (item.title === '-') {
			self.div().append(_node('<div class="ke-menu-separator"></div>'));
			return;
		}
		var itemDiv = _node('<div></div>').addClass('ke-menu-item'),
			leftDiv = _node('<div></div>').addClass('ke-menu-item-left'),
			rightDiv = _node('<div></div>').addClass('ke-menu-item-right'),
			height = _addUnit(item.height),
			iconClass = item.iconClass;
		self.div().append(itemDiv);
		if (height) {
			itemDiv.css('height', height);
			rightDiv.css('line-height', height);
		}
		var centerDiv;
		if (centerLineMode) {
			centerDiv = _node('<div></div>').addClass('ke-menu-item-center');
			if (height) {
				centerDiv.css('height', height);
			}
		}
		itemDiv.bind('mouseover', function(e) {
			this.addClass('ke-menu-item-on');
			if (centerDiv) {
				centerDiv.addClass('ke-menu-item-center-on');
			}
			e.stop();
		});
		itemDiv.bind('mouseout', function(e) {
			this.removeClass('ke-menu-item-on');
			if (centerDiv) {
				centerDiv.removeClass('ke-menu-item-center-on');
			}
			e.stop();
		});
		itemDiv.bind('click', item.click);
		itemDiv.append(leftDiv);
		if (centerDiv) {
			itemDiv.append(centerDiv);
		}
		itemDiv.append(rightDiv);
		if (item.checked) {
			iconClass = 'ke-icon-checked';
		}
		leftDiv.html('<span class="ke-inline-block ke-toolbar-icon ke-toolbar-icon-url ' + iconClass + '"></span>');
		rightDiv.html(item.title);
		itemNodes.push(itemDiv);
	};
	//remove menu
	self.remove = function() {
		_each(itemNodes, function() {
			this.remove();
		});
		remove.call(self);
	};
	return self;
}

K.menu = _menu;
