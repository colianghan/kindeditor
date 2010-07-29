/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name media.js
 * @fileOverview 视音频插件
 * @author Longhao Luo
 */

KindEditor.plugin('media', function(K) {
	var self = this, name = 'media',
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
			'<input type="text" id="keWidth" name="width" value="550" maxlength="4" style="width:50px;text-align:right;" />',
			'</div>',
			//height
			'<div class="ke-dialog-row">',
			'<label for="keHeight">' + lang.height + '</label>',
			'<input type="text" id="keHeight" name="height" value="400" maxlength="4" style="width:50px;text-align:right;" />',
			'</div>',
			//autostart
			'<div class="ke-dialog-row">',
			'<label for="keAutostart">' + lang.autostart + '</label>',
			'<input type="checkbox" id="keAutostart" name="autostart" value="" /> ',
			'</div>',
			'</div>'
		].join('');
		var dialog = self.createDialog({
			name : name,
			width : 400,
			height : 230,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var url = urlBox.val(),
						html = K.mediaImg(self.themesPath + 'common/blank.gif', {
							src : url,
							type : K.mediaType(url),
							width : widthBox.val(),
							height : heightBox.val(),
							autostart : autostartBox[0].checked ? 'true' : 'false',
							loop : 'true'
						});
					self.insertHtml(html).hideDialog().focus();
				}
			}
		}),
		div = dialog.div(),
		urlBox = K('[name="url"]', div),
		widthBox = K('[name="width"]', div),
		heightBox = K('[name="height"]', div),
		autostartBox = K('[name="autostart"]', div);
		//get selected image node
		var range = self.edit.cmd.range,
			sc = range.startContainer, so = range.startOffset;
		if (!K.WEBKIT && !range.isControl()) {
			return;
		}
		var img = K(sc.childNodes[so]);
		console.log(img[0].className);
		if (img.name !== 'img' || !/^ke-\w+$/.test(img[0].className)) {
			return;
		}
		console.log(img[0].className);
		var attrs = K.mediaAttrs(img.attr('kesrctag'));
		urlBox.val(attrs.src);
		widthBox.val(K.removeUnit(img.css('width')) || attrs.width || 0);
		heightBox.val(K.removeUnit(img.css('height')) || attrs.height || 0);
		autostartBox[0].checked = (attrs.autostart === 'true');
		urlBox[0].focus();
	});
});
