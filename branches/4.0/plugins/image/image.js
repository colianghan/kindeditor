
KindEditor.plugin('image', function(K) {
	var self = this, name = 'image',
		allowImageUpload = K.undef(self.allowImageUpload, true),
		allowFileManager = K.undef(self.allowFileManager, false),
		uploadJson = K.undef(self.imageUploadJson, self.basePath + 'php/upload_json.php'),
		imgPath = self.basePath + 'plugins/image/images/',
		lang = self.lang(name + '.');
	self.plugin.image = {
		edit : function() {
			var html = [
				'<div style="padding:10px 20px;">',
				//tabs
				'<div class="tabs"></div>',
				//url or file
				'<div class="ke-dialog-row">',
				'<div class="tab1" style="display:none;">',
				'<label for="keUrl" style="width:60px;">' + lang.remoteUrl + '</label>',
				'<input type="text" id="keUrl" class="ke-input-text" name="url" value="" style="width:200px;" /> &nbsp;',
				'<span class="ke-button-common ke-button-outer">',
				'<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
				'</span>',
				'</div>',
				'<div class="tab2" style="display:none;">',
				'<label style="width:60px;">' + lang.localUrl + '</label>',
				'<input type="text" name="localUrl" class="ke-input-text" tabindex="-1" style="width:200px;" readonly="true" /> &nbsp;',
				'<input type="button" class="ke-upload-button" value="' + lang.viewServer + '" />',
				'</div>',
				'</div>',
				//size
				'<div class="ke-dialog-row">',
				'<label for="keWidth" style="width:60px;">' + lang.size + '</label>',
				lang.width + ' <input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="4" /> ',
				lang.height + ' <input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" /> ',
				'<img src="' + imgPath + 'refresh.gif" width="16" height="16" alt="" />',
				'</div>',
				//align
				'<div class="ke-dialog-row">',
				'<label style="width:60px;">' + lang.align + '</label>',
				'<input type="radio" name="align" class="ke-inline-block" value="" checked="checked" /> <img name="defaultImg" src="' + imgPath + 'align_top.gif" width="23" height="25" alt="" />',
				' <input type="radio" name="align" class="ke-inline-block" value="left" /> <img name="leftImg" src="' + imgPath + 'align_left.gif" width="23" height="25" alt="" />',
				' <input type="radio" name="align" class="ke-inline-block" value="right" /> <img name="rightImg" src="' + imgPath + 'align_right.gif" width="23" height="25" alt="" />',
				'</div>',
				//title
				'<div class="ke-dialog-row">',
				'<label for="keTitle" style="width:60px;">' + lang.imgTitle + '</label>',
				'<input type="text" id="keTitle" class="ke-input-text" name="title" value="" style="width:200px;" /></div>',
				'</div>',
				'</div>'
			].join('');
			var dialogWidth = allowImageUpload ? 450 : 400;
				dialogHeight = allowImageUpload ? 300 : 250;
			var dialog = self.createDialog({
				name : name,
				width : dialogWidth,
				height : dialogHeight,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						// insert local image
						if (tabs.selectedIndex === 1) {
							uploadbutton.submit();
							return;
						}
						// insert remote image
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
						self.exec('insertimage', url, title, width, height, 0, align).hideDialog().focus();
					}
				}
			}),
			div = dialog.div;

			var tabs;
			if (allowImageUpload) {
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
			} else {
				K('.tab1', div).show();
			}

			var urlBox = K('[name="url"]', div),
				localUrlBox = K('[name="localUrl"]', div),
				viewServerBtn = K('[name="viewServer"]', div),
				widthBox = K('[name="width"]', div),
				heightBox = K('[name="height"]', div),
				titleBox = K('[name="title"]', div),
				alignBox = K('[name="align"]');

			var uploadbutton = K.uploadbutton({
				button : K('.ke-upload-button', div)[0],
				fieldName : 'imgFile',
				url : uploadJson + '?dir=image',
				afterUpload : function(data) {
					if (data.error === 0) {
						var width = widthBox.val(),
							height = heightBox.val(),
							title = titleBox.val(),
							align = '';
						alignBox.each(function() {
							if (this.checked) {
								align = this.value;
								return false;
							}
						});
						var url = K.formatUrl(data.url, 'absolute');
						self.exec('insertimage', url, title, width, height, 0, align).hideDialog().focus();
						if (self.afterUpload) {
							self.afterUpload.call(self, url);
						}
					} else {
						alert(data.message);
					}
				}
			});
			uploadbutton.fileBox.change(function(e) {
				localUrlBox.val(uploadbutton.fileBox.val());
			});
			if (allowFileManager) {
				viewServerBtn.click(function(e) {
					self.loadPlugin('filemanager', function() {
						self.plugin.filemanagerDialog({
							viewType : 'VIEW',
							dirName : 'image',
							clickFn : function(url, title) {
								if (self.dialogs.length > 1) {
									K('[name="url"]', div).val(url);
									self.hideDialog();
								}
							}
						});
					});
				});
			} else {
				viewServerBtn.hide();
			}
			urlBox.val('http://');
			var img = self.plugin.getSelectedImage();
			if (img) {
				urlBox.val(img.attr('data-ke-src'));
				widthBox.val(img.width());
				heightBox.val(img.height());
				titleBox.val(img.attr('title'));
				alignBox.each(function() {
					if (this.value === img.attr('align')) {
						this.checked = true;
						return false;
					}
				});
			}
			urlBox[0].focus();
			urlBox[0].select();
		},
		'delete' : function() {
			self.plugin.getSelectedImage().remove();
		}
	};
	self.clickToolbar(name, self.plugin.image.edit);
});
