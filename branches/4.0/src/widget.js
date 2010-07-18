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

function _bindDragEvent(options) {
	var moveEl = options.moveEl,
		moveFn = options.moveFn,
		clickEl = options.clickEl || moveEl,
		iframeFix = options.iframeFix === undefined ? true : options.iframeFix;
	var docs = [];
	if (iframeFix) {
		_each(_queryAll('iframe'), function() {
			docs.push(_getIframeDoc(this));
		});
	}
	clickEl.mousedown(function(e) {
		var self = clickEl.get(),
			x = parseInt(moveEl.css('left')),
			y = _removeUnit(moveEl.css('top')),
			width = moveEl.width(),
			height = moveEl.height(),
			pageX = e.pageX,
			pageY = e.pageY,
			dragging = true;
		function moveListener(e) {
			console.log('move');
			if (dragging) {
				var diffX = Math.round(e.pageX - pageX),
					diffY = Math.round(e.pageY - pageY);
				moveFn.call(clickEl, x, y, width, height, diffX, diffY);
			}
			e.stop();
		}
		function selectListener(e) {
			e.stop();
		}
		function upListener(e) {
			dragging = false;
			if (self.releaseCapture) {
				self.releaseCapture();
			}
			_node(document).unbind('mousemove', moveListener)
				.unbind('mouseup', upListener)
				.unbind('selectstart', selectListener);
			_each(docs, function() {
				_node(this).unbind('mousemove', moveListener)
					.unbind('mouseup', upListener);
			});
			e.stop();
		}
		_node(document).mousemove(moveListener)
			.mouseup(upListener)
			.bind('selectstart', selectListener);
		_each(docs, function() {
			_node(this).mousemove(moveListener).mouseup(upListener);
		});
		if (self.setCapture) {
			self.setCapture();
		}
		e.stop();
	});
}

function _widget(options) {
	var name = options.name || '',
		x = _addUnit(options.x) || 0,
		y = _addUnit(options.y) || 0,
		z = options.z || 0,
		width = _addUnit(options.width) || 0,
		height = _addUnit(options.height) || 0,
		css = options.css,
		html = options.html,
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
	if (css) {
		div.css(css);
	}
	if (html) {
		div.html(html);
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
		},
		draggable : function(options) {
			options = options || {};
			options.moveEl = div;
			options.moveFn = function(x, y, width, height, diffX, diffY) {
				if ((x = x + diffX) < 0) {
					x = 0;
				}
				if ((y = y + diffY) < 0) {
					y = 0;
				}
				div.css('left', _addUnit(x)).css('top', _addUnit(y));
			};
			_bindDragEvent(options);
		}
	};
}

K.widget = _widget;
