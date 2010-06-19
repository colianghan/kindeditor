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
	_range = K.range;

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
	return {
		width : options.width || 0,
		height : options.height || 0,
		val : function(val) {
			if (val === undefined) {
				return _node(this.doc.body).html();
			} else {
				_node(this.doc.body).html(val);
				return this;
			}
		},
		create : function() {
			if (iframe !== null) return this;
			iframe = _node('<iframe class="ke-iframe" frameborder="0"></iframe>');
			iframe.css({
				display : 'block',
				width : this.width,
				height : this.height
			});
			srcElement.before(iframe);
			srcElement.hide();
			var doc = _getIframeDoc(iframe.get());
			doc.designMode = 'on';
			doc.open();
			doc.write(_getInitHtml());
			doc.close();
			this.doc = doc;
			this.val(srcElement.val());
			return this;
		},
		remove : function() {
			if (iframe === null) return this;
			srcElement.show();
			srcElement.val(this.val());
			this.doc.src = 'javascript:false';
			iframe.remove();
			iframe = null;
			return this;
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
		}
	};
}

K.edit = _edit;

})(KindEditor);