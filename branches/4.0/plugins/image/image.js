
KindEditor.plugin('image', function(K) {
	var self = this, name = 'image',
		allowUpload = K.undef(self.allowUpload, true),
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
				//hidden iframe
				'<iframe name="uploadIframe" style="display:none;"></iframe>',
				//form start
				'<form class="ke-form" name="uploadForm" method="post" enctype="multipart/form-data" target="uploadIframe">',
				//url or file
				'<div class="ke-dialog-row">',
				'<div class="tab1" style="display:none;">',
				'<label for="keUrl">' + lang.remoteUrl + '</label>',
				'<input type="text" id="keUrl" class="ke-input-text" name="url" value="" style="width:200px;" /> &nbsp;',
				'<span class="ke-button-common ke-button-outer">',
				'<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
				'</span>',
				'</div>',
				'<div class="tab2" style="display:none;">',
				'<label for="keFile">' + lang.localUrl + '</label>',
				'<span class="ke-inline-block ke-upload-area">',
				'<input type="text" name="localUrl" class="ke-input-text" tabindex="-1" style="width:200px;" readonly="true" /> &nbsp;',
				'<span class="ke-button-common ke-button-outer">',
				'<input type="button" class="ke-button-common ke-button" value="' + lang.viewServer + '" tabindex="-1" />',
				'</span>',
				'<input type="file" class="ke-upload-file" id="keFile" name="imgFile" />',
				'</span>',
				'</div>',
				'</div>',
				//size
				'<div class="ke-dialog-row">',
				'<label for="keWidth">' + lang.size + '</label>',
				lang.width + ' <input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="4" /> ',
				lang.height + ' <input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" /> ',
				'<img src="' + imgPath + 'refresh.gif" width="16" height="16" alt="" />',
				'</div>',
				//align
				'<div class="ke-dialog-row">',
				'<label>' + lang.align + '</label>',
				'<input type="radio" name="align" class="ke-inline-block" value="" checked="checked" /> <img name="defaultImg" src="' + imgPath + 'align_top.gif" width="23" height="25" alt="" />',
				' <input type="radio" name="align" class="ke-inline-block" value="left" /> <img name="leftImg" src="' + imgPath + 'align_left.gif" width="23" height="25" alt="" />',
				' <input type="radio" name="align" class="ke-inline-block" value="right" /> <img name="rightImg" src="' + imgPath + 'align_right.gif" width="23" height="25" alt="" />',
				'</div>',
				//title
				'<div class="ke-dialog-row">',
				'<label for="keTitle">' + lang.imgTitle + '</label>',
				'<input type="text" id="keTitle" class="ke-input-text" name="title" value="" style="width:95%;" /></div>',
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
							iframe.bind('load', function() {
								iframe.unbind();
								var data = {}, str = K.iframeDoc(iframe).body.innerHTML;
								try {
									data = K.json(str);
								} catch (e) {
									alert(K.DEBUG ? str : self.lang('invalidJson'));
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
						self.exec('insertimage', url, title, width, height, 0, align).hideDialog().focus();
					}
				}
			}),
			div = dialog.div,
			tabs = K.tabs({
				parent : K('.tabs', div),
				afterSelect : function(i) {
				
				}
			});
			tabs.add({
				title : lang.remoteImage,
				panel : K('.tab1', div)
			});
			if (allowUpload) {
				tabs.add({
					title : lang.localImage,
					panel : K('.tab2', div)
				});
			}
			tabs.select(0);
			var urlBox = K('[name="url"]', div),
				localUrlBox = K('[name="localUrl"]', div),
				fileBox = K('[name="imgFile"]', div),
				viewServerBtn = K('[name="viewServer"]', div),
				widthBox = K('[name="width"]', div),
				heightBox = K('[name="height"]', div),
				titleBox = K('[name="title"]', div),
				alignBox = K('[name="align"]');
			fileBox.change(function(e) {
				localUrlBox.val(fileBox.val());
			});
			if (allowFileManager) {
				viewServerBtn.click(function(e) {
					self.loadPlugin('filemanager', function() {
						self.plugin.filemanagerDialog({
							viewType : 'VIEW',
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
				urlBox.width(300);
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
