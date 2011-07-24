
KindEditor.plugin('flash', function(K) {
	var self = this, name = 'flash',
		lang = self.lang(name + '.');
	function getSelectedFlash() {
		var range = self.edit.cmd.range,
			sc = range.startContainer, so = range.startOffset;
		if (!K.WEBKIT && !range.isControl()) {
			return null;
		}
		var img = K(sc.childNodes[so]);
		if (img.name !== 'img' || img[0].className !== 'ke-flash') {
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
			var img = getSelectedFlash();
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
			getSelectedFlash().remove();
		}
	};
	self.clickToolbar(name, functions.edit);
	// add contextmenu
	K.each(('edit,delete').split(','), function(i, val) {
		self.addContextmenu({
			title : self.lang(val + 'Flash'),
			click : function() {
				functions[val]();
				self.hideMenu();
			},
			cond : getSelectedFlash,
			width : 150,
			iconClass : val == 'edit' ? 'ke-icon-flash' : undefined
		});
	});
	self.addContextmenu({ title : '-' });
	// add HTML hooks
	self.afterGetHtml(function(html) {
		return html.replace(/<img[^>]*class="?ke-flash"?[^>]*>/ig, function(full) {
			var attrs = K.mediaAttrs(full);
			delete attrs['data-ke-src'];
			return K.mediaEmbed(attrs);
		});
	});
	self.beforeSetHtml(function(html) {
		return html.replace(/<embed[^>]*type="application\/x-shockwave-flash"[^>]*>(?:<\/embed>)?/ig, function(full) {
			var attrs = K.getAttrList(full);
			attrs.src = K.undef(attrs.src, '');
			attrs.type = 'application/x-shockwave-flash';
			attrs.width = K.undef(attrs.width, 0);
			attrs.height = K.undef(attrs.height, 0);
			return K.mediaImg(self.themesPath + 'common/blank.gif', attrs);
		});
	});
});
