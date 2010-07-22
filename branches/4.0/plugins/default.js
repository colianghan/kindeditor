/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name default.js
 * @fileOverview 编辑器默认插件
 * @author Longhao Luo
 */

(function(K, undefined) {

K.plugin('about', function(editor) {
	var html = '<div style="margin:20px;">' +
		'<div>KindEditor ' + K.kindeditor + '</div>' +
		'<div>Copyright &copy; <a href="http://www.kindsoft.net/" target="_blank">kindsoft.net</a> All rights reserved.</div>' +
		'</div>';
	var dialog = K.dialog({
		width : 300,
		title : editor.lang('about'),
		body : html,
		noBtn : {
			name : editor.lang('close'),
			click : function(e) {
				dialog.remove();
				editor.edit.focus();
			}
		}
	});
});

K.plugin('plainpaste', function(editor) {
	var lang = editor.lang('plainpaste.'),
		html = '<div style="margin:10px;">' +
			'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
			'<textarea style="width:415px;height:260px;border:1px solid #A0A0A0;"></textarea>' +
			'</div>';
	var dialog = K.dialog({
		width : 450,
		title : editor.lang('plainpaste'),
		body : html,
		yesBtn : {
			name : editor.lang('yes'),
			click : function(e) {
				var html = K('textarea', dialog.div().get()).val();
				html = K.escape(html);
				html = html.replace(/ /g, '&nbsp;');
				html = html.replace(/\r\n|\n|\r/g, "<br />$&");
				editor.edit.cmd.inserthtml(html);
				dialog.remove();
				editor.edit.focus();
			}
		},
		noBtn : {
			name : editor.lang('close'),
			click : function(e) {
				dialog.remove();
				editor.edit.focus();
			}
		}
	});
});

K.plugin('source', function(editor) {
	editor.toolbar.disable();
	editor.edit.design();
});

K.plugin('fullscreen', function(editor) {
	editor.fullscreen();
});

K.plugin('formatblock', function(editor) {
	var pos = this.pos(),
		blocks = editor.lang('formatblock.formatBlock'),
		heights = {
			h1 : 28,
			h2 : 24,
			h3 : 18,
			H4 : 14,
			p : 12
		},
		cmd = editor.edit.cmd,
		curVal = cmd.val('formatblock');
	editor.menu = K.menu({
		name : 'formatblock',
		width : editor.langType == 'en' ? 200 : 150,
		x : pos.x,
		y : pos.y + this.height(),
		centerLineMode : false
	});
	K.each(blocks, function(key, val) {
		var style = 'font-size:' + heights[key] + 'px;';
		if (key.charAt(0) === 'h') {
			style += 'font-weight:bold;';
		}
		editor.menu.addItem({
			title : '<span style="' + style + '">' + val + '</span>',
			height : heights[key] + 12,
			checked : (curVal === key || curVal === val),
			click : function(e) {
				cmd.select();
				cmd.formatblock('<' + key.toUpperCase() + '>');
				editor.menu.remove();
				editor.menu = null;
				e.stop();
			}
		});
	});
});

K.plugin('fontname', function(editor) {
	var pos = this.pos(),
		cmd = editor.edit.cmd,
		curVal = cmd.val('fontname');
	editor.menu = K.menu({
		name : 'fontname',
		width : 150,
		x : pos.x,
		y : pos.y + this.height(),
		centerLineMode : false
	});
	K.each(editor.lang('fontname.fontName'), function(key, val) {
		editor.menu.addItem({
			title : '<span style="font-family: ' + key + ';">' + val + '</span>',
			checked : (curVal === key.toLowerCase() || curVal === val.toLowerCase()),
			click : function(e) {
				cmd.fontname(val);
				editor.menu.remove();
				editor.menu = null;
				e.stop();
			}
		});
	});
});

K.plugin('fontsize', function(editor) {
	var fontSize = ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
		pos = this.pos(),
		cmd = editor.edit.cmd,
		curVal = cmd.val('fontsize');
	editor.menu = K.menu({
		name : 'fontsize',
		width : 150,
		x : pos.x,
		y : pos.y + this.height(),
		centerLineMode : false
	});
	K.each(fontSize, function(i, val) {
		editor.menu.addItem({
			title : '<span style="font-size:' + val + ';">' + val + '</span>',
			height : K.removeUnit(val) + 12,
			checked : curVal === val,
			click : function(e) {
				cmd.fontsize(val);
				editor.menu.remove();
				editor.menu = null;
				e.stop();
			}
		});
	});
});

K.each('forecolor,hilitecolor'.split(','), function(i, name) {
	K.plugin(name, function(editor) {
		var pos = this.pos(),
			cmd = editor.edit.cmd,
			curVal = cmd.val(name);
		editor.menu = K.colorpicker({
			name : name,
			x : pos.x,
			y : pos.y + this.height(),
			selectedColor : curVal || 'default',
			noColor : editor.lang('noColor'),
			click : function(color) {
				cmd[name](color);
				editor.menu.remove();
				editor.menu = null;
			}
		});
	});
});

K.each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
	'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,cut,copy,paste,' +
	'bold,italic,underline,strikethrough,removeformat').split(','), function(i, name) {
	K.plugin(name, function(editor) {
		editor.edit.focus();
		editor.edit.cmd[name](null);
	});
});

})(KindEditor);
