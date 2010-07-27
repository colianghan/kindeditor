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

K.plugin('source', function(editor) {
	editor.toolbar.disable();
	editor.edit.design();
});

K.plugin('fullscreen', function(editor) {
	editor.fullscreen();
});

K.plugin('formatblock', function(editor) {
	var blocks = editor.lang('formatblock.formatBlock'),
		heights = {
			h1 : 28,
			h2 : 24,
			h3 : 18,
			H4 : 14,
			p : 12
		},
		curVal = editor.val('formatblock'),
		menu = editor.createMenu({
			name : 'formatblock',
			width : editor.langType == 'en' ? 200 : 150
		});
	K.each(blocks, function(key, val) {
		var style = 'font-size:' + heights[key] + 'px;';
		if (key.charAt(0) === 'h') {
			style += 'font-weight:bold;';
		}
		menu.addItem({
			title : '<span style="' + style + '">' + val + '</span>',
			height : heights[key] + 12,
			checked : (curVal === key || curVal === val),
			click : function() {
				editor.select().exec('formatblock', '<' + key.toUpperCase() + '>').hideMenu();
			}
		});
	});
});

K.plugin('fontname', function(editor) {
	var curVal = editor.val('fontname'),
		menu = editor.createMenu({
			name : 'fontname',
			width : 150
		});
	K.each(editor.lang('fontname.fontName'), function(key, val) {
		menu.addItem({
			title : '<span style="font-family: ' + key + ';">' + val + '</span>',
			checked : (curVal === key.toLowerCase() || curVal === val.toLowerCase()),
			click : function() {
				editor.exec('fontname', key).hideMenu();
			}
		});
	});
});

K.plugin('fontsize', function(editor) {
	var fontSize = ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
		curVal = editor.val('fontsize');
		menu = editor.createMenu({
			name : 'fontsize',
			width : 150
		});
	K.each(fontSize, function(i, val) {
		menu.addItem({
			title : '<span style="font-size:' + val + ';">' + val + '</span>',
			height : K.removeUnit(val) + 12,
			checked : curVal === val,
			click : function() {
				editor.exec('fontsize', val).hideMenu();
			}
		});
	});
});

K.each('forecolor,hilitecolor'.split(','), function(i, name) {
	K.plugin(name, function(editor) {
		editor.createMenu({
			name : name,
			selectedColor : editor.val(name) || 'default',
			click : function(color) {
				editor.exec(name, color).hideMenu();
			}
		});
	});
});

K.each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
	'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,' +
	'bold,italic,underline,strikethrough,removeformat,unlink').split(','), function(i, name) {
	K.plugin(name, function(editor) {
		editor.focus().exec(name, null);
	});
});

K.each(('cut,copy,paste').split(','), function(i, name) {
	K.plugin(name, function(editor) {
		editor.focus();
		try {
			editor.exec(name, null);
		} catch(e) {
			alert(editor.lang(name + 'Error'));
		}
	});
});

K.plugin('about', function(editor) {
	var html = '<div style="margin:20px;">' +
		'<div>KindEditor ' + K.kindeditor + '</div>' +
		'<div>Copyright &copy; <a href="http://www.kindsoft.net/" target="_blank">kindsoft.net</a> All rights reserved.</div>' +
		'</div>';
	editor.createDialog({
		name : 'about',
		width : 300,
		title : editor.lang('about'),
		body : html
	});
});

K.plugin('plainpaste', function(editor) {
	var lang = editor.lang('plainpaste.'),
		html = '<div style="margin:10px;">' +
			'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
			'<textarea style="width:415px;height:260px;border:1px solid #A0A0A0;"></textarea>' +
			'</div>',
		dialog = editor.createDialog({
			name : 'plainpaste',
			width : 450,
			title : editor.lang('plainpaste'),
			body : html,
			yesBtn : {
				name : editor.lang('yes'),
				click : function(e) {
					var html = textarea.val();
					html = K.escape(html);
					html = html.replace(/ /g, '&nbsp;');
					html = html.replace(/\r\n|\n|\r/g, "<br />$&");
					editor.insertHtml(html).hideDialog().focus();
				}
			}
		}),
		textarea = K('textarea', dialog.div());
	textarea.get().focus();
});

K.plugin('wordpaste', function(editor) {
	var lang = editor.lang('wordpaste.'),
		html = '<div style="margin:10px;">' +
			'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
			'<iframe style="width:415px;height:260px;border:1px solid #A0A0A0;" frameborder="0"></iframe>' +
			'</div>',
		dialog = editor.createDialog({
			name : 'wordpaste',
			width : 450,
			title : editor.lang('wordpaste'),
			body : html,
			yesBtn : {
				name : editor.lang('yes'),
				click : function(e) {
					var str = doc.body.innerHTML;
					str = str.replace(/<meta(\n|.)*?>/ig, '');
					str = str.replace(/<!(\n|.)*?>/ig, '');
					str = str.replace(/<style[^>]*>(\n|.)*?<\/style>/ig, '');
					str = str.replace(/<script[^>]*>(\n|.)*?<\/script>/ig, '');
					str = str.replace(/<w:[^>]+>(\n|.)*?<\/w:[^>]+>/ig, '');
					str = str.replace(/<xml>(\n|.)*?<\/xml>/ig, '');
					str = str.replace(/\r\n|\n|\r/ig, '');
					editor.insertHtml(str).hideDialog().focus();
				}
			}
		}),
		div = dialog.div(),
		iframe = K('iframe', div.get());
	var doc = K.iframeDoc(iframe);
	if (!K.IE) {
		doc.designMode = 'on';
	}
	doc.open();
	doc.write('<html><head><title>WordPaste</title></head>');
	doc.write('<body style="background-color:#FFFFFF;font-size:12px;margin:2px;" />');
	if (!K.IE) {
		doc.write('<br />');
	}
	doc.write('</body></html>');
	doc.close();
	if (K.IE) {
		doc.body.contentEditable = 'true';
	}
	iframe.get().contentWindow.focus();
});

K.plugin('link', function(editor) {
	var lang = editor.lang('link.'),
		html = '<div style="margin:10px;">' +
			'<div style="margin-bottom:10px;"><label>' + lang.url + '</label>' +
			'<input type="text" name="url" value="" style="width:90%;" /></div>' +
			'<div style="margin-bottom:10px;"><label>' + lang.linkType + '</label>' +
			'<select name="type"></select>' +
			'</div>',
		dialog = editor.createDialog({
			name : 'link',
			width : 400,
			title : editor.lang('link'),
			body : html,
			yesBtn : {
				name : editor.lang('yes'),
				click : function(e) {
					editor.exec('createlink', urlBox.val(), typeBox.val()).hideDialog().focus();
				}
			}
		}),
		div = dialog.div(),
		urlBox = K('input[name="url"]', div),
		typeBox = K('select[name="type"]', div);
	typeBox.get().options[0] = new Option(lang.newWindow, '_blank');
	typeBox.get().options[1] = new Option(lang.selfWindow, '');
	urlBox.val(editor.val('createlink'));
	urlBox.get().focus();
});

})(KindEditor);
