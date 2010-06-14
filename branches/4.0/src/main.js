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
	_K = K;

var K = function(config) {
	//_node(document).ready(function() {
	//	var el = _K.create(config);
	//	_node(config.src).append(el);
	//});
};

_each(_K, function(key, val) {
	K[key] = val;
});

if (window.K === undefined) window.K = K;
window.KindEditor = K;

})(KindEditor);