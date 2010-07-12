
var edit = K.edit({
	srcElement : 'body textarea',
	width : '700px',
	height : '200px',
	designMode : true,
	bodyClass : 'ke-content',
	css : 'body {font-size:12px;margin:0;}'
}).create('div#edit');

var toolbar = K.toolbar({
	width : '700px',
	height : '200px'
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
			edit.cmd[name]();
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
	toolbar.enable();
});
K.node('#disable').bind('click', function(e) {
	toolbar.disable();
});
K.node('#toggle').bind('click', function(e) {
	toolbar.toggle();
});
