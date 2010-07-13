/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name main.js
 * @fileOverview 组装、初始化编辑器
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "node.js"
#using "main.js"
*/

var _scriptPath = (function() {
	var els = document.getElementsByTagName('script'), src;
	for (var i = 0, len = els.length; i < len; i++) {
		src = els[i].src || '';
		if (src.match(/kindeditor[\w\-\.]*\.js/)) {
			return src.substring(0, src.lastIndexOf('/') + 1);
		}
	}
	return '';
})();

var _options = {
	designMode : true,
	fullscreenMode : false,
	filterMode : false,
	shadowMode : true,
	scriptPath : _scriptPath,
	urlType : '', //"",relative,absolute,domain
	newlineType : 'p', //p,br
	resizeType : 2, //0,1,2
	dialogAlignType : 'page', //page,editor
	bodyClass : 'ke-content',
	cssData : '', //cssPath, cssContent
	minWidth : 200,
	minHeight : 100,
	minChangeSize : 5,
	items : [
		'source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		'superscript', '|', 'selectall', '/',
		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
		'flash', 'media', 'advtable', 'hr', 'emoticons', 'link', 'unlink', '|', 'about'
	],
	colors : [
		['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
		['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
		['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
		['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
	],
	htmlTags : {
		font : ['color', 'size', 'face', '.background-color'],
		span : [
			'.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align'
		],
		div : [
			'align', '.border', '.margin', '.padding', '.text-align', '.color',
			'.background-color', '.font-size', '.font-family', '.font-weight', '.background',
			'.font-style', '.text-decoration', '.vertical-align', '.margin-left'
		],
		table: [
			'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
			'.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
			'.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
			'.width', '.height'
		],
		'td,th': [
			'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
			'.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
			'.font-style', '.text-decoration', '.vertical-align', '.background'
		],
		a : ['href', 'target', 'name'],
		embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', '/'],
		img : ['src', 'width', 'height', 'border', 'alt', 'title', '.width', '.height', '/'],
		hr : ['/'],
		br : ['/'],
		'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
			'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
		],
		'tbody,tr,strong,b,sub,sup,em,i,u,strike' : []
	}
};

var _editorList = [];

function _create(id, options) {
	if (options === undefined) {
		options = {};
	}
	_each(_options, function(key, val) {
		options[key] = (options[key] === undefined) ? val : options[key];
	});
	var srcElement = _node(options.srcElement) || _node('#' + id) || _node('[name=' + id + ']'),
		width = options.width || srcElement.css('width') || (srcElement.offsetWidth || options.minWidth) + 'px',
		height = options.height || srcElement.css('height') || (srcElement.offsetHeight || options.minHeight) + 'px',
		containerDiv = _node('<div></div>').css({
			width : width
		}),
		toolbarDiv = _node('<div></div>'),
		editDiv = _node('<div></div>'),
		statusbarDiv = _node('<div></div>');
	containerDiv.append(toolbarDiv).append(editDiv).append(statusbarDiv);
	if (options.fullscreenMode) {
		_node(document.body).append(containerDiv);
	} else {
		srcElement.before(containerDiv);
	}
	var toolbar = _toolbar({
			width : '100%'
		}),
		edit = _edit({
			srcElement : srcElement,
			width : '100%',
			height : height,
			designMode : options.designMode,
			bodyClass : options.bodyClass,
			cssData : options.cssData
		}).create(editDiv);
	_each(options.items, function(i, name) {
		toolbar.addItem({
			name : name,
			click : function() {
				edit.cmd[name]();
			}
		});
	});
	toolbar.create(toolbarDiv);
	_editorList.push({
		options : options,
		toolbar : toolbar,
		edit : edit
	});
}

function _plugin(name, fn) {

}

//解决IE6浏览器重复下载背景图片的问题
if (_IE && _VERSION < 7) {
	try {
		document.execCommand('BackgroundImageCache', false, true);
	} catch (e) {}
}

K.create = _create;
K.plugin = _plugin;

var _K = K;
K = function(id, options) {
	_node(document).ready(function() {
		_create(id, options);
	});
};
_each(_K, function(key, val) {
	K[key] = val;
});
if (window.K === undefined) {
	window.K = K;
}
window.KindEditor = K;
