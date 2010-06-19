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
	ok(K.queryAll('span[style]', cloneP).length === 8);
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
});
