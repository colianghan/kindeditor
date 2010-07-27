/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name tabs.js
 * @fileOverview 标签类
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "node.js"
*/

function _tabs(options) {
	var self = _widget(options),
		remove = self.remove,
		div = self.div(),
		liList = [];
	//create toolbar
	div.addClass('ke-tabs')
		.bind('contextmenu,mousedown,mousemove', function(e) {
			e.preventDefault();
		});
	var ul = K('<ul class="ke-tabs-ul ke-clearfix"></ul>');
	div.append(ul);
	//add tab
	/**
		tab.add({
			title : 'TAB1',
			panel : '#tab1'
		});
	*/
	self.add = function(item) {
		var li = K('<li class="ke-tabs-li">' + item.title + '</li>');
		li.data('item', item);
		liList.push(li);
		ul.append(li);
	};
	self.select = function(index) {
		_each(liList, function(i, li) {
			if (i === index) {
				li.addClass('ke-tabs-li-selected').unbind();
				K(li.data('item').panel).show('');
			} else {
				li.removeClass('ke-tabs-li-selected')
				.mouseover(function() {
					K(this).addClass('ke-tabs-li-on');
				})
				.mouseout(function() {
					K(this).removeClass('ke-tabs-li-on');
				})
				.click(function() {
					self.select(i);
				});
				K(li.data('item').panel).hide();
			}
		});
	};
	//remove toolbar
	self.remove = function() {
		_each(liList, function() {
			this.remove();
		});
		ul.remove();
		remove.call(self);
	};
	return self;
}

K.tabs = _tabs;
