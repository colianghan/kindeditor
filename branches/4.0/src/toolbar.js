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
	itemNode.mouseover(function(e) {
		this.addClass('ke-toolbar-icon-outline-on');
		e.stop();
	});
	itemNode.mouseout(function(e) {
		this.removeClass('ke-toolbar-icon-outline-on');
		e.stop();
	});
	itemNode.click(function(e) {
		item.click.call(this, e);
		e.stop();
	});
}

function _toolbar(options) {
	var self = _widget(options),
		remove = self.remove,
		disableMode = options.disableMode === undefined ? false : options.disableMode,
		noDisableItems = options.noDisableItems === undefined ? [] : options.noDisableItems,
		itemNodes = [];
	//create toolbar
	var inner = _node('<div class="ke-toolbar-inner"></div>');
	self.div().addClass('ke-toolbar')
		.bind('contextmenu,mousedown,mousemove', function(e) {
			e.stop();
		})
		.append(inner);
	//add a item of toolbar
	self.addItem = function(item) {
		var itemNode;
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
		itemNodes.push(itemNode);
		inner.append(itemNode);
	};
	//remove toolbar
	self.remove = function() {
		_each(itemNodes, function() {
			this.remove();
		});
		inner.remove();
		remove.call(self);
	};
	//toggle enable/disable
	self.disable = function(bool) {
		var arr = noDisableItems, item;
		//disable toolbar
		if (bool === undefined ? !disableMode : bool) {
			_each(itemNodes, function() {
				item = this.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					this.addClass('ke-toolbar-icon-outline-disabled');
					this.opacity(0.5);
					if (item.name !== '|') {
						this.unbind();
					}
				}
			});
			disableMode = true;
		//enable toolbar
		} else {
			_each(itemNodes, function() {
				item = this.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					this.removeClass('ke-toolbar-icon-outline-disabled');
					this.opacity(1);
					if (item.name !== '|') {
						_bindToolbarEvent(this, item);
					}
				}
			});
			disableMode = false;
		}
	};
	return self;
}

K.toolbar = _toolbar;
