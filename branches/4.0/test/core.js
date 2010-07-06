module('core');

test('VERSION', function() {
	ok(/^\d+$/.test(K.VERSION));
});

test('each', function() {
	var arr = ['a', 'b'];
	var obj = {a : 'aa', b : 'bb', c : 0, d : null};
	var i = 0;
	K.each(arr, function(key, val) {
		if (key === 0) ok(val === 'a');
		if (key === 1) ok(val === 'b');
		i++;
	});
	ok(i === 2);
	i = 0;
	K.each(arr, function(idx) {
		if (idx === 0) ok(this == 'a');
		if (idx === 1) ok(this == 'b');
		i++;
	});
	ok(i === 2);
	i = 0;
	K.each(obj, function(key, val) {
		if (key === 'a') ok(val === 'aa');
		if (key === 'b') ok(val === 'bb');
		if (key === 'c') ok(val === 0);
		if (key === 'd') ok(val === null);
		i++;
	});
	ok(i === 4);
	i = 0;
	K.each(obj, function(key) {
		if (key === 'a') ok(this == 'aa');
		if (key === 'b') ok(this == 'bb');
		if (key === 'c') ok(this == 0);
		i++;
	});
	ok(i === 4);
	i = 0;
	K.each(arr, function(key, val) {
		i++;
		return false;
	});
	ok(i === 1);
	i = 0;
	K.each(obj, function(key, val) {
		i++;
		return true;
	});
	ok(i === 4);
});

test('isArray', function() {
	ok(K.isArray([]) === true);
	ok(K.isArray(['a', 'b']) === true);
	ok(K.isArray({a : 'a'}) === false);
	ok(K.isArray(null) === false);
	ok(K.isArray(1) === false);
	ok(K.isArray('a') === false);
	ok(K.isArray(0) === false);
	ok(K.isArray('') === false);
});

test('inArray', function() {
	arr = [null, 0, '', 10, '11', true];
	ok(K.inArray(null, arr) === 0);
	ok(K.inArray(0, arr) === 1);
	ok(K.inArray('', arr) === 2);
	ok(K.inArray(10, arr) === 3);
	ok(K.inArray(11, arr) === -1);
	ok(K.inArray('11', arr) === 4);
	ok(K.inArray(true, arr) === 5);
	ok(K.inArray(false, arr) === -1);
});

test('trim', function() {
	equals(K.trim(' a '), 'a');
	equals(K.trim(' a a '), 'a a');
	equals(K.trim(' &nbsp; '), '&nbsp;');
});

test('toHex', function() {
	equals(K.toHex('rgb(0, 0, 0)'), '#000000');
	equals(K.toHex('rgb(0, 0, 0)'), '#000000');
	equals(K.toHex(' rgb(0, 0, 0) rgb (255, 255, 255) '), ' #000000 #FFFFFF ');
});

test('toMap', function() {
	same(K.toMap('a,b'), {a : true, b : true});
	same(K.toMap('a,1..3,b'), {a : true, '1' : true, '2' : true, '3' : true, b : true});
});

