/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name link.js
 * @fileOverview 超级连接插件
 * @author Longhao Luo
 */

KindEditor.plugin(function(K) {
	var self = this, name = 'link';
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = '<div style="margin:10px;">' +
				//url
				'<div class="ke-dialog-row">' +
				'<label for="keUrl">' + lang.url + '</label>' +
				'<input type="text" id="keUrl" name="url" value="" style="width:90%;" /></div>' +
				//type
				'<div class="ke-dialog-row"">' +
				'<label for="keType">' + lang.linkType + '</label>' +
				'<select id="keType" name="type"></select>' +
				'</div>' +
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
