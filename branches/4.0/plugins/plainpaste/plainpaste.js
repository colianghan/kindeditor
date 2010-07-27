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

KindEditor.plugin(function(K) {
	this.clickToolbar('plainpaste', function() {
		var self = this,
			lang = self.lang('plainpaste.'),
			html = '<div style="margin:10px;">' +
				'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
				'<textarea style="width:415px;height:260px;border:1px solid #A0A0A0;"></textarea>' +
				'</div>',
			dialog = self.createDialog({
				name : 'plainpaste',
				width : 450,
				title : self.lang('plainpaste'),
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
