/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name image.js
 * @fileOverview 图片插件
 * @author Longhao Luo
 */

KindEditor.plugin(function(K) {
	var self = this, name = 'image';
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = '<div style="margin:10px;">' +
				'<div style="margin-bottom:10px;"><label>' + lang.url + '</label>' +
				'<input type="text" name="url" value="" style="width:90%;" /></div>' +
				'<div style="margin-bottom:10px;"><label>' + lang.linkType + '</label>' +
				'<select name="type"></select>' +
				'</div>',
			dialog = self.createDialog({
				name : name,
				width : 400,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						self.exec('createlink', urlBox.val(), typeBox.val()).hideDialog().focus();
					}
				}
			}),
			div = dialog.div(),
			urlBox = K('input[name="url"]', div),
			typeBox = K('select[name="type"]', div);
		typeBox.get().options[0] = new Option(lang.newWindow, '_blank');
		typeBox.get().options[1] = new Option(lang.selfWindow, '');
		urlBox.val(self.val('createlink'));
		urlBox.get().focus();
	});
});
