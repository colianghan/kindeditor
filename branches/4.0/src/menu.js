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
	var self = _widget(options),
		create = self.create,
		remove = self.remove,
		centerLineMode = options.centerLineMode === undefined ? true : options.centerLineMode;
	self.z = options.z || 19811212;
	self.items = [];
	self.itemNodes = [];
	self.addItem = function(item) {
		self.items.push(item);
	};
	self.create = function() {
		if (self.div) {
			return self;
		}
		create.call(self);
		var div = self.div;
		div.addClass('ke-menu');
		_each(self.items, function() {
			if (this.title === '-') {
				div.append(_node('<div class="ke-menu-separator"></div>'));
				return;
			}
			var itemDiv = _node('<div></div>').addClass('ke-menu-item'),
				leftDiv = _node('<div></div>').addClass('ke-menu-item-left'),
				rightDiv = _node('<div></div>').addClass('ke-menu-item-right'),
				height = _addUnit(this.height),
				iconClass = this.iconClass;
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
			itemDiv.bind('click', this.click);
			itemDiv.append(leftDiv);
			if (centerDiv) {
				itemDiv.append(centerDiv);
			}
			itemDiv.append(rightDiv);
			if (this.checked) {
				iconClass = 'ke-icon-checked';
			}
			leftDiv.html('<span class="ke-inline-block ke-toolbar-icon ke-toolbar-icon-url ' + iconClass + '"></span>');
			rightDiv.html(this.title);
			div.append(itemDiv);
			self.itemNodes.push(itemDiv);
		});
		self.remove = function() {
			_each(self.itemNodes, function() {
				this.unbind();
			});
			self.itemNodes = [];
			remove.call(self);
			return self;
		};
		return self;
	};
	return self;
}

K.menu = _menu;
