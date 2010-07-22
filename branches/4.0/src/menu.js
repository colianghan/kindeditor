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
	options.z = options.z || 19811213;
	var self = _widget(options),
		div = self.div(),
		remove = self.remove,
		centerLineMode = options.centerLineMode === undefined ? true : options.centerLineMode;
	div.addClass('ke-menu');
	//add an item of menu
	self.addItem = function(item) {
		if (item.title === '-') {
			div.append(K('<div class="ke-menu-separator"></div>'));
			return;
		}
		var itemDiv = K('<div class="ke-menu-item"></div>'),
			leftDiv = K('<div class="ke-menu-item-left"></div>'),
			rightDiv = K('<div class="ke-menu-item-right"></div>'),
			height = _addUnit(item.height),
			iconClass = item.iconClass;
		div.append(itemDiv);
		if (height) {
			itemDiv.css('height', height);
			rightDiv.css('line-height', height);
		}
		var centerDiv;
		if (centerLineMode) {
			centerDiv = K('<div class="ke-menu-item-center"></div>');
			if (height) {
				centerDiv.css('height', height);
			}
		}
		itemDiv.mouseover(function(e) {
			K(this).addClass('ke-menu-item-on');
			if (centerDiv) {
				centerDiv.addClass('ke-menu-item-center-on');
			}
		});
		itemDiv.mouseout(function(e) {
			K(this).removeClass('ke-menu-item-on');
			if (centerDiv) {
				centerDiv.removeClass('ke-menu-item-center-on');
			}
		});
		itemDiv.click(item.click);
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
	};
	//remove menu
	self.remove = function() {
		K('.ke-menu-item', div.get()).remove();
		remove.call(self);
	};
	return self;
}

K.menu = _menu;
