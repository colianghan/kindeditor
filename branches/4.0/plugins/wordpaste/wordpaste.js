
KindEditor.plugin('wordpaste', function(K) {
	var self = this, name = 'wordpaste';
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			html = '<div style="margin:10px 20px;">' +
				'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
				'<iframe class="ke-plugin-wordpaste-iframe" frameborder="0"></iframe>' +
				'</div>',
			dialog = self.createDialog({
				name : name,
				width : 450,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var str = doc.body.innerHTML;
						str = str.replace(/<meta(\n|.)*?>/ig, '');
						str = str.replace(/<!(\n|.)*?>/ig, '');
						str = str.replace(/<style[^>]*>(\n|.)*?<\/style>/ig, '');
						str = str.replace(/<script[^>]*>(\n|.)*?<\/script>/ig, '');
						str = str.replace(/<w:[^>]+>(\n|.)*?<\/w:[^>]+>/ig, '');
						str = str.replace(/<xml>(\n|.)*?<\/xml>/ig, '');
						str = str.replace(/\r\n|\n|\r/ig, '');
						self.insertHtml(str).hideDialog().focus();
					}
				}
			}),
			div = dialog.div(),
			iframe = K('iframe', div.get());
		var doc = K.iframeDoc(iframe);
		if (!K.IE) {
			doc.designMode = 'on';
		}
		doc.open();
		doc.write('<html><head><title>WordPaste</title></head>');
		doc.write('<body style="background-color:#FFFFFF;font-size:12px;margin:2px;" />');
		if (!K.IE) {
			doc.write('<br />');
		}
		doc.write('</body></html>');
		doc.close();
		if (K.IE) {
			doc.body.contentEditable = 'true';
		}
		iframe.get().contentWindow.focus();
	});
});
