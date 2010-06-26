/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name edit.js
 * @fileOverview iframe编辑区域
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "node.js"
#using "main.js"
*/
(function (K, undefined) {

var _each = K.each,
	_node = K.node,
	_cmd = K.cmd;

function _getIframeDoc(iframe) {
	return iframe.contentDocument || iframe.contentWindow.document;
}

function _getInitHtml(bodyClass, cssPaths) {
	//字符串连加效率低，改用[]
	var html = ['<!doctype html><html><head><meta http-equiv="Content-Type" content="text/html; 		charset=utf-8"/><title>KindEditor</title>'];
	if (cssPaths) {
		_each(cssPaths, function(i, path) {
			if (path !== '') html[i+1] = '<link href="' + path + '" rel="stylesheet" />';
		});
	}
	html.push('</head><body ' + (bodyClass?'class="' + bodyClass + '"':'') + '></body></html>');
	return html.join('');	
}

function _edit(expr, options) {
	var srcElement = _node(expr),
		iframe = null,
		bodyClass = options.bodyClass,
		cssPaths = options.cssPaths;
	var obj = {
		cmd : null,
		doc : null,
		width : options.width || 0,
		height : options.height || 0,
		val : function(val) {
			var self = this,
				body = self.doc.body;
			if (val === undefined) {
				return _node(body).html();
			} else {
				_node(body).html(val);
				return self;
			}
		},
		create : function() {
			var self = this;
			if (iframe !== null) return self;
			//create elements
			iframe = _node('<iframe class="ke-iframe" frameborder="0"></iframe>');
			iframe.css({
				display : 'block',
				width : self.width,
				height : self.height
			});
			srcElement.before(iframe);
			srcElement.hide();
			var doc = _getIframeDoc(iframe.get());
			doc.designMode = 'on';
			doc.open();
			doc.write(_getInitHtml());
			doc.close();
			self.doc = doc;
			self.val(srcElement.val());
			self.cmd = _cmd(doc);
			//add events
			function selectionHandler(e) {
				var cmd = _cmd(doc);
				if (cmd) self.cmd = cmd;
			}
			self.oninput(selectionHandler);
			_node(doc).bind('mouseup', selectionHandler);
			_node(document).bind('mousedown', selectionHandler);
			return self;
		},
		remove : function() {
			var self = this,
				doc = self.doc;
			if (iframe === null) return self;
			//remove events
			_node(doc).unbind();
			_node(doc.body).unbind();
			_node(document).unbind();
			//remove elements
			srcElement.show();
			srcElement.val(self.val());
			doc.src = 'javascript:false';
			iframe.remove();
			iframe = null;
			return self;
		},
		show : function() {
			iframe && iframe.show();                             
			return this;
		},
		hide : function() {
			iframe && iframe.hide();
			return this;
		},
		focus : function() {
			iframe && iframe.contentWindow.focus();
			return this;
		},
		oninput : function(fn) {
			var self = this,
				doc = self.doc,
				body = doc.body;
			_node(doc).bind('keyup', function(e) {
				if (!e.ctrlKey && !e.altKey && (e.keyCode < 16 || e.keyCode > 18) && e.keyCode != 116) {
					fn(e);
					e.stop();
				}
			});
			function timeoutHandler(e) {
				setTimeout(function() {
					fn(e);
				}, 1);
			}
			_node(body).bind('paste', timeoutHandler);
			_node(body).bind('cut', timeoutHandler);
			return self;
		}
	};
	return obj;
}

K.edit = _edit;

})(KindEditor);