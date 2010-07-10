module('cmd');

test('cmd.wrap', function() {
	var p = K.query('#test-data-01 p'),
		cloneP, strong, range, cmd;
	//1
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNode(strong);
	cmd = K.cmd(range);
	cmd.wrap('<span class="aaa"></span>');
	equals(range.html(), '<strong><span class="aaa">efg</span></strong>');
	document.body.removeChild(cloneP);
	//2
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNode(strong);
	cmd = K.cmd(range);
	cmd.wrap('<span style="color:red;"></span>');
	equals(range.html(), '<strong><span style="color:red;">efg</span></strong>');
	document.body.removeChild(cloneP);
	//3
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNodeContents(cloneP);
	cmd = K.cmd(range);
	cmd.wrap('<span style="color:red;"></span>');
	ok(K.queryAll('span[style]', cloneP).length === 7);
	equals(range.toString(), 'abcdefghijkxyz0123456789');
	document.body.removeChild(cloneP);
	//4
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNodeContents(cloneP);
	cmd = K.cmd(range);
	cmd.wrap('<span class="aaa"></span>');
	ok(K.queryAll('span[class="aaa"]', cloneP).length === 7);
	equals(range.toString(), 'abcdefghijkxyz0123456789');
	document.body.removeChild(cloneP);
	//5
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 2);
	cmd = K.cmd(range);
	cmd.wrap('<span class="aaa"></span>');
	equals(range.html(), '<span class="aaa">f</span>');
	document.body.removeChild(cloneP);
	//6
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 3);
	cmd = K.cmd(range);
	cmd.wrap('<span class="aaa"></span>');
	equals(range.html(), '<span class="aaa">fg</span>');
	document.body.removeChild(cloneP);
	//7
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 2);
	cmd = K.cmd(range);
	cmd.wrap('<strong></strong>');
	equals(range.html(), '<strong>f</strong>');
	document.body.removeChild(cloneP);
	//8
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(cloneP, 1);
	range.setEnd(strong.firstChild, 3);
	cmd = K.cmd(range);
	cmd.wrap('<strong></strong>');
	equals(range.html(), '<strong>efg</strong>');
	document.body.removeChild(cloneP);
	//9
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNodeContents(strong);
	range.collapse(true);
	cmd = K.cmd(range);
	cmd.wrap('<strong></strong>');
	cmd.wrap('<em></em>');
	cmd.wrap('<span></span>');
	range.setStart(strong.firstChild, 1).setEnd(strong.firstChild, 1);
	cmd._applyPreformat();
	equals(strong.innerHTML.toLowerCase(), '<strong><em><span>e</span></em></strong>fg');
	document.body.removeChild(cloneP);
	//10
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNodeContents(cloneP);
	cmd = K.cmd(range);
	cmd.wrap('<div></div>');
	equals(K.node(cloneP).first().name, 'div');
	same(K.node(cloneP).children().length, 1);
	document.body.removeChild(cloneP);
	//11
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(strong.firstChild, 3);
	range.setEnd(strong.nextSibling, 3);
	cmd = K.cmd(range);
	cmd.wrap('<strong></strong>');
	equals(cmd.range.html(), '<strong></strong><strong>hij</strong>');
	document.body.removeChild(cloneP);
	//12
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNode(strong);
	cmd = K.cmd(range);
	cmd.wrap('<div><p></p></div>');
	equals(range.html(), '<div><p><strong>efg</strong></p></div>');
	document.body.removeChild(cloneP);
	//13
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 2);
	cmd = K.cmd(range);
	cmd.wrap('<span class="aaa"><strong></strong></span>');
	equals(range.html(), '<span class="aaa"><strong>f</strong></span>');
	document.body.removeChild(cloneP);
	//14
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 2);
	cmd = K.cmd(range);
	cmd.wrap('<span class="aaa"><strong><em></em></strong></span>');
	equals(range.html(), '<span class="aaa"><strong><em>f</em></strong></span>');
	document.body.removeChild(cloneP);
	//15
	cloneP = K.node('<p>abc</p>').get();
	document.body.appendChild(cloneP);
	range = K.range(document);
	range.selectNodeContents(cloneP);
	cmd = K.cmd(range);
	cmd.wrap('<strong></strong>');
	cmd.wrap('<em></em>');
	equals(range.html(), '<strong><em>abc</em></strong>');
	document.body.removeChild(cloneP);
});

test('cmd.remove', function() {
	var p = K.query('#test-data-01 p'),
		cloneP, strong, range, cmd;
	//1
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNode(strong);
	cmd = K.cmd(range);
	cmd.remove({
		strong : '*'
	});
	equals(cmd.range.html(), 'efg');
	document.body.removeChild(cloneP);
	//2
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNode(strong);
	cmd = K.cmd(range);
	cmd.remove({
		'*' : '*'
	});
	equals(cmd.range.html(), 'efg');
	document.body.removeChild(cloneP);
	//3
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNode(strong);
	cmd = K.cmd(range);
	cmd.remove({
		'span' : '*'
	});
	equals(cmd.range.html(), '<strong>efg</strong>');
	document.body.removeChild(cloneP);
	//4
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 2);
	cmd = K.cmd(range);
	cmd.remove({
		'strong' : '*'
	});
	equals(cmd.range.toString(), 'f');
	document.body.removeChild(cloneP);
	//5
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(strong.firstChild, 0);
	range.setEnd(strong.firstChild, 3);
	cmd = K.cmd(range);
	cmd.remove({
		'strong' : '*'
	});
	equals(cmd.range.toString(), 'efg');
	document.body.removeChild(cloneP);
	//6
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	K.node(strong).addClass('abc').css('color', '#FF0000');
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 2);
	cmd = K.cmd(range);
	cmd.remove({
		'strong' : 'class'
	});
	equals(range.html().toLowerCase(), '<strong style="color:#ff0000;">f</strong>');
	document.body.removeChild(cloneP);
	//7
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	K.node(strong).addClass('abc').css('color', '#FF0000');
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 2);
	cmd = K.cmd(range);
	cmd.remove({
		'strong' : 'class,style'
	});
	equals(cmd.range.html().toLowerCase(), '<strong>f</strong>');
	document.body.removeChild(cloneP);
	//8
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	K.node(strong).addClass('abc').css('color', '#FF0000');
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 2);
	cmd = K.cmd(range);
	cmd.remove({
		'strong' : 'class,.color,.background-color'
	});
	equals(cmd.range.html().toLowerCase(), '<strong>f</strong>');
	document.body.removeChild(cloneP);
	//9
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(cloneP, 1);
	range.setEnd(strong.firstChild, 3);
	cmd = K.cmd(range);
	cmd.remove({
		'strong' : '*'
	});
	equals(range.html(), 'efg');
	document.body.removeChild(cloneP);
	//10
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	strong.innerHTML = '<strong>efg</strong>';
	range = K.range(document);
	range.setStart(strong.firstChild.firstChild, 1);
	range.setEnd(strong.firstChild.firstChild, 2);
	cmd = K.cmd(range);
	cmd.remove({
		'strong' : '*'
	});
	equals(range.html(), 'f');
	document.body.removeChild(cloneP);
	//11
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	strong.innerHTML = '<strong>efg</strong>';
	range = K.range(document);
	range.setStart(strong.firstChild.firstChild, 0);
	range.setEnd(strong.firstChild.firstChild, 3);
	cmd = K.cmd(range);
	cmd.remove({
		'strong' : '*'
	});
	equals(K.node(cloneP).html().substr(0, 11), 'abcdefghijk');
	document.body.removeChild(cloneP);
	//12
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.setStart(strong.firstChild, 1);
	range.setEnd(strong.firstChild, 1);
	cmd = K.cmd(range);
	cmd.remove({
		'strong' : '*'
	});
	var str = 'abcd<strong>efg';
	equals(K.node(cloneP).html().substr(0, str.length), str);
	document.body.removeChild(cloneP);
	//13
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	strong.innerHTML = '<strong>efg</strong>';
	range = K.range(document);
	range.setStart(strong.firstChild.firstChild, 1);
	range.setEnd(strong.firstChild.firstChild, 2);
	cmd = K.cmd(range);
	cmd.wrap('<strong></strong>');
	cmd.remove({
		'strong' : '*'
	});
	cmd.wrap('<strong></strong>');
	equals(range.html(), '<strong>f</strong>');
	document.body.removeChild(cloneP);
	//14
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNodeContents(strong);
	cmd = K.cmd(range);
	cmd.remove({
		strong : '*'
	});
	equals(cmd.range.html(), 'efg');
	document.body.removeChild(cloneP);
});
