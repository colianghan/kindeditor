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
	var self = this, name = 'image',
		allowUpload = _undef(self.allowUpload, true),
		allowFileManager = _undef(self.allowFileManager, false),
		uploadJson = _undef(self.imageUploadJson, self.scriptPath + 'php/upload_json.php'),
		imgPath = this.scriptPath + 'plugins/image/images/';
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = '<div style="margin:10px;">' +
				//tabs
				'<div class="tabs"></div>' +
				//hidden iframe
				'<iframe name="uploadIframe" style="display:none;"></iframe>' +
				//form start
				'<form name="uploadForm" method="post" enctype="multipart/form-data" target="uploadIframe">' +
				'<input type="hidden" name="referMethod" value="" />' +
				//url or file
				'<div class="ke-dialog-row">' +
				'<div class="tab1" style="display:none;">' +
				'<label for="keUrl">' + lang.remoteUrl + '</label>' +
				'<input type="text" id="keUrl" name="url" value="" style="width:230px;" />' +
				' <input type="button" name="viewServer" value="' + lang.viewServer + '" />' +
				'</div>' +
				'<div class="tab2" style="display:none;">' +
				'<label for="keFile">' + lang.localUrl + '</label>' +
				'<input type="file" id="keFile" name="imgFile" style="width:300px;" />' +
				'</div>' +
				'</div>' +
				//size
				'<div class="ke-dialog-row">' +
				'<label for="keWidth">' + lang.size + '</label>' +
				lang.width + ' <input type="text" id="keWidth" name="imgWidth" value="" maxlength="4" style="width:50px;text-align:right;" /> ' +
				lang.height + ' <input type="text" name="imgHeight" value="" maxlength="4" style="width:50px;text-align:right;" /> ' +
				'<img src="' + imgPath + 'refresh.gif" width="16" height="16" alt="" />' +
				'</div>' +
				//align
				'<div class="ke-dialog-row">' +
				'<label>' + lang.align + '</label>' +
				'<input type="radio" name="align" value="" checked="checked" /> <img name="defaultImg" src="' + imgPath + 'align_top.gif" width="23" height="25" alt="" />' +
				' <input type="radio" name="align" value="left" /> <img name="leftImg" src="' + imgPath + 'align_left.gif" width="23" height="25" alt="" />' +
				' <input type="radio" name="align" value="right" /> <img name="rightImg" src="' + imgPath + 'align_right.gif" width="23" height="25" alt="" />' +
				'</div>' +
				//title
				'<div class="ke-dialog-row">' +
				'<label for="keTitle">' + lang.imgTitle + '</label>' +
				'<input type="text" id="keTitle" name="imgTitle" value="" style="width:95%;" /></div>' +
				'</div>' +
				//form end
				'</form>' +
				'</div>',
			dialog = self.createDialog({
				name : name,
				width : 400,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						self.insertHtml('').hideDialog().focus();
					}
				}
			}),
			div = dialog.div(),
			tabs = K.tabs({
				parent : K('.tabs', div),
				afterSelect : function(i) {
				
				}
			});
		tabs.add({
			title : lang.remoteImage,
			panel : K('.tab1', div)
		});
		tabs.add({
			title : lang.localImage,
			panel : K('.tab2', div)
		});
		tabs.select(0);
	});
});
