
KindEditor.plugin('pagebreak', function(K) {
	var self = this, name = 'pagebreak', lang = self.lang(name + '.');
	self.clickToolbar(name, function() {
		self.focus();
		self.cmd.split(true);
		self.insertHtml('<hr class="ke-pagebreak" style="page-break-after: always;" />');
	});
});
