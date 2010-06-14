module('node');

test('node.attr', function() {
	same(K.node('#test-data-01').attr('src', 'aaa').attr('src'), 'aaa');
	ok(K.node('#test-data-02').attr('src', 'aaa').delAttr('src').attr('src') === null);
	same(K.node('#test-data-01').attr('id'), 'test-data-01');
	same(K.node('#test-data-01').attr('class'), 'test-class');
	same(K.node('#test-data-01 p img').attr('src'), './data/logo_180_30.gif');
	same(K.node('#test-data-03 p span').attr('style'), 'color:red;');
	same(K.node('#test-data-01 p img').attr('border'), '0');
});

