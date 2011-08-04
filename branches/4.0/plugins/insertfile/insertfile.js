
KindEditor.plugin('insertfile', function(K) {
	var self = this, name = 'insertfile',
	allowFileManager = K.undef(self.allowFileManager, false),
	uploadJson = K.undef(self.imageUploadJson, self.basePath + 'php/upload_json.php?type=123'),
	lang = self.lang(name + '.');
	self.clickToolbar(name, function() {
		var html = [
		'<div style="padding:10px 20px;">',
		//tabs
		'<div class="tabs"></div>',
		//hidden iframe
		'<iframe name="uploadIframe" style="display:none;"></iframe>',
		//form start
		'<form class="ke-form" name="uploadForm" method="post" enctype="multipart/form-data" target="uploadIframe">',
		//file
		'<div class="ke-dialog-row">',
		'<label for="keUrl" style="width:60px;">' + lang.url + '</label>',
		'<span class="ke-inline-block ke-upload-area">',
		'<input type="text" id="keUrl" name="url" class="ke-input-text" style="width:160px;" /> &nbsp;',
		'<span class="ke-button-common ke-button-outer">',
		'<input type="button" class="ke-button-common ke-button" value="' + lang.upload + '" tabindex="-1" />',
		'</span>',
		'<input type="file" class="ke-upload-file" name="imgFile" />',
		'</span> &nbsp;',
		'<span class="ke-button-common ke-button-outer">',
		'<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
		'</span>',
		'</div>',
		//title
		'<div class="ke-dialog-row">',
		'<label for="keTitle" style="width:60px;">' + lang.title + '</label>',
		'<input type="text" id="keTitle" class="ke-input-text" name="title" value="" style="width:250px;" /></div>',
		'</div>',
		//form end
		'</form>',
		'</div>'
		].join('');
		var dialog = self.createDialog({
			name : name,
			width : 500,
			height : 180,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var url = urlBox.val(),
						title = titleBox.val();
					if (K.trim(title) === '') {
						title = url;
					}
					var html = '<a href="' + url + '" data-ke-src="' + url + '" target="_blank">' + title + '</a>';
					self.insertHtml(html).hideDialog().focus();
				}
			}
		}),
		div = dialog.div;
		var urlBox = K('[name="url"]', div),
			fileBox = K('[name="imgFile"]', div),
			viewServerBtn = K('[name="viewServer"]', div),
			titleBox = K('[name="title"]', div);
		fileBox.change(function(e) {
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
				if (data.error === 0) {
					urlBox.val(K.formatUrl(data.url, 'absolute'));
				} else {
					alert(data.message);
				}
			});
			form[0].submit();
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
			urlBox.width(250);
		}
		urlBox.val('http://');
		urlBox[0].focus();
		urlBox[0].select();
	});
});
