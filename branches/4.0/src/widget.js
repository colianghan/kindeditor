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
		beforeDrag = options.beforeDrag,
		iframeFix = options.iframeFix === undefined ? true : options.iframeFix;
	var docs = [document],
		poss = [{ x : 0, y : 0}],
		listeners = [];
	if (iframeFix) {
		K('iframe').each(function() {
			//在IE上，页面设置document.domain后，取得没做过处理的iframe document会报错
			//此时先跳过，不做处理
			try {
				docs.push(_iframeDoc(this));
			} catch (e) {}
			poss.push(K(this).pos());
		});
	}
	clickEl.mousedown(function(e) {
		var self = clickEl.get(),
			x = _removeUnit(moveEl.css('left')),
			y = _removeUnit(moveEl.css('top')),
			width = moveEl.width(),
			height = moveEl.height(),
			pageX = e.pageX,
			pageY = e.pageY,
			dragging = true;
		if (beforeDrag) {
			beforeDrag();
		}
		_each(docs, function(i, doc) {
			function moveListener(e) {
				if (dragging) {
					var diffX = _round(poss[i].x + e.pageX - pageX),
						diffY = _round(poss[i].y + e.pageY - pageY);
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
				_each(listeners, function() {
					K(this.doc).unbind('mousemove', this.move)
						.unbind('mouseup', this.up)
						.unbind('selectstart', this.select);
				});
				e.stop();
			}
			K(doc).mousemove(moveListener)
				.mouseup(upListener)
				.bind('selectstart', selectListener);
			listeners.push({
				doc : doc,
				move : moveListener,
				up : upListener,
				select : selectListener
			});
		});
		if (self.setCapture) {
			self.setCapture();
		}
		e.stop();
	});
}

function _widget(options) {
	var name = options.name || '',
		x = _addUnit(options.x),
		y = _addUnit(options.y),
		z = options.z,
		width = _addUnit(options.width),
		height = _addUnit(options.height),
		cls = options.cls,
		css = options.css,
		html = options.html,
		doc = options.doc || document,
		parent = options.parent || doc.body,
		div = K('<div style="display:block;"></div>');
	//set widget position
	function resetPos(width, height) {
		if (z && (options.x === undefined || options.y === undefined)) {
			var w = _removeUnit(width) || 0,
				h = _removeUnit(height) || 0;
			if (options.alignEl) {
				var el = options.alignEl,
					pos = K(el).pos(),
					diffX = _round(el.clientWidth / 2 - w / 2),
					diffY = _round(el.clientHeight / 2 - h / 2);
				x = diffX < 0 ? pos.x : pos.x + diffX;
				y = diffY < 0 ? pos.y : pos.y + diffY;
			} else {
				var docEl = _docElement(doc),
					scrollPos = _getScrollPos();
				x = _round(scrollPos.x + (docEl.clientWidth - w) / 2);
				y = _round(scrollPos.y + (docEl.clientHeight - h) / 2);
			}
			x = x < 0 ? 0 : _addUnit(x);
			y = y < 0 ? 0 : _addUnit(y);
			div.css({
				left : x,
				top : y
			});
		}
	}
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
	resetPos(width, height);
	if (cls) {
		div.addClass(cls);
	}
	if (css) {
		div.css(css);
	}
	if (html) {
		div.html(html);
	}
	K(parent).append(div);
	return {
		name : name,
		doc : doc,
		div : function() {
			return div;
		},
		remove : function() {
			div.remove();
			return this;
		},
		show : function() {
			div.show();
			return this;
		},
		hide : function() {
			div.hide();
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
			return this;
		},
		resetPos : resetPos
	};
}

K.widget = _widget;
