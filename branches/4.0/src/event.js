/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name event.js
 * @fileOverview 添加事件、移除事件、触发事件
 * @author Longhao Luo
 */

/**
#using "core.js"
*/

//add native event
function _bindEvent(el, type, fn) {
	if (el.addEventListener){
		el.addEventListener(type, fn, false);
	} else if (el.attachEvent){
		el.attachEvent('on' + type, fn);
	}
}
//remove native event
function _unbindEvent(el, type, fn) {
	if (el.removeEventListener){
		el.removeEventListener(type, fn, false);
	} else if (el.detachEvent){
		el.detachEvent('on' + type, fn);
	}
}

var _EVENT_PROPS = 'altKey,attrChange,attrName,bubbles,button,cancelable,charCode,clientX,clientY,ctrlKey,currentTarget,data,detail,eventPhase,fromElement,handler,keyCode,layerX,layerY,metaKey,newValue,offsetX,offsetY,originalTarget,pageX,pageY,prevValue,relatedNode,relatedTarget,screenX,screenY,shiftKey,srcElement,target,toElement,view,wheelDelta,which'.split(',');

//Inspired by jQuery
//http://github.com/jquery/jquery/blob/master/src/event.js
function _event(el, event) {
	if (!event) {
		return;
	}
	var e = {},
		doc = el.ownerDocument || el.document || el;
	_each(_EVENT_PROPS, function(key, val) {
		e[val] = event[val];
	});
	if (!e.target) {
		e.target = e.srcElement || doc;
	}
	if (e.target.nodeType === 3) {
		e.target = e.target.parentNode;
	}
	if (!e.relatedTarget && e.fromElement) {
		e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
	}
	if (e.pageX == null && e.clientX != null) {
		var d = doc.documentElement, body = doc.body;
		e.pageX = e.clientX + (d && d.scrollLeft || body && body.scrollLeft || 0) - (d && d.clientLeft || body && body.clientLeft || 0);
		e.pageY = e.clientY + (d && d.scrollTop  || body && body.scrollTop  || 0) - (d && d.clientTop  || body && body.clientTop  || 0);
	}
	if (!e.which && ((e.charCode || e.charCode === 0) ? e.charCode : e.keyCode)) {
		e.which = e.charCode || e.keyCode;
	}
	if (!e.metaKey && e.ctrlKey) {
		e.metaKey = e.ctrlKey;
	}
	if (!e.which && e.button !== undefined) {
		e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
	}
	/**
		DOM_VK_SEMICOLON : 59 (;:)
			- IE,WEBKIT: 186
			- GECKO,OPERA : 59
		DOM_VK_EQUALS : 61 (=+)
			- IE,WEBKIT : 187
			- GECKO : 107
			- OPERA : 61
		DOM_VK_NUMPAD0 ~ DOM_VK_NUMPAD9 : 96 ~ 105
			- IE、WEBKIT,GECKO : 96 ~ 105
			- OPERA : 48 ~ 57
		DOM_VK_MULTIPLY : 106 (*)
			- IE、WEBKIT,GECKO : 106
			- OPERA : 42
		DOM_VK_ADD : 107 (+)
			- IE、WEBKIT,GECKO : 107
			- OPERA : 43
		DOM_VK_SUBTRACT : 109 (-_) (-)
			- IE,WEBKIT : 189, 109
			- GECKO : 109, 109
			- OPERA : 109, 45
		DOM_VK_DECIMAL : 110 (.)
			- IE、WEBKIT,GECKO : 110
			- OPERA : 78
		DOM_VK_DIVIDE : 111 (/)
			- IE、WEBKIT,GECKO : 111
			- OPERA : 47

		Reference:
		https://developer.mozilla.org/en/DOM/Event/UIEvent/KeyEvent
		http://msdn.microsoft.com/en-us/library/ms536940(v=VS.85).aspx
	*/
	switch (e.which) {
	case 186 :
		e.which = 59;
		break;
	case 187 :
	case 107 :
	case 43 :
		e.which = 61;
		break;
	case 189 :
	case 45 :
		e.which = 109;
		break;
	case 42 :
		e.which = 106;
		break;
	case 47 :
		e.which = 111;
		break;
	case 78 :
		e.which = 110;
		break;
	}
	if (e.which >= 96 && e.which <= 105) {
		e.which -= 48;
	}
	e.preventDefault = function() {
		if (event.preventDefault) {
			event.preventDefault();
		}
		event.returnValue = false;
	};
	e.stopPropagation = function() {
		if (event.stopPropagation) {
			event.stopPropagation();
		}
		event.cancelBubble = true;
	};
	e.stop = function() {
		this.preventDefault();
		this.stopPropagation();
	};
	return e;
}

var _elList = [], _data = {};

function _getId(el) {
	var id = _inArray(el, _elList);
	if (id < 0) {
		_each(_elList, function(i, val) {
			if (!val) {
				id = i;
				_elList[id] = el;
				return false;
			}
		});
		if (id < 0) {
			id = _elList.length;
			_elList.push(el);
		}
	}
	if (!(id in _data)) {
		_data[id] = {};
	}
	return id;
}

function _bind(el, type, fn) {
	if (type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_bind(el, this, fn);
		});
		return;
	}
	var id = _getId(el);
	if (id in _data && _data[id][type] !== undefined && _data[id][type].length > 0) {
		_each(_data[id][type], function(key, val) {
			if (val === undefined) {
				_data[id][type].splice(key, 1);
			}
		});
		_unbindEvent(el, type, _data[id][type][0]);
	} else {
		_data[id][type] = [];
	}
	if (_data[id][type].length === 0) {
		_data[id][type][0] = function(e) {
			_each(_data[id][type], function(key, val) {
				if (key > 0 && val) {
					val.call(el, _event(el, e));
				}
			});
		};
	}
	if (_inArray(fn, _data[id][type]) < 0) {
		_data[id][type].push(fn);
	}
	_bindEvent(el, type, _data[id][type][0]);
}

function _unbind(el, type, fn) {
	if (type && type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_unbind(el, this, fn);
		});
		return;
	}
	var id = _getId(el);
	if (type === undefined) {
		if (id in _data) {
			_each(_data[id], function(key, val) {
				if (val.length > 0) {
					_unbindEvent(el, key, val[0]);
				}
			});
			delete _data[id];
			delete _elList[id];
		}
		return;
	}
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		if (fn === undefined) {
			_unbindEvent(el, type, _data[id][type][0]);
			delete _data[id][type];
		} else {
			for (var i = 1, len = _data[id][type].length; i < len; i++) {
				if (_data[id][type][i] === fn) {
					delete _data[id][type][i];
				}
			}
			if (_data[id][type].length == 2 && _data[id][type][1] === undefined) {
				_unbindEvent(el, type, _data[id][type][0]);
				delete _data[id][type];
			}
			var typeCount = 0;
			_each(_data[id], function() {
				typeCount++;
			});
			if (typeCount < 1) {
				delete _data[id];
				delete _elList[id];
			}
		}
	}
}

function _fire(el, type) {
	if (type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_fire(el, this);
		});
		return;
	}
	var id = _getId(el);
	if (id in _data && _data[id][type] !== undefined && _data[id][type].length > 0) {
		_data[id][type][0]();
	}
}

function _ctrl(el, key, fn) {
	var self = this;
	key = /^\d{2,}$/.test(key) ? key : key.toUpperCase().charCodeAt(0);
	_bind(el, 'keydown', function(e) {
		if (e.ctrlKey && e.which == key && !e.shiftKey && !e.altKey) {
			fn.call(el);
			e.stop();
		}
	});
}

function _ready(fn, doc) {
	doc = doc || document;
	var win = doc.parentWindow || doc.defaultView, loaded = false;
	function readyFunc() {
		if (!loaded) {
			loaded = true;
			fn(KindEditor);
		}
		_unbind(doc, 'DOMContentLoaded');
		_unbind(doc, 'readystatechange');
		_unbind(win, 'load');
	}
	function ieReadyFunc() {
		if (!loaded) {
			try {
				doc.documentElement.doScroll('left');
			} catch(e) {
				win.setTimeout(ieReadyFunc, 0);
				return;
			}
			readyFunc();
		}
	}
	if (doc.addEventListener) {
		_bind(doc, 'DOMContentLoaded', readyFunc);
	} else if (doc.attachEvent) {
		_bind(doc, 'readystatechange', function() {
			if (doc.readyState === 'complete') {
				readyFunc();
			}
		});
		if (doc.documentElement.doScroll && win.frameElement === undefined) {
			ieReadyFunc();
		}
	}
	_bind(win, 'load', readyFunc);
}

/**
	Note:
	发现绑定dbclick事件后移除element会有内存泄漏，以下代码也不起作用。
	Reference:
	http://isaacschlueter.com/2006/10/msie-memory-leaks/
	http://msdn.microsoft.com/en-us/library/bb250448.aspx
*/
if (_IE) {
	window.attachEvent('onunload', function() {
		var id, target;
		_each(_elList, function(i, el) {
			if (el) {
				_unbind(el);
			}
		});
	});
}

K.ctrl = _ctrl;
K.ready = _ready;
