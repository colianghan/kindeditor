/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name toolbar.js
 * @fileOverview 工具栏类
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "node.js"
*/

function _bindToolbarEvent(itemNode, item) {
	itemNode.bind('mouseover', function(e) {
		this.addClass('ke-toolbar-icon-outline-on');
		e.stop();
	});
	itemNode.bind('mouseout', function(e) {
		this.removeClass('ke-toolbar-icon-outline-on');
		e.stop();
	});
	itemNode.bind('click', function(e) {
		item.click.call(this, e);
		e.stop();
	});
}

function _toolbar(options) {
	var self = _widget(options),
		create = self.create,
		remove = self.remove;
	self.items = [];
	self.itemNodes = [];
	self.disableMode = options.disableMode === undefined ? false : options.disableMode;
	self.noDisableItems = options.noDisableItems === undefined ? [] : options.noDisableItems;
	self.addItem = function(item) {
		self.items.push(item);
	};
	self.create = function(expr) {
		if (self.div) {
			return self;
		}
		create.call(self, expr);
		var div = self.div.addClass('ke-toolbar').css('width', self.width), itemNode,
			inner = _node('<div class="ke-toolbar-inner"></div>');
		div.bind('contextmenu,dbclick,mousedown,mousemove', function(e) {
			e.stop();
		});
		_each(self.items, function(i, item) {
			if (item.name == '|') {
				itemNode = _node('<span class="ke-inline-block ke-toolbar-separator"></span>');
			} else if (item.name == '/') {
				itemNode = _node('<br />');
			} else {
				itemNode = _node('<a class="ke-inline-block ke-toolbar-icon-outline" href="#"></a>');
				itemNode.append(_node('<span class="ke-inline-block ke-toolbar-icon ke-toolbar-icon-url ke-icon-' + item.name + '"></span>'));
				_bindToolbarEvent(itemNode, item);
			}
			itemNode.data('item', item);
			self.itemNodes.push(itemNode);
			inner.append(itemNode);
		});
		self.div = div.append(inner);
		return self;
	};
	self.remove = function() {
		if (!self.div) {
			return self;
		}
		_each(self.itemNodes, function() {
			this.remove();
		});
		self.itemNodes = [];
		remove.call(self);
		return self;
	};
	self.disable = function(bool) {
		var arr = self.noDisableItems, item;
		//disable toolbar
		if (bool === undefined ? !self.disableMode : bool) {
			_each(self.itemNodes, function() {
				item = this.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					this.addClass('ke-toolbar-icon-outline-disabled');
					this.opacity(0.5);
					if (item.name !== '|') {
						this.unbind();
					}
				}
			});
			self.disableMode = true;
		//enable toolbar
		} else {
			_each(self.itemNodes, function() {
				item = this.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					this.removeClass('ke-toolbar-icon-outline-disabled');
					this.opacity(1);
					if (item.name !== '|') {
						_bindToolbarEvent(this, item);
					}
				}
			});
			self.disableMode = false;
		}
		return self;
	};
	return self;
}

K.toolbar = _toolbar;
