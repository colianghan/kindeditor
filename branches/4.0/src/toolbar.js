
function _bindToolbarEvent(itemNode, item) {
	itemNode.mouseover(function(e) {
		K(this).addClass('on');
	})
	.mouseout(function(e) {
		K(this).removeClass('on');
	})
	.click(function(e) {
		item.click.call(this, e);
	});
}

function _toolbar(options) {
	var self = _widget(options),
		remove = self.remove,
		disableMode = options.disableMode === undefined ? false : options.disableMode,
		noDisableItems = options.noDisableItems === undefined ? [] : options.noDisableItems,
		div = self.div(),
		itemNodes = {};
	// create toolbar
	div.addClass('ke-toolbar')
		.bind('contextmenu,mousedown,mousemove', function(e) {
			e.preventDefault();
		});
	self.get = function(key) {
		return itemNodes[key];
	};
	// add a item of toolbar
	self.addItem = function(item) {
		var itemNode;
		if (item.name == '|') {
			itemNode = K('<span class="ke-inline-block separator"></span>');
		} else if (item.name == '/') {
			itemNode = K('<br />');
		} else {
			itemNode = K('<span class="ke-inline-block outline" title="' + (item.title || '') + '" unselectable="on">' +
				'<span class="ke-inline-block icon icon-url ke-icon-' + item.name + '" unselectable="on"></span></span>');
			_bindToolbarEvent(itemNode, item);
		}
		itemNode.data('item', item);
		itemNodes[item.name] = itemNode;
		div.append(itemNode);
		return self;
	};
	// remove toolbar
	self.remove = function() {
		_each(itemNodes, function(key, val) {
			val.remove();
		});
		remove.call(self);
		return self;
	};
	// select item
	self.select = function(name) {
		if (disableMode && _inArray(name, noDisableItems) < 0) {
			return self;
		}
		var itemNode = itemNodes[name];
		if (itemNode) {
			itemNode.addClass('selected').unbind('mouseover,mouseout');
		}
		return self;
	};
	// unselect item
	self.unselect = function(name) {
		if (disableMode && _inArray(name, noDisableItems) < 0) {
			return self;
		}
		var itemNode = itemNodes[name];
		if (itemNode) {
			itemNode.removeClass('selected').removeClass('on')
			.mouseover(function(e) {
				K(this).addClass('on');
			})
			.mouseout(function(e) {
				K(this).removeClass('on');
			});
		}
		return self;
	};
	// toggle enable/disable
	self.disable = function(bool) {
		var arr = noDisableItems, item;
		// disable toolbar
		if (bool === undefined ? !disableMode : bool) {
			_each(itemNodes, function(key, val) {
				item = val.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					val.removeClass('selected').addClass('disabled');
					val.opacity(0.5);
					if (item.name !== '|') {
						val.unbind();
					}
				}
			});
			disableMode = true;
		// enable toolbar
		} else {
			_each(itemNodes, function(key, val) {
				item = val.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					val.removeClass('disabled');
					val.opacity(1);
					if (item.name !== '|') {
						_bindToolbarEvent(val, item);
					}
				}
			});
			disableMode = false;
		}
		return self;
	};
	return self;
}

K.toolbar = _toolbar;
