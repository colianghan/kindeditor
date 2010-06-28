var K = KindEditor;

var edit = K.edit('body textarea', {
	width : '600px',
	height : '200px',
	designMode : false
}).create();
K.node('#bold').bind('click', function(e) {
	edit.cmd.bold();
	e.stop();
});
K.node('#foreColor').bind('click', function(e) {
	edit.cmd.foreColor('#FF0000');
	e.stop();
});
K.node('#create').bind('click', function(e) {
	edit.create();
});
K.node('#remove').bind('click', function(e) {
	edit.remove();
});
K.node('#design').bind('click', function(e) {
	edit.toDesign();
});
K.node('#source').bind('click', function(e) {
	edit.toSource();
});
K.node('#toggle').bind('click', function(e) {
	edit.toggle();
});
K.node('#show').bind('click', function(e) {
	edit.show();
});
K.node('#hide').bind('click', function(e) {
	edit.hide();
});