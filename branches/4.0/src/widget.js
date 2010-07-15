/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name widget.js
 * @fileOverview 工具栏类
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "node.js"
*/

function _widget(options) {
	return {
		name : options.name || '',
		x : options.x || 0,
		y : options.y || 0,
		z : options.z || 0,
		width : _addUnit(options.width) || 0,
		height : _addUnit(options.height) || 0,
		doc : options.doc || document,
		create : function(expr) {
			var self = this;
			if (self.div) {
				return self;
			}
			var div = _node('<div></div>').css('display', 'block');
			if (self.width) {
				div.css('width', self.width);
			}
			if (self.height) {
				div.css('height', self.height);
			}
			if (self.z) {
				div.css({
					position : 'absolute',
					left : self.x + 'px',
					top : self.y + 'px',
					'z-index' : self.z
				});
			}
			if (expr === undefined) {
				self.doc.body.appendChild(div.get());
			} else {
				_node(expr, self.doc).append(div);
			}
			self.div = div;
			return self;
		},
		remove : function() {
			var self = this;
			if (!self.div) {
				return self;
			}
			self.div.remove();
			self.div = null;
			return self;
		}
	};
}

K.widget = _widget;
