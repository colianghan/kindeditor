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
	equals(strong.innerHTML.toLowerCase(), '<strong></strong>efg');
	document.body.removeChild(cloneP);
	//10
	cloneP = p.cloneNode(true);
	document.body.appendChild(cloneP);
	strong = K.query('strong', cloneP);
	range = K.range(document);
	range.selectNodeContents(cloneP);
	cmd = K.cmd(range);
	cmd.wrap('<div></div>');
	equals(K.node(cloneP).first.name, 'div');
	same(K.node(cloneP).children.length, 1);
	document.body.removeChild(cloneP);
});
