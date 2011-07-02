/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name plainpaste.js
 * @fileOverview 纯文本粘贴插件
 * @author Longhao Luo
 */

KindEditor.plugin('plainpaste', function(K) {
	var self = this, name = 'plainpaste';
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = '<div style="margin:10px 20px;">' +
				'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
				'<textarea class="ke-plugin-plainpaste-textarea"></textarea>' +
				'</div>',
			dialog = self.createDialog({
				name : name,
				width : 450,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var html = textarea.val();
						html = K.escape(html);
						html = html.replace(/ /g, '&nbsp;');
						html = html.replace(/\r\n|\n|\r/g, "<br />$&");
						self.insertHtml(html).hideDialog().focus();
					}
				}
			}),
			textarea = K('textarea', dialog.div());
		textarea.get().focus();
	});
});
