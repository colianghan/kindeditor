
KindEditor.plugin('flash', function(K) {
	var self = this, name = 'flash', lang = self.lang(name + '.');
	self.plugin.flash = {
		edit : function() {
			var html = [
				'<div style="padding:10px 20px;">',
				//url
				'<div class="ke-dialog-row">',
				'<label for="keUrl">' + lang.url + '</label>',
				'<input class="ke-input-text" type="text" id="keUrl" name="url" value="" style="width:90%;" />',
				'</div>',
				//width
				'<div class="ke-dialog-row">',
				'<label for="keWidth">' + lang.width + '</label>',
				'<input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="550" maxlength="4" /> ',
				'</div>',
				//height
				'<div class="ke-dialog-row">',
				'<label for="keHeight">' + lang.height + '</label>',
				'<input type="text" id="keHeight" class="ke-input-text ke-input-number" name="height" value="400" maxlength="4" /> ',
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
			div = dialog.div,
			urlBox = K('[name="url"]', div),
			widthBox = K('[name="width"]', div),
			heightBox = K('[name="height"]', div);
			urlBox.val('http://');
			var img = self.plugin.getSelectedFlash();
			if (img) {
				var attrs = K.mediaAttrs(img.attr('data-ke-tag'));
				urlBox.val(attrs.src);
				widthBox.val(K.removeUnit(img.css('width')) || attrs.width || 0);
				heightBox.val(K.removeUnit(img.css('height')) || attrs.height || 0);
			}
			urlBox[0].focus();
			urlBox[0].select();
		},
		'delete' : function() {
			self.plugin.getSelectedFlash().remove();
		}
	};
	self.clickToolbar(name, self.plugin.flash.edit);
});
