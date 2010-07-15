
var menu = K.menu({
	width : 200,
	x : 100,
	y : 120,
	z : 19811212,
	centerLineMode : false
});
K.each('9px,10px,12px,14px,16px,18px,24px,32px'.split(','), function(i, val) {
	menu.addItem({
		title : '<span style="font-size:' + val + ';">' + val + '</span>',
		click : function() {
			alert(val);
		},
		height : parseInt(val, 10) + 12,
		checked : val === '12px'
	});
});

var contextmenu = K.menu({
	width : 200,
	x : 400,
	y : 120,
	z : 19811213
});
K.each('image,flash,media,-,bold,cut,copy,paste,-,selectall'.split(','), function(i, val) {
	contextmenu.addItem({
		title : val,
		click : function() {
			alert(val);
		},
		iconClass : 'ke-icon-' + val
	});
});

K.node('#menu').bind('click', function(e) {
	if (menu.div) {
		menu.remove();
	} else {
		menu.create();
	}
});

K.node('#contextmenu').bind('click', function(e) {
	if (contextmenu.div) {
		contextmenu.remove();
	} else {
		contextmenu.create();
	}
});

