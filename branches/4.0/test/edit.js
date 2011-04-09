
var edit = null;

var cmds = {
	bold : '',
	italic : '',
	underline : '',
	strikeThrough : '',
	foreColor : '#FF0000',
	hiliteColor : '#DDDDDD',
	fontSize : '32px',
	fontFamily : 'Arial Black',
	removeFormat : ''
};
K.each(cmds, function(key, val) {
	var a = K('<a href="javascript:;">' + key + '</a>').bind('click', (function(key, val) {
		return function(e) {
			edit.cmd.exec(key, val);
			e.stop();
		};
	})(key, val));
	K('#cmdArea').append(a);
	K('#cmdArea').append(document.createTextNode(' '));
});
K('#create').bind('click', function(e) {
	if (!edit) {
		edit = K.edit({
			parent : 'div#edit',
			srcElement : 'body textarea',
			width : '700px',
			height : '200px',
			designMode : true,
			bodyClass : 'ke-content',
			cssData : 'body {font-size:12px;margin:0;}'
		});
	}
});
K('#create').click();
K('#remove').bind('click', function(e) {
	if (edit) {
		edit.remove();
		edit = null;
	}
});
K('#design').bind('click', function(e) {
	if (edit) {
		edit.design(true);
	}
});
K('#source').bind('click', function(e) {
	if (edit) {
		edit.design(false);
	}
});
K('#toggle').bind('click', function(e) {
	if (edit) {
		edit.design();
	}
});