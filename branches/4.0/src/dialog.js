
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

function _dialog(options) {
	options.z = options.z || 811213;
	var self = _widget(options),
		remove = self.remove,
		width = _addUnit(options.width),
		height = _addUnit(options.height),
		doc = self.doc,
		div = self.div(),
		title = options.title,
		body = K(options.body, doc),
		previewBtn = options.previewBtn,
		yesBtn = options.yesBtn,
		noBtn = options.noBtn,
		closeBtn = options.closeBtn,
		shadowMode = _undef(options.shadowMode, true),
		showMask = _undef(options.showMask, true),
		docEl = doc.documentElement,
		docWidth = Math.max(docEl.scrollWidth, docEl.clientWidth),
		docHeight = Math.max(docEl.scrollHeight, docEl.clientHeight);
	//create dialog
	div.addClass('ke-dialog').bind('click,mousedown', function(e){
		e.stopPropagation();
	});
	div.addClass('ke-dialog-' + (shadowMode ? '' : 'no-') + 'shadow');
	var headerDiv = K('<div class="ke-dialog-header"></div>');
	div.append(headerDiv);
	headerDiv.html(title);
	var span = K('<span class="ke-dialog-icon-close" title="' + closeBtn.name + '"></span>').click(closeBtn.click);
	headerDiv.append(span);
	self.draggable({
		clickEl : headerDiv,
		beforeDrag : options.beforeDrag
	});
	var bodyDiv = K('<div class="ke-dialog-body"></div>');
	div.append(bodyDiv);
	bodyDiv.append(body);
	var footerDiv = K('<div class="ke-dialog-footer"></div>');
	if (previewBtn || yesBtn || noBtn) {
		div.append(footerDiv);
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
	if (height) {
		bodyDiv.height(_removeUnit(height) - headerDiv.height() - footerDiv.height());
	}
	var mask = null;
	if (showMask) {
		mask = _widget({
			x : 0,
			y : 0,
			z : self.z - 1,
			cls : 'ke-dialog-mask',
			width : docWidth,
			height : docHeight
		});
	}
	//set dialog position
	self.resetPos(div.width(), div.height());
	//remove dialog
	self.remove = function() {
		if (mask) {
			mask.remove();
		}
		span.remove();
		K('input', div).remove();
		footerDiv.remove();
		bodyDiv.remove();
		headerDiv.remove();
		remove.call(self);
	};
	self.mask = function() {
		return mask;
	};
	return self;
}

K.button = _button;
K.dialog = _dialog;
