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
		item.click.call(this);
		e.stop();
	});
}

function KToolbar(options) {
	var self = this;
	self.width = options.width || 0;
	self.height = options.height || 0;
	self.items = [];
	self.itemNodes = [];
	self.disableMode = options.disableMode === undefined ? false : options.disableMode;
	self.noDisableItems = options.noDisableItems === undefined ? [] : options.noDisableItems;
}

KToolbar.prototype = {
	addItem : function(item) {
		this.items.push(item);
	},
	create : function(expr) {
		var self = this;
		if (self.div) {
			return self;
		}
		var div = _node(expr).addClass('ke-toolbar').css({ width : self.width }), itemNode,
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
	},
	remove : function() {
		var self = this;
		if (!self.div) {
			return self;
		}
		_each(self.itemNodes, function() {
			this.remove();
		});
		self.itemNodes = [];
		self.div.removeClass('ke-toolbar').css('width', '').unbind();
		self.div.html('');
		self.div = null;
		return self;
	},
	disable : function(bool) {
		var self = this, arr = self.noDisableItems, item;
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
	}
};

function _toolbar(options) {
	return new KToolbar(options);
}

K.toolbar = _toolbar;
