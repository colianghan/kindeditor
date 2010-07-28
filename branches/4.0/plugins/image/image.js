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
		imgPath = this.scriptPath + 'plugins/image/images/',
		lang = self.lang(name + '.');
	self.clickToolbar(name, function() {
		var html = [
			'<div style="margin:10px;">',
			//tabs
			'<div class="tabs"></div>',
			//hidden iframe
			'<iframe name="uploadIframe" style="display:none;"></iframe>',
			//form start
			'<form name="uploadForm" method="post" enctype="multipart/form-data" target="uploadIframe">',
			'<input type="hidden" name="referMethod" value="" />',
			//url or file
			'<div class="ke-dialog-row">',
			'<div class="tab1" style="display:none;">',
			'<label for="keUrl">' + lang.remoteUrl + '</label>',
			'<input type="text" id="keUrl" name="url" value="" style="width:230px;" />',
			' <input type="button" name="viewServer" value="' + lang.viewServer + '" />',
			'</div>',
			'<div class="tab2" style="display:none;">',
			'<label for="keFile">' + lang.localUrl + '</label>',
			'<input type="file" id="keFile" name="imgFile" style="width:300px;" />',
			'</div>',
			'</div>',
			//size
			'<div class="ke-dialog-row">',
			'<label for="keWidth">' + lang.size + '</label>',
			lang.width + ' <input type="text" id="keWidth" name="width" value="" maxlength="4" style="width:50px;text-align:right;" /> ',
			lang.height + ' <input type="text" name="height" value="" maxlength="4" style="width:50px;text-align:right;" /> ',
			'<img src="' + imgPath + 'refresh.gif" width="16" height="16" alt="" />',
			'</div>',
			//align
			'<div class="ke-dialog-row">',
			'<label>' + lang.align + '</label>',
			'<input type="radio" name="align" value="" checked="checked" /> <img name="defaultImg" src="' + imgPath + 'align_top.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" value="left" /> <img name="leftImg" src="' + imgPath + 'align_left.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" value="right" /> <img name="rightImg" src="' + imgPath + 'align_right.gif" width="23" height="25" alt="" />',
			'</div>',
			//title
			'<div class="ke-dialog-row">',
			'<label for="keTitle">' + lang.imgTitle + '</label>',
			'<input type="text" id="keTitle" name="title" value="" style="width:95%;" /></div>',
			'</div>',
			//form end
			'</form>',
			'</div>'
		].join('');
		var dialog = self.createDialog({
			name : name,
			width : 450,
			height : 300,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var url = urlBox.val(),
						width = widthBox.val(),
						height = heightBox.val(),
						title = titleBox.val(),
						align = '';
					alignBox.each(function() {
						if (this.checked) {
							align = this.value;
							return false;
						}
					});
					if (tabs.selectedIndex === 1) {
						var form = K('[name="uploadForm"]', div),
							iframe = K('[name="uploadIframe"]', div);
						form.attr('action', uploadJson);
						iframe.bind('load', function(e) {
							iframe.unbind();
							var data = {};
							try {
								data = K.json(_iframeDoc(iframe).body.innerHTML);
							} catch(e) {
								alert(self.lang('invalidJson'));
							}
							if ('error' in data) {
								if (data.error === 0) {
									self.exec('insertimage', data.url, title, width, height, 0, align)
										.hideDialog().focus();
								} else {
									alert(data.message);
									return false;
								}
							}
						});
						form[0].submit();
						return;
					}
					self.exec('insertimage', url, title, width, height, 0, align)
						.hideDialog().focus();
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
		var urlBox = K('[name="url"]', div),
			widthBox = K('[name="width"]', div),
			heightBox = K('[name="height"]', div),
			titleBox = K('[name="title"]', div),
			alignBox = K('[name="align"]'); 
		//get selected image node
		var range = self.edit.cmd.range,
			sc = range.startContainer, so = range.startOffset;
		if (!K.WEBKIT && !range.isControl()) {
			return;
		}
		var img = K(sc.childNodes[so]);
		if (img.name !== 'img') {
			return;
		}
		urlBox.val(img.attr('src'));
		widthBox.val(img.width());
		heightBox.val(img.height());
		titleBox.val(img.attr('title'));
		alignBox.each(function() {
			if (this.value === img.attr('align')) {
				this.checked = true;
				return false;
			}
		});
		urlBox[0].focus();
	});
});
