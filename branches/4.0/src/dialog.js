
function _button(arg) {
	arg = arg || {};
	var name = arg.name || '',
		span = K('<span class="ke-button-common ke-button-outer" title="' + name + '"></span>'),
		btn = K('<input class="ke-button-common ke-button" type="button" value="' + name + '" />');
	if (arg.click) {
		btn.click(arg.click);
	}
	span.append(btn);
	return span;
}

// create KToolbar class
function KDialog(options) {
	this.init(options);
}
_extend(KDialog, KWidget, {
	init : function(options) {
		var self = this;
		options.z = options.z || 811213;
		KDialog.parent.init.call(self, options);
		var title = options.title,
			body = K(options.body, self.doc),
			previewBtn = options.previewBtn,
			yesBtn = options.yesBtn,
			noBtn = options.noBtn,
			closeBtn = options.closeBtn,
			shadowMode = _undef(options.shadowMode, true),
			showMask = _undef(options.showMask, true);

		self.div.addClass('ke-dialog').bind('click,mousedown', function(e){
			e.stopPropagation();
		}).addClass('ke-dialog-' + (shadowMode ? '' : 'no-') + 'shadow');

		var headerDiv = K('<div class="ke-dialog-header"></div>');
		self.div.append(headerDiv);
		headerDiv.html(title);
		self.closeIcon = K('<span class="ke-dialog-icon-close" title="' + closeBtn.name + '"></span>').click(closeBtn.click);
		headerDiv.append(self.closeIcon);
		self.draggable({
			clickEl : headerDiv,
			beforeDrag : options.beforeDrag
		});
		var bodyDiv = K('<div class="ke-dialog-body"></div>');
		self.div.append(bodyDiv);
		bodyDiv.append(body);
		var footerDiv = K('<div class="ke-dialog-footer"></div>');
		if (previewBtn || yesBtn || noBtn) {
			self.div.append(footerDiv);
		}
		_each([
			{ btn : previewBtn, name : 'preview' },
			{ btn : yesBtn, name : 'yes' },
			{ btn : noBtn, name : 'no' }
		], function() {
			if (this.btn) {
				var button = _button(this.btn);
				button.addClass('ke-dialog-' + this.name);
				footerDiv.append(button);
			}
		});
		if (self.height) {
			bodyDiv.height(_removeUnit(self.height) - headerDiv.height() - footerDiv.height());
		}
		self.mask = null;
		if (showMask) {
			var docEl = self.doc.documentElement,
				docWidth = Math.max(docEl.scrollWidth, docEl.clientWidth),
				docHeight = Math.max(docEl.scrollHeight, docEl.clientHeight);
			self.mask = _widget({
				x : 0,
				y : 0,
				z : self.z - 1,
				cls : 'ke-dialog-mask',
				width : docWidth,
				height : docHeight
			});
		}
		self.autoPos(self.div.width(), self.div.height());
		self.footerDiv = footerDiv;
		self.bodyDiv = bodyDiv;
		self.headerDiv = headerDiv;
	},
	remove : function() {
		var self = this;
		if (self.mask) {
			self.mask.remove();
		}
		self.closeIcon.remove();
		K('input', self.div).remove();
		self.footerDiv.remove();
		self.bodyDiv.remove();
		self.headerDiv.remove();
		KDialog.parent.remove.call(self);
		return self;
	}
});

function _dialog(options) {
	return new KDialog(options);
}

K.button = _button;
K.dialog = _dialog;
