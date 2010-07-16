
var toolbar = null;

K.node('#create').bind('click', function(e) {
	if (toolbar) {
		return;
	}
	var items = [
		'source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		'superscript', '|', 'selectall', '/',
		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
		'flash', 'media', 'advtable', 'hr', 'emoticons', 'link', 'unlink', '|', 'about'
	];
	toolbar = K.toolbar({
		parent : 'div#toolbar',
		width : '100%'
	});
	K.each(items, function(i, name) {
		toolbar.addItem({
			name : name,
			click : function() {
				alert(name);
			}
		});
	});
});
K.node('#remove').bind('click', function(e) {
	if (toolbar) {
		toolbar.remove();
		toolbar = null;
	}
});
K.node('#enable').bind('click', function(e) {
	if (toolbar) {
		toolbar.disable(false);
	}
});
K.node('#disable').bind('click', function(e) {
	if (toolbar) {
		toolbar.disable(true);
	}
});
K.node('#toggle').bind('click', function(e) {
	if (toolbar) {
		toolbar.disable();
	}
});

K.node('#create').fire('click');
