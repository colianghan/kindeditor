
function _bindToolbarEvent(itemNode, item) {
	itemNode.mouseover(function(e) {
		K(this).addClass('ke-on');
	})
	.mouseout(function(e) {
		K(this).removeClass('ke-on');
	})
	.click(function(e) {
		item.click.call(this, e);
	});
}

// create KToolbar class
function KToolbar(options) {
	this.init(options);
}
_extend(KToolbar, KWidget, {
	init : function(options) {
		var self = this;
		KToolbar.parent.init.call(self, options);
		self.disableMode = _undef(options.disableMode, false);
		self.noDisableItems = _undef(options.noDisableItems, []);
		self._itemNodes = {};
		self.div.addClass('ke-toolbar').bind('contextmenu,mousedown,mousemove', function(e) {
			e.preventDefault();
		});
	},
	get : function(key) {
		return this._itemNodes[key];
	},
	addItem : function(item) {
		var self = this, itemNode;
		if (item.name == '|') {
			itemNode = K('<span class="ke-inline-block ke-separator"></span>');
		} else if (item.name == '/') {
			itemNode = K('<br />');
		} else {
			itemNode = K('<span class="ke-inline-block ke-outline" title="' + (item.title || '') + '" unselectable="on">' +
				'<span class="ke-inline-block ke-toolbar-icon ke-toolbar-icon-url ke-icon-' + item.name + '" unselectable="on"></span></span>');
			_bindToolbarEvent(itemNode, item);
		}
		itemNode.data('item', item);
		self._itemNodes[item.name] = itemNode;
		self.div.append(itemNode);
		return self;
	},
	remove : function() {
		var self = this;
		_each(self._itemNodes, function(key, val) {
			val.remove();
		});
		KToolbar.parent.remove.call(self);
		return self;
	},
	select : function(name) {
		var self = this;
		if (self.disableMode && _inArray(name, self.noDisableItems) < 0) {
			return self;
		}
		var itemNode = self._itemNodes[name];
		if (itemNode) {
			itemNode.addClass('ke-selected').unbind('mouseover,mouseout');
		}
		return self;
	},
	unselect : function(name) {
		var self = this;
		if (self.disableMode && _inArray(name, self.noDisableItems) < 0) {
			return self;
		}
		var itemNode = self._itemNodes[name];
		if (itemNode) {
			itemNode.removeClass('ke-selected').removeClass('ke-on').mouseover(function(e) {
				K(this).addClass('ke-on');
			}).mouseout(function(e) {
				K(this).removeClass('ke-on');
			});
		}
		return self;
	},
	disable : function(bool) {
		var self = this, arr = self.noDisableItems, item;
		// disable toolbar
		if (bool === undefined ? !self.disableMode : bool) {
			_each(self._itemNodes, function(key, val) {
				item = val.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					val.removeClass('ke-selected').addClass('ke-disabled');
					val.opacity(0.5);
					if (item.name !== '|') {
						val.unbind();
					}
				}
			});
			self.disableMode = true;
		// enable toolbar
		} else {
			_each(self._itemNodes, function(key, val) {
				item = val.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					val.removeClass('ke-disabled');
					val.opacity(1);
					if (item.name !== '|') {
						_bindToolbarEvent(val, item);
					}
				}
			});
			self.disableMode = false;
		}
		return self;
	}
});

function _toolbar(options) {
	return new KToolbar(options);
}

K.toolbar = _toolbar;
