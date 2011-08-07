
function KUploadButton(options) {
	this.init(options);
}
_extend(KUploadButton, {
	init : function(options) {
		var self = this,
			button = K(options.button),
			fieldName = options.fieldName || 'file',
			url = options.url || '',
			title = button.val(),
			cls = button[0].className || '',
			target = 'kindeditor_upload_iframe_' + new Date().getTime();

		var html = [
			'<div class="ke-inline-block ' + cls + '">',
			'<iframe name="' + target + '" style="display:none;"></iframe>',
			'<form class="ke-inline-block ke-form" method="post" enctype="multipart/form-data" target="' + target + '" action="' + url + '">',
			'<span class="ke-inline-block ke-upload-area">',
			'<span class="ke-button-common ke-button-outer">',
			'<input type="button" class="ke-button-common ke-button" value="' + title + '" />',
			'</span>',
			'<input type="file" class="ke-upload-file" name="' + fieldName + '" tabindex="-1" />',
			'</span></form>',
			'</iframe></div>'].join('');

		var div = K(html, button.doc);
		button.hide();
		button.before(div);
		
		self.div = div;
		self.button = button;
		self.iframe = K('iframe', div);
		self.form = K('form', div);
		self.fileBox = K('.ke-upload-file', div).width(K('.ke-button-outer').width());
		self.options = options;
	},
	submit : function() {
		var self = this,
			iframe = self.iframe;
		iframe.bind('load', function() {
			iframe.unbind();
			var data = {}, str = K.iframeDoc(iframe).body.innerHTML;
			try {
				data = K.json(str);
			} catch (e) {
				alert(K.DEBUG ? str : self.lang('invalidJson'));
			}
			self.options.afterUpload.call(self, data);
		});
		self.form[0].submit();
		return self;
	},
	remove : function() {
		var self = this;
		if (self.fileBox) {
			self.fileBox.unbind();
		}
		self.div.remove();
		self.button.show();
		return self;
	}
});

function _uploadbutton(options) {
	return new KUploadButton(options);
}

K.uploadbutton = _uploadbutton;
