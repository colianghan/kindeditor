module('node');

test('node(html)',function(){
	var node = K.node('<div class="abc" style="font-size:12px;"></div>');
	equals(node.name, 'div');
	equals(node.attr('class'), 'abc');
	equals(node.css('font-size'), '12px');
});

test('node(selector)',function(){
	var node = K.node('p > strong');
	equals(node.name, 'strong');
});

test('node(textNode)',function(){
	var node = K.node(document.createTextNode('abc'));
	equals(node.name, '#text');
});

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

test("node.contains",function(){
	ok(K.node('#test-data-01 p').contains(K.node('#test-data-01 p')) === false);
	ok(K.node('#test-data-01').contains(K.node('#test-data-01 p')) === true);
	ok(K.node('#test-data-01 strong').contains(K.node('#test-data-01 strong').first()) === true);
	ok(K.node(document).contains(K.node('#test-data-01 strong')) === true);
	ok(K.node(document).contains(document) === false);
	ok(K.node('#test-data-01 strong').first().contains(K.node('#test-data-01 strong')) === false);
});

test("node.val",function(){
	equals(K.node('<input value="aa" />').val(), "aa");
	equals(K.node('<div value="aa"></div>').val(), "aa");
	equals(K.node('<input value="aa" />').val("bb").val(), "bb");
	equals(K.node('<div value="aa"></div>').val("").val(), "");
	equals(K.node('<textarea></textarea>').val('abc').val(), 'abc');
});

test("node.css",function(){
	var node = K.node('<div></div>');
	equals(node.css('width','300px').css('width'), '300px');
	equals(node.css('border','1px solid #ccc').css('border'),node.css('border'));
	node = K.node('#test-data-01');
	equals(node.css('width'), '300px');
});

test("node.html",function(){
	var node = K.node('<div>xxx</div>');
	equals(node.html(), 'xxx');
	equals(node.html('bbb').html(), 'bbb');
	equals(K.node('<textarea></textarea>').html('abc').html(), 'abc');
});

test("node.outer",function(){
	var node = K.node('<div>xxx</div>');
	equals(node.outer(), '<div>xxx</div>');
	equals(node.addClass('aaa').outer(), '<div class="aaa">xxx</div>');
});
