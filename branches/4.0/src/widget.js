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
	var name = options.name || '',
		x = _addUnit(options.x) || 0,
		y = _addUnit(options.y) || 0,
		z = options.z || 0,
		width = _addUnit(options.width) || 0,
		height = _addUnit(options.height) || 0,
		doc = options.doc || document,
		parent = options.parent || doc.body,
		div = _node('<div></div>').css('display', 'block');
	if (width) {
		div.css('width', width);
	}
	if (height) {
		div.css('height', height);
	}
	if (z) {
		div.css({
			position : 'absolute',
			left : x,
			top : y,
			'z-index' : z
		});
	}
	_node(parent, doc).append(div);
	return {
		name : name,
		x : x,
		y : y,
		z : z,
		width : width,
		height : height,
		doc : doc,
		div : function() {
			return div;
		},
		remove : function() {
			div.remove();
			return this;
		}
	};
}

K.widget = _widget;
