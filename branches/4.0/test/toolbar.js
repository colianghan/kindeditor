
var toolbar = null;

K('#create').bind('click', function(e) {
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
K('#remove').bind('click', function(e) {
	if (toolbar) {
		toolbar.remove();
		toolbar = null;
	}
});
K('#enable').bind('click', function(e) {
	if (toolbar) {
		toolbar.disableItems(false);
	}
});
K('#disable').bind('click', function(e) {
	if (toolbar) {
		toolbar.disableItems(true);
	}
});
K('#toggle').bind('click', function(e) {
	if (toolbar) {
		toolbar.disableItems();
	}
});

K('#create').fire('click');
