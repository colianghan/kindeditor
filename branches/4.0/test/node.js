module('node');

test('node.attr/node.removeAttr', function() {
	equals(K.node('#test-data-01').attr('src', 'aaa').attr('src'), 'aaa');
	equals(K.node('#test-data-02').attr('src', 'aaa').removeAttr('src').attr('src'), '');
	equals(K.node('#test-data-01').attr('id'), 'test-data-01');
	equals(K.node('#test-data-01').attr('class'), 'test-class');
	equals(K.node('#test-data-01 p img').attr('src'), './data/logo_180_30.gif');
	equals(K.node('#test-data-03 p span').attr('style'), 'color:red;');
	equals(K.node('#test-data-01 p img').attr('border'), '0');
	equals(K.node('#test-data-01').attr('class'), 'test-class');
	var knode = K.node('<div></div>');
	equals(knode.attr('class', 'aaa').attr('class'), 'aaa');
	equals(knode.removeAttr('class').attr('class'), '');
});
test('node("html tag")',function(){
	var node = K.node('<div><span></span></div>');
	equals(node.name,'div')
	equals(node.first.name,'span')
})


test("node.hasClass/node.addClass/node.removeClass", function() {
	var knode = K.node('<div></div>');
	var div = knode.get();
	knode.addClass('aaa');
	ok(knode.hasClass('aaa'));
	equals(div.className, 'aaa');
	knode.addClass('aaa');
	equals(div.className, 'aaa');
	knode.addClass('bbb');
	ok(knode.hasClass('bbb'));
	equals(div.className, 'aaa bbb');
	knode.addClass('ccc');
	ok(knode.hasClass('ccc'));
	equals(div.className, 'aaa bbb ccc');
	knode.removeClass('aaa');
	ok(!knode.hasClass('aaa'));
	equals(div.className, 'bbb ccc');
	knode.removeClass('bbb');
	ok(!knode.hasClass('bbb'));
	equals(div.className, 'ccc');
	knode.removeClass('ccc');
	ok(!knode.hasClass('ccc'));
	equals(div.className, '');
});

