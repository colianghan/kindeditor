/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name flash.js
 * @fileOverview 图片插件
 * @author Longhao Luo
 */

KindEditor.plugin(function(K) {
	var self = this, name = 'flash',
		lang = self.lang(name + '.');
	self.clickToolbar(name, function() {
		var html = [
			'<div style="margin:10px;">',
			//url
			'<div class="ke-dialog-row">',
			'<label for="keUrl">' + lang.url + '</label>',
			'<input type="text" id="keUrl" name="url" value="" style="width:90%;" />',
			'</div>',
			//width
			'<div class="ke-dialog-row">',
			'<label for="keWidth">' + lang.width + '</label>',
			'<input type="text" id="keWidth" name="width" value="550" maxlength="4" style="width:50px;text-align:right;" /> ',
			'</div>',
			//height
			'<div class="ke-dialog-row">',
			'<label for="keHeight">' + lang.height + '</label>',
			'<input type="text" id="keHeight" name="height" value="550" maxlength="4" style="width:50px;text-align:right;" /> ',
			'</div>',
			'</div>'
		].join('');
		var dialog = self.createDialog({
			name : name,
			width : 400,
			height : 200,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var url = urlBox.val(),
						html = K.mediaImg(self.themesPath + 'common/blank.gif', {
							src : url,
							type : K.mediaType('.swf'),
							width : widthBox.val(),
							height : heightBox.val(),
							quality : 'high'
						});
					self.insertHtml(html).hideDialog().focus();
				}
			}
		}),
		div = dialog.div(),
		urlBox = K('[name="url"]', div),
		widthBox = K('[name="width"]', div),
		heightBox = K('[name="height"]', div);
		urlBox[0].focus();
	});
});
