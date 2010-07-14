
var edit = K.edit({
	srcElement : 'body textarea',
	width : '700px',
	height : '200px',
	designMode : true,
	bodyClass : 'ke-content',
	cssData : 'body {font-size:12px;margin:0;}'
}).create('div#edit');

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
	var a = K.node('<a href="javascript:;">' + key + '</a>').bind('click', (function(key, val) {
		return function(e) {
			edit.cmd.exec(key, val);
			e.stop();
		};
	})(key, val));
	K.node('#cmdArea').append(a);
	K.node('#cmdArea').append(document.createTextNode(' '));
});
K.node('#create').bind('click', function(e) {
	edit.create('div#edit');
});
K.node('#remove').bind('click', function(e) {
	edit.remove();
});
K.node('#design').bind('click', function(e) {
	edit.design(true);
});
K.node('#source').bind('click', function(e) {
	edit.design(false);
});
K.node('#toggle').bind('click', function(e) {
	edit.design();
});
