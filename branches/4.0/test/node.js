module('node');

test('node', function() {
	same(K.node('#test-data-01').attr('src', 'aaa').attr('src'), 'aaa');
	ok(typeof K.node('#test-data-02').attr('src', 'aaa').delAttr('src').attr('src') === 'undefined');
});

