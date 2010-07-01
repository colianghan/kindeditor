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

var _K = K;

K = function(options) {
	//_node(document).ready(function() {
	//	var el = _K.create(options);
	//	_node(options.src).append(el);
	//});
};

_each(_K, function(key, val) {
	K[key] = val;
});

if (window.K === _undef) window.K = K;
window.KindEditor = K;
