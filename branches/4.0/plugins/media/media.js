
KindEditor.plugin('media', function(K) {
	var self = this, name = 'media',
		lang = self.lang(name + '.');
	function getSelectedMedia() {
		var range = self.edit.cmd.range,
			sc = range.startContainer, so = range.startOffset;
		if (!K.WEBKIT && !range.isControl()) {
			return null;
		}
		var img = K(sc.childNodes[so]);
		if (img.name !== 'img' || !/^ke-\w+$/.test(img[0].className)) {
			return null;
		}
		return img;
	}
	var functions = {
		edit : function() {
			var html = [
				'<div style="padding:10px 20px;">',
				//url
				'<div class="ke-dialog-row">',
				'<label for="keUrl">' + lang.url + '</label>',
				'<input type="text" id="keUrl" class="ke-input-text" name="url" value="" style="width:90%;" />',
				'</div>',
				//width
				'<div class="ke-dialog-row">',
				'<label for="keWidth">' + lang.width + '</label>',
				'<input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="550" maxlength="4" />',
				'</div>',
				//height
				'<div class="ke-dialog-row">',
				'<label for="keHeight">' + lang.height + '</label>',
				'<input type="text" id="keHeight" class="ke-input-text ke-input-number" name="height" value="400" maxlength="4" />',
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
			urlBox.val('http://');
			var img = getSelectedMedia();
			if (img) {
				var attrs = K.mediaAttrs(img.attr('kesrctag'));
				urlBox.val(attrs.src);
				widthBox.val(K.removeUnit(img.css('width')) || attrs.width || 0);
				heightBox.val(K.removeUnit(img.css('height')) || attrs.height || 0);
				autostartBox[0].checked = (attrs.autostart === 'true');
			}
			urlBox[0].focus();
			urlBox[0].select();
		},
		'delete' : function() {
			getSelectedMedia().remove();
		}
	};
	self.clickToolbar(name, functions.edit);
	K.each(('edit,delete').split(','), function(i, val) {
		self.addContextmenu({
			title : self.lang(val + 'Media'),
			click : function() {
				functions[val]();
				self.hideMenu();
			},
			cond : getSelectedMedia,
			width : 150,
			iconClass : val == 'edit' ? 'ke-icon-media' : undefined
		});
	});
	self.addContextmenu({ title : '-' });
});
