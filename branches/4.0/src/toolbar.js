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

function KToolbar(options) {
	this.width = options.width || 0;
	this.height = options.height || 0;
	this.items = [];
	this.itemNodes = [];
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
		div.bind('contextmenu,dbclick', function(e) {
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
	disable : function() {
	
	},
	enable : function() {
	
	}
};

function _toolbar(options) {
	return new KToolbar(options);
}

K.toolbar = _toolbar;
