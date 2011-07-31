
KindEditor.plugin('preview', function(K) {
	var self = this, name = 'preview', undefined;
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = '<div style="padding:10px 20px;">' +
				'<iframe class="ke-plugin-preview-iframe" frameborder="0"></iframe>' +
				'</div>',
			dialog = self.createDialog({
				name : name,
				width : 750,
				title : self.lang(name),
				body : html,
				noBtn : {
					name : self.lang('close'),
					click : function(e) {
						self.hideDialog().focus();
					}
				}
			}),
			div = dialog.div,
			iframe = K('iframe', div.get());
		var doc = K.iframeDoc(iframe);
		doc.open();
		doc.write(self.html(undefined, true));
		doc.close();
		doc.body.contentEditable = 'false';
		K(doc.body).css('background-color', '#FFF');
		iframe[0].contentWindow.focus();
	});
});
