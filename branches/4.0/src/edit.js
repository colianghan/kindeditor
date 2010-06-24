/**
* KindEditor - WYSIWYG HTML Editor
* Copyright (C) 2006-${THISYEAR} Longhao Luo
*
* @site http://www.kindsoft.net/
* @licence LGPL
* @version ${VERSION}
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

function _getInitHtml(cssPaths) {
	var html = '<!doctype html><html>';
	html += '<head>';
	html += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
	html += '<title>KindEditor</title>';
	if (cssPaths) {
		_each(cssPaths, function(i, path) {
			if (path !== '') html += '<link href="' + path + '" rel="stylesheet" />';
		});
	}
	html += '</head>';
	html += '<body class="ke-content"></body>';
	html += '</html>';
	return html;
}

function _edit(expr, options) {
	var srcElement = _node(expr),
		iframe = null;
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
			if (iframe === null) return this;
			iframe.show();
			return this;
		},
		hide : function() {
			if (iframe === null) return this;
			iframe.hide();
			return this;
		},
		focus : function() {
			if (iframe === null) return this;
			iframe.contentWindow.focus();
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
				window.setTimeout(function() {
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