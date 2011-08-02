
KindEditor.plugin('lineheight', function(K) {
	var self = this, name = 'lineheight';
	self.clickToolbar('lineheight', function() {
		var curVal = '', commonNode = self.cmd.commonNode({'*' : '.line-height'});
		if (commonNode) {
			curVal = commonNode.css('line-height');
		}
		var menu = self.createMenu({
			name : name,
			width : 150
		});
		var lineHeightTable = {
			'1' : '单倍行距',
			'1.5' : '1.5倍行距',
			'2' : '2倍行距',
			'2.5' : '2.5倍行距',
			'3' : '3倍行距'
		};
		K.each(lineHeightTable, function(key, val) {
			menu.addItem({
				title : '<span>' + val + '</span>',
				//height : _removeUnit(val) + 12,
				checked : curVal === key,
				click : function() {
					self.cmd.toggle('<span style="line-height:' + key + ';"></span>', {
						span : '.line-height=' + key
					});
					self.updateState();
					self.addBookmark();
					self.hideMenu();
				}
			});
		});
	});
});
