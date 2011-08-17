
function _loadScript(url, fn) {
	var head = document.getElementsByTagName('head')[0] || (_QUIRKS ? document.body : document.documentElement),
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

function _ajax(url, fn, method, data) {
	method = method || 'GET'; //POST or GET
	var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	xhr.open(method, url, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			if (fn) {
				data = _json(_trim(xhr.responseText));
				fn(data);
			}
		}
	};
	if (method == 'POST') {
		var params = [];
		_each(data, function(key, val) {
			params.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
		});
		try {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		} catch (e) {}
		xhr.send(params.join('&'));
	} else {
		xhr.send(null);
	}
}

K.loadScript = _loadScript;
K.ajax = _ajax;
