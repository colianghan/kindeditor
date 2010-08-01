/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name net.js
 * @fileOverview 加载远程文件、HTTP请求
 * @author Longhao Luo
 */

/**
#using "core.js"
*/

function _getScript(url, fn) {
	var head = document.getElementsByTagName('head')[0] || document.documentElement,
		script = document.createElement('script');
	head.appendChild(script);
	script.src = url;
	script.charset = 'utf-8';
	script.onload = script.onreadystatechange = function() {
		if (!this.readyState || this.readyState === 'loaded') {
			if (fn) {
				fn();
			}
			script.onload = script.onreadystatechange = null;
			head.removeChild(script);
		}
	};
}

K.getScript = _getScript;
