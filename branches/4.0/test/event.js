module('event');

test('bind/unbind/fire', function() {
	var result = '';
	function click1(e) {
		result += 'click1';
	}
	//bind
	K.bind(document, 'click', click1);
	result = '';
	K.fire(document, 'click');
	equals(result, 'click1');
	//unbind
	K.unbind(document, 'click', click1);
	result = '';
	K.fire(document, 'click');
	equals(result, '');
	function click2(e) {
		this.innerHTML = 'click2';
	}
	var div = document.getElementById('test-data-01');
	K.bind(div, 'click', click2);
	K.fire(div, 'click');
	equals(div.innerHTML, 'click2');
});

test('unbind(el, type, fn)', function() {
	var result = '';
	function click1(e) {
		result += 'click1';
	}
	function click2(e) {
		result += 'click2';
	}
	function mousedown1(e) {
		result += 'mousedown1';
	}
	K.bind(document, 'click', click1);
	K.bind(document, 'click', click2);
	K.bind(document, 'mousedown', mousedown1);
	result = '';
	K.fire(document, 'click');
	equals(result, 'click1click2');
	result = '';
	K.fire(document, 'mousedown');
	equals(result, 'mousedown1');
	K.unbind(document, 'click', click1);
	result = '';
	K.fire(document, 'click');
	equals(result, 'click2');
	K.unbind(document, 'click', click2);
	result = '';
	K.fire(document, 'click');
	equals(result, '');
	K.unbind(document, 'mousedown', mousedown1);
	result = '';
	K.fire(document, 'mousedown');
	equals(result, '');
});

test('unbind(el, type)', function() {
	var result = '';
	function click1(e) {
		result += 'click1';
	}
	function click2(e) {
		result += 'click2';
	}
	function mousedown1(e) {
		result += 'mousedown1';
	}
	K.bind(document, 'click', click1);
	K.bind(document, 'click', click2);
	K.bind(document, 'mousedown', mousedown1);
	//unbind click
	K.unbind(document, 'click');
	result = '';
	K.fire(document, 'click');
	equals(result, '');
	//unbind mousedown
	K.unbind(document, 'mousedown');
	result = '';
	K.fire(document, 'mousedown');
	equals(result, '');
});

test('unbind(el)', function() {
	var result = '';
	function click1(e) {
		result += 'click1';
		console.log('check');
	}
	function click2(e) {
		result += 'click2';
		console.log('check');
	}
	function mousedown1(e) {
		result += 'mousedown1';
		console.log('check');
	}
	K.bind(document, 'click', click1);
	K.bind(document, 'click', click2);
	K.bind(document, 'mousedown', mousedown1);
	//unbind
	K.unbind(document);
	result = '';
	K.fire(document, 'click');
	equals(result, '');
	result = '';
	K.fire(document, 'mousedown');
	equals(result, '');
});

(function () {
	var outerEvent = document.getElementById('outerEvent');
	var innerEvent = document.getElementById('innerEvent');
	var eventMethod = document.getElementById('eventMethod');
	var outerDiv = document.getElementById('outerDiv');
	var innerDiv = document.getElementById('innerDiv');
	K.bind(outerEvent, 'change', function(e) {
		K.unbind(outerDiv);
		if (outerEvent.value === 'none') return;
		K.bind(outerDiv, outerEvent.value, function(e) {
			console.log('outer: ' + outerEvent.value);
			if (eventMethod.value === 'none') return;
			e[eventMethod.value]();
		});
	});
	K.bind(innerEvent, 'change', function(e) {
		K.unbind(innerDiv);
		if (innerEvent.value === 'none') return;
		K.bind(innerDiv, innerEvent.value, function(e) {
			console.log('inner: ' + innerEvent.value);
			if (eventMethod.value === 'none') return;
			e[eventMethod.value]();
		});
	});
})();
