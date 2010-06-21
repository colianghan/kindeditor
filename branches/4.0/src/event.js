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
*/
(function (K, undefined) {

var _each = K.each,
	_inArray = K.inArray;

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

var _createdNodeList = [],
	/**
		_eventMap:
		{
			id1 : {
				type1 : [fn, fn1, fn2],
				type2 : [fn, fn1, fn2]
			},
			id2 : {
				type1 : [fn, fn1, fn2],
				type2 : [fn, fn1, fn2]
			}
		}
	*/
	_eventListMap = {};

function _createId(el) {
	var id = _inArray(el, _createdNodeList);
	if (id < 0) {
		id = _createdNodeList.length;
		_createdNodeList.push(el);
		_eventListMap[id] = {};
	}
	return id;
}

function _event() {
	return {
	
	};
}

function _bind(el, type, fn) {
	var id = _createId(el);
	if (_eventListMap[id][type] !== undefined) {
		_unbindEvent(el, type, _eventListMap[id][type][0]);
	} else {
		_eventListMap[id][type] = [];
	}
	if (_inArray(fn, _eventListMap[id][type]) < 0) {
		_eventListMap[id][type][0] = function(e) {
			_each(_eventListMap[id][type], function(key, val) {
				if (key > 0 && val) val(e);
			});
		};
		_eventListMap[id][type].push(fn);
	}
	_bindEvent(el, type, _eventListMap[id][type][0]);
}

function _unbind(el, type, fn) {
	var id = _createId(el);
	if (type === undefined) {
		if (id in _eventListMap) {
			_each(_eventListMap[id], function(key, val) {
				_unbindEvent(el, key, val[0]);
			});
			_eventListMap[id] = {};
		}
		return;
	}
	if (_eventListMap[id][type] !== undefined && _eventListMap[id][type].length > 0) {
		_unbindEvent(el, type, _eventListMap[id][type][0]);
		if (fn === undefined) {
			_eventListMap[id][type] = [];
		} else {
			for (var i = 1, len = _eventListMap[id][type].length; i < len; i++) {
				if (_eventListMap[id][type][i] === fn) delete _eventListMap[id][type][i];
			}
			_eventListMap[id][type][0] = function(e) {
				_each(_eventListMap[id][type], function(key, val) {
					if (key > 0 && val) val(e);
				});
			};
			_bindEvent(el, type, _eventListMap[id][type][0]);
		}
	}
}

K._bind = _bind;
K._unbind = _unbind;

})(KindEditor);