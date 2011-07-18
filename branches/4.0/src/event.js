
var _useCapture = false;

// add native event
function _bindEvent(el, type, fn) {
	if (el.addEventListener){
		el.addEventListener(type, fn, _useCapture);
	} else if (el.attachEvent){
		el.attachEvent('on' + type, fn);
	}
}
// remove native event
function _unbindEvent(el, type, fn) {
	if (el.removeEventListener){
		el.removeEventListener(type, fn, _useCapture);
	} else if (el.detachEvent){
		el.detachEvent('on' + type, fn);
	}
}

var _EVENT_PROPS = 'altKey,attrChange,attrName,bubbles,button,cancelable,charCode,clientX,clientY,ctrlKey,currentTarget,data,detail,eventPhase,fromElement,handler,keyCode,layerX,layerY,metaKey,newValue,offsetX,offsetY,originalTarget,pageX,pageY,prevValue,relatedNode,relatedTarget,screenX,screenY,shiftKey,srcElement,target,toElement,view,wheelDelta,which'.split(',');

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

var _eventExpendo = 'kindeditor_' + (new Date().getTime()), _eventId = 0, _eventData = {};

function _getId(el) {
	return el[_eventExpendo] || null;
}

function _setId(el) {
	el[_eventExpendo] = ++_eventId;
	return _eventId;
}

function _removeId(el) {
	try {
		delete el[_eventExpendo];
	} catch(e) {}
}

function _bind(el, type, fn) {
	if (type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_bind(el, this, fn);
		});
		return;
	}
	var id = _getId(el);
	if (!id) {
		id = _setId(el);
	}
	if (_eventData[id] === undefined) {
		_eventData[id] = {};
	}
	var events = _eventData[id][type];
	if (events && events.length > 0) {
		_unbindEvent(el, type, events[0]);
	} else {
		_eventData[id][type] = [];
		_eventData[id].el = el;
	}
	events = _eventData[id][type];
	if (events.length === 0) {
		events[0] = function(e) {
			_each(events, function(i, event) {
				if (i > 0 && event) {
					event.call(el, _event(el, e));
				}
			});
		};
	}
	if (_inArray(fn, events) < 0) {
		events.push(fn);
	}
	_bindEvent(el, type, events[0]);
}

function _unbind(el, type, fn) {
	if (type && type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_unbind(el, this, fn);
		});
		return;
	}
	var id = _getId(el);
	if (!id) {
		return;
	}
	if (type === undefined) {
		if (id in _eventData) {
			_each(_eventData[id], function(key, events) {
				if (key != 'el' && events.length > 0) {
					_unbindEvent(el, key, events[0]);
				}
			});
			delete _eventData[id];
			_removeId(el);
		}
		return;
	}
	if (!_eventData[id]) {
		return;
	}
	var events = _eventData[id][type];
	if (events && events.length > 0) {
		if (fn === undefined) {
			_unbindEvent(el, type, events[0]);
			delete _eventData[id][type];
		} else {
			_each(events, function(i, event) {
				if (i > 0 && event === fn) {
					events.splice(i, 1);
				}
			});
			if (events.length == 1) {
				_unbindEvent(el, type, events[0]);
				delete _eventData[id][type];
			}
		}
		var count = 0;
		_each(_eventData[id], function() {
			count++;
		});
		if (count < 2) {
			delete _eventData[id];
			_removeId(el);
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
	if (!id) {
		return;
	}
	var events = _eventData[id][type];
	if (_eventData[id] && events && events.length > 0) {
		events[0]();
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

function _ready(fn) {
	var loaded = false;
	function readyFunc() {
		if (!loaded) {
			loaded = true;
			fn(KindEditor);
			if (document.addEventListener) {
				_unbind(document, 'DOMContentLoaded', readyFunc);
			} else if (document.attachEvent) {
				_unbind(document, 'readystatechange', ieReadyStateFunc);
			}
			_unbind(window, 'load', readyFunc);
		}
	}
	function ieReadyFunc() {
		if (!loaded) {
			try {
				document.documentElement.doScroll('left');
			} catch(e) {
				setTimeout(ieReadyFunc, 0);
				return;
			}
			readyFunc();
		}
	}
	function ieReadyStateFunc() {
		if (document.readyState === 'complete') {
			readyFunc();
		}
	}
	if (document.addEventListener) {
		_bind(document, 'DOMContentLoaded', readyFunc);
	} else if (document.attachEvent) {
		_bind(document, 'readystatechange', ieReadyStateFunc);
		if (document.documentElement.doScroll && window.frameElement === undefined) {
			ieReadyFunc();
		}
	}
	_bind(window, 'load', readyFunc);
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
		_each(_eventData, function(key, events) {
			if (events.el) {
				_unbind(events.el);
			}
		});
	});
}

K.ctrl = _ctrl;
K.ready = _ready;
