
var toolbar = K.toolbar({
	width : '100%'
});

var items = [
	'source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
	'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
	'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
	'superscript', '|', 'selectall', '/',
	'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
	'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
	'flash', 'media', 'advtable', 'hr', 'emoticons', 'link', 'unlink', '|', 'about'
];
K.each(items, function(i, name) {
	toolbar.addItem({
		name : name,
		click : function() {
			alert(name);
		}
	});
});
toolbar.create('div#toolbar');

K.node('#create').bind('click', function(e) {
	toolbar.create('div#toolbar');
});
K.node('#remove').bind('click', function(e) {
	toolbar.remove();
});
K.node('#enable').bind('click', function(e) {
	toolbar.disable(false);
});
K.node('#disable').bind('click', function(e) {
	toolbar.disable(true);
});
K.node('#toggle').bind('click', function(e) {
	toolbar.disable();
});
