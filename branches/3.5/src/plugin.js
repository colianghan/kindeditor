
(function (KE, undefined) {

KE.plugin['about'] = {
	click : function(id) {
		KE.util.selection(id);
		var dialog = new KE.dialog({
			id : id,
			cmd : 'about',
			file : 'about.html?id=' + id + '&ver=' + KE.version,
			width : 300,
			height : 70,
			loadingMode : true,
			title : KE.lang['about'],
			noButton : KE.lang['close']
		});
		dialog.show();
	}
};

KE.plugin['undo'] = {
	init : function(id) {
		KE.event.ctrl(KE.g[id].iframeDoc, 'Z', function(e) {
			KE.plugin['undo'].click(id);
			KE.util.focus(id);
		});
		KE.event.ctrl(KE.g[id].newTextarea, 'Z', function(e) {
			KE.plugin['undo'].click(id);
			KE.util.focus(id);
		});
	},
	click : function(id) {
		KE.history.undo(id);
		KE.util.execOnchangeHandler(id);
	}
};

KE.plugin['redo'] = {
	init : function(id) {
		KE.event.ctrl(KE.g[id].iframeDoc, 'Y', function(e) {
			KE.plugin['redo'].click(id);
			KE.util.focus(id);
		});
		KE.event.ctrl(KE.g[id].newTextarea, 'Y', function(e) {
			KE.plugin['redo'].click(id);
			KE.util.focus(id);
		});
	},
	click : function(id) {
		KE.history.redo(id);
		KE.util.execOnchangeHandler(id);
	}
};

KE.plugin['cut'] = {
	click : function(id) {
		try {
			if (!KE.g[id].iframeDoc.queryCommandSupported('cut')) throw 'e';
		} catch(e) {
			alert(KE.lang.cutError);
			return;
		}
		KE.util.execCommand(id, 'cut', null);
	}
};

KE.plugin['copy'] = {
	click : function(id) {
		try {
			if (!KE.g[id].iframeDoc.queryCommandSupported('copy')) throw 'e';
		} catch(e) {
			alert(KE.lang.copyError);
			return;
		}
		KE.util.execCommand(id, 'copy', null);
	}
};

KE.plugin['paste'] = {
	click : function(id) {
		try {
			if (!KE.g[id].iframeDoc.queryCommandSupported('paste')) throw 'e';
		} catch(e) {
			alert(KE.lang.pasteError);
			return;
		}
		KE.util.execCommand(id, 'paste', null);
	}
};

KE.plugin['plainpaste'] = {
	click : function(id) {
		KE.util.selection(id);
		this.dialog = new KE.dialog({
			id : id,
			cmd : 'plainpaste',
			file : 'plainpaste.html?id=' + id + '&ver=' + KE.version,
			width : 400,
			height : 300,
			loadingMode : true,
			title : KE.lang['plainpaste'],
			yesButton : KE.lang['yes'],
			noButton : KE.lang['no']
		});
		this.dialog.show();
	},
	exec : function(id) {
		var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
		var html = KE.$('textArea', dialogDoc).value;
		html = KE.util.escape(html);
		html = html.replace(/ /g, '&nbsp;');
		html = html.replace(/\r\n|\n|\r/g, "<br />$&");
		KE.util.insertHtml(id, html);
		KE.layout.hide(id);
		KE.util.focus(id);
	}
};

KE.plugin['wordpaste'] = {
	click : function(id) {
		KE.util.selection(id);
		this.dialog = new KE.dialog({
			id : id,
			cmd : 'wordpaste',
			file : 'wordpaste.html?id=' + id + '&ver=' + KE.version,
			width : 400,
			height : 300,
			loadingMode : true,
			title : KE.lang['wordpaste'],
			yesButton : KE.lang['yes'],
			noButton : KE.lang['no']
		});
		this.dialog.show();
	},
	exec : function(id) {
		var htmlTags = {
			font : ['color', 'size', 'face', '.background-color'],
			span : [
				'.color', '.background-color', '.font-size', '.font-family', '.background',
				'.font-weight', '.font-style', '.text-decoration', '.vertical-align'
			],
			div : [
				'align', '.border', '.margin', '.padding', '.text-align', '.color',
				'.background-color', '.font-size', '.font-family', '.font-weight', '.background',
				'.font-style', '.text-decoration', '.vertical-align', '.margin-left'
			],
			table: [
				'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align',
				'.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
				'.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background'
			],
			'td,th': [
				'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
				'.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
				'.font-style', '.text-decoration', '.vertical-align', '.background'
			],
			a : ['href', 'target', 'name'],
			embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', '/'],
			img : ['src', 'width', 'height', 'border', 'alt', 'title', '.width', '.height', '/'],
			hr : ['/'],
			br : ['/'],
			'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
				'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
				'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
			],
			'tbody,tr,strong,b,sub,sup,em,i,u,strike' : []
		};
		var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
		var wordIframe = KE.$('wordIframe', dialogDoc);
		var str = KE.util.getIframeDoc(wordIframe).body.innerHTML;
		str = str.replace(/<meta(\n|.)*?>/ig, "");
		str = str.replace(/<!(\n|.)*?>/ig, "");
		str = str.replace(/<style[^>]*>(\n|.)*?<\/style>/ig, "");
		str = str.replace(/<script[^>]*>(\n|.)*?<\/script>/ig, "");
		str = str.replace(/<w:[^>]+>(\n|.)*?<\/w:[^>]+>/ig, "");
		str = str.replace(/<xml>(\n|.)*?<\/xml>/ig, "");
		str = str.replace(/\r\n|\n|\r/ig, "");
		str = KE.util.execGetHtmlHooks(id, str);
		str = KE.format.getHtml(str, htmlTags, KE.g[id].urlType);
		KE.util.insertHtml(id, str);
		KE.layout.hide(id);
		KE.util.focus(id);
	}
};

KE.plugin['fullscreen'] = {
	click : function(id) {
		var g = KE.g[id];
		var self = this;
		var resetSize = function() {
			var el = KE.util.getDocumentElement();
			g.width = el.clientWidth + 'px';
			g.height = el.clientHeight + 'px';
		};
		var windowSize = '';
		var resizeListener = function() {
			if (!self.isSelected) return;
			var el = KE.util.getDocumentElement();
			var size = [el.clientWidth, el.clientHeight].join('');
			if (windowSize != size) {
				windowSize = size;
				resetSize();
				KE.util.resize(id, g.width, g.height);
			}
		}
		if (this.isSelected) {
			this.isSelected = false;
			KE.remove(id, 1);
			g.width = this.width;
			g.height = this.height;
			KE.create(id, 2);
			document.body.parentNode.style.overflow = 'auto';
			KE.event.remove(window, 'resize', resizeListener);
			g.resizeMode = g.config.resizeMode;
			KE.toolbar.unselect(id, "fullscreen");
		} else {
			this.isSelected = true;
			this.width = g.container.style.width;
			this.height = g.container.style.height;
			KE.remove(id, 2);
			document.body.parentNode.style.overflow = 'hidden';
			resetSize();
			KE.create(id, 1);
			var pos = KE.util.getScrollPos();
			var div = g.container;
			div.style.position = 'absolute';
			div.style.left = pos.x + 'px';
			div.style.top = pos.y + 'px';
			div.style.zIndex = 19811211;
			KE.event.add(window, 'resize', resizeListener);
			g.resizeMode = 0;
			KE.toolbar.select(id, "fullscreen");
		}
	}
};

KE.plugin['bgcolor'] = {
	click : function(id) {
		KE.util.selection(id);
		this.menu = new KE.menu({
			id : id,
			cmd : 'bgcolor'
		});
		this.menu.picker();
	},
	exec : function(id, value) {
		var cmd = new KE.cmd(id);
		if (value == '') {
			cmd.remove({
				'span' : ['.background-color']
			});
		} else {
			cmd.wrap('span', [{'.background-color': value}]);
		}
		KE.history.add(id, false);
		KE.util.execOnchangeHandler(id);
		this.menu.hide();
		KE.util.focus(id);
	}
};

KE.plugin['fontname'] = {
	click : function(id) {
		var fontName = KE.lang.plugins.fontname.fontName;
		var cmd = 'fontname';
		KE.util.selection(id);
		var menu = new KE.menu({
			id : id,
			cmd : cmd
		});
		KE.each(fontName, function(key, value) {
			var html = '<span style="font-family: ' + key + ';">' + value + '</span>';
			menu.add(html, function() { KE.plugin[cmd].exec(id, key); });
		});
		menu.show();
		this.menu = menu;
	},
	exec : function(id, value) {
		var cmd = new KE.cmd(id);
		cmd.wrap('span', [{'.font-family': value}]);
		KE.history.add(id, false);
		KE.util.execOnchangeHandler(id);
		this.menu.hide();
		KE.util.focus(id);
	}
};

KE.plugin['fontsize'] = {
	click : function(id) {
		var fontSize = ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'];
		var cmd = 'fontsize';
		KE.util.selection(id);
		var menu = new KE.menu({
			id : id,
			cmd : cmd
		});
		for (var i = 0, len = fontSize.length; i < len; i++) {
			var value = fontSize[i];
			var html = '<span style="font-size: ' + value + ';">' + value + '</span>';
			menu.add(html, (function(value) {
				return function() {
					KE.plugin[cmd].exec(id, value);
				};
			})(value), { height : (parseInt(value) + 12) + 'px' });
		}
		menu.show();
		this.menu = menu;
	},
	exec : function(id, value) {
		var cmd = new KE.cmd(id);
		cmd.wrap('span', [{'.font-size': value}]);
		KE.history.add(id, false);
		KE.util.execOnchangeHandler(id);
		this.menu.hide();
		KE.util.focus(id);
	}
};

KE.plugin['hr'] = {
	click : function(id) {
		KE.util.selection(id);
		KE.util.insertHtml(id, '<hr />');
		KE.util.focus(id);
	}
};

KE.plugin['print'] = {
	click : function(id) {
		KE.util.selection(id);
		KE.g[id].iframeWin.print();
	}
};

KE.plugin['removeformat'] = {
	click : function(id) {
		KE.util.selection(id);
		var cmd = new KE.cmd(id);
		var tags = {
			'*' : ['class', 'style']
		};
		for (var i = 0, len = KE.g[id].inlineTags.length; i < len; i++) {
			tags[KE.g[id].inlineTags[i]] = ['*'];
		}
		cmd.remove(tags);
		KE.history.add(id, false);
		KE.util.execOnchangeHandler(id);
		KE.toolbar.updateState(id);
		KE.util.focus(id);
	}
};

KE.plugin['source'] = {
	click : function(id) {
		var g = KE.g[id];
		if (!g.wyswygMode) {
			KE.util.setFullHtml(id, g.newTextarea.value);
			g.iframe.style.display = 'block';
			g.newTextarea.style.display = 'none';
			KE.toolbar.able(id, ['source', 'fullscreen']);
			g.wyswygMode = true;
			this.isSelected = false;
			KE.toolbar.unselect(id, "source");
		} else {
			KE.layout.hide(id);
			g.newTextarea.value = KE.util.getData(id);
			g.iframe.style.display = 'none';
			g.newTextarea.style.display = 'block';
			KE.toolbar.disable(id, ['source', 'fullscreen']);
			g.wyswygMode = false;
			this.isSelected = true;
			KE.toolbar.select(id, "source");
		}
		KE.util.focus(id);
	}
};

KE.plugin['textcolor'] = {
	click : function(id) {
		KE.util.selection(id);
		this.menu = new KE.menu({
			id : id,
			cmd : 'textcolor'
		});
		this.menu.picker();
	},
	exec : function(id, value) {
		var cmd = new KE.cmd(id);
		if (value == '') {
			cmd.remove({
				'span' : ['.color'],
				'font' : ['color']
			});
		} else {
			cmd.wrap('span', [{'.color': value}]);
		}
		KE.history.add(id, false);
		KE.util.execOnchangeHandler(id);
		this.menu.hide();
		KE.util.focus(id);
	}
};

KE.plugin['title'] = {
	click : function(id) {
		var lang = KE.lang.plugins.title;
		var title = {
			'H1' : lang.h1,
			'H2' : lang.h2,
			'H3' : lang.h3,
			'H4' : lang.h4,
			'P' : lang.p
		};
		var sizeHash = {
			'H1' : 32,
			'H2' : 24,
			'H3' : 18,
			'H4' : 14,
			'P' : 12
		};
		var cmd = 'title';
		KE.util.selection(id);
		var menu = new KE.menu({
			id : id,
			cmd : cmd
		});
		KE.each(title, function(key, value) {
			var style = 'font-size:' + sizeHash[key] + 'px;'
			if (key !== 'P') style += 'font-weight:bold;';
			var html = '<span style="' + style + '">' + value + '</span>';
			menu.add(html, function() {
				KE.plugin[cmd].exec(id, '<' + key + '>'); },
				{ height : (sizeHash[key] + 12) + 'px' }
			);
		});
		menu.show();
		this.menu = menu;
	},
	exec : function(id, value) {
		KE.util.select(id);
		KE.util.execCommand(id, 'formatblock', value);
		this.menu.hide();
		KE.util.focus(id);
	}
};

KE.plugin['emoticons'] = {
	click : function(id) {
		var cmd = 'emoticons';
		var rows = 9, cells = 15;
		KE.util.selection(id);
		var table = KE.$$('table');
		table.className = 'ke-plugin-emoticons-table';
		table.cellPadding = 0;
		table.cellSpacing = 2;
		table.border = 0;
		var num = 0;
		for (var i = 0; i < rows; i++) {
			var row = table.insertRow(i);
			for (var j = 0; j < cells; j++) {
				var cell = row.insertCell(j);
				cell.className = 'ke-plugin-emoticons-td';
				cell.onmouseover = function() {this.style.borderColor = '#000000'; }
				cell.onmouseout = function() {this.style.borderColor = '#F0F0EE'; }
				cell.onclick = (function(num) {
					return function() {
						KE.plugin[cmd].exec(id, num + '.gif');
					};
				})(num);
				var span = KE.$$('span');
				span.className = 'ke-plugin-emoticons-span';
				span.style.backgroundPosition = '-' + (24 * num) + 'px 0px';
				cell.appendChild(span);
				num++;
			}
		}
		var menu = new KE.menu({
			id : id,
			cmd : cmd
		});
		menu.append(table);
		menu.show();
		this.menu = menu;
	},
	exec : function(id, value) {
		var url = KE.g[id].pluginsPath + 'emoticons/' + value;
		var html = '<img src="' + url + '" kesrc="' + url + '" width="24" height="24" border="0" alt="" />';
		KE.util.insertHtml(id, html);
		this.menu.hide();
		KE.util.focus(id);
	}
};

KE.plugin['flash'] = {
	init : function(id) {
		var self = this;
		KE.g[id].getHtmlHooks.push(function(html) {
			return html.replace(/<img[^>]*class="?ke-flash"?[^>]*>/ig, function(imgStr) {
				var width = imgStr.match(/style="[^"]*;?\s*width:\s*(\d+)/i) ? RegExp.$1 : 0;
				var height = imgStr.match(/style="[^"]*;?\s*height:\s*(\d+)/i) ? RegExp.$1 : 0;
				width = width || (imgStr.match(/width="([^"]+)"/i) ? RegExp.$1 : 0);
				height = height || (imgStr.match(/height="([^"]+)"/i) ? RegExp.$1 : 0);
				if (imgStr.match(/kesrctag="([^"]+)"/i)) {
					var attrs = KE.util.getAttrList(unescape(RegExp.$1));
					attrs.width = width || attrs.width || 0;
					attrs.height = height || attrs.height || 0;
					attrs.kesrc = attrs.src;
					return KE.util.getMediaEmbed(attrs);
				}
			});
		});
		KE.g[id].setHtmlHooks.push(function(html) {
			return html.replace(/<embed[^>]*type="application\/x-shockwave-flash"[^>]*>(?:<\/embed>)?/ig, function($0) {
				var src = $0.match(/\s+src="([^"]+)"/i) ? RegExp.$1 : '';
				if ($0.match(/\s+kesrc="([^"]+)"/i)) src = RegExp.$1;
				var width = $0.match(/\s+width="([^"]+)"/i) ? RegExp.$1 : 0;
				var height = $0.match(/\s+height="([^"]+)"/i) ? RegExp.$1 : 0;
				var attrs = KE.util.getAttrList($0);
				attrs.src = src;
				attrs.width = width;
				attrs.height = height;
				return KE.util.getMediaImage(id, 'flash', attrs);
			});
		});
	},
	click : function(id) {
		KE.util.selection(id);
		this.dialog = new KE.dialog({
			id : id,
			cmd : 'flash',
			file : 'flash.html?id=' + id + '&ver=' + KE.version,
			width : 400,
			height : 140,
			loadingMode : true,
			title : KE.lang['flash'],
			yesButton : KE.lang['yes'],
			noButton : KE.lang['no']
		});
		this.dialog.show();
	},
	check : function(id, url, width, height) {
		var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
		if (!url.match(/^.{3,}$/)) {
			alert(KE.lang['invalidUrl']);
			KE.$('url', dialogDoc).focus();
			return false;
		}
		if (!width.match(/^\d*$/)) {
			alert(KE.lang['invalidWidth']);
			KE.$('width', dialogDoc).focus();
			return false;
		}
		if (!height.match(/^\d*$/)) {
			alert(KE.lang['invalidHeight']);
			KE.$('height', dialogDoc).focus();
			return false;
		}
		return true;
	},
	exec : function(id) {
		var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
		var url = KE.$('url', dialogDoc).value;
		var width = KE.$('width', dialogDoc).value;
		var height = KE.$('height', dialogDoc).value;
		if (!this.check(id, url, width, height)) return false;
		var html = KE.util.getMediaImage(id, 'flash', {
			src : url,
			type : KE.g[id].mediaTypes['flash'],
			width : width,
			height : height,
			quality : 'high'
		});
		KE.util.insertHtml(id, html);
		KE.layout.hide(id);
		KE.util.focus(id);
	}
};

KE.plugin['image'] = {
	getSelectedNode : function(id) {
		var g = KE.g[id];
		var startNode = g.keRange.startNode;
		var endNode = g.keRange.endNode;
		if (!KE.browser.WEBKIT && !g.keSel.isControl) return;
		if (startNode.nodeType != 1) return;
		if (startNode.tagName.toLowerCase() != 'img') return;
		if (startNode != endNode) return;
		if (!startNode.className.match(/^ke-\w+/i)) return startNode;
	},
	init : function(id) {
		var self = this;
		var g = KE.g[id];
		g.contextmenuItems.push({
			text : KE.lang['editImage'],
			click : function(id, menu) {
				KE.util.select(id);
				menu.hide();
				self.click(id);
			},
			cond : function(id) {
				return self.getSelectedNode(id);
			},
			options : {
				iconHtml : '<span class="ke-common-icon ke-common-icon-url ke-icon-image"></span>'
			}
		});
		g.contextmenuItems.push({
			text : KE.lang['deleteImage'],
			click : function(id, menu) {
				KE.util.select(id);
				menu.hide();
				var img = self.getSelectedNode(id);
				img.parentNode.removeChild(img);
			},
			cond : function(id) {
				return self.getSelectedNode(id);
			}
		});
	},
	click : function(id) {
		KE.util.selection(id);
		this.dialog = new KE.dialog({
			id : id,
			cmd : 'image',
			file : 'image/image.html?id=' + id + '&ver=' + KE.version,
			width : 400,
			height : 230,
			loadingMode : true,
			title : KE.lang['image'],
			yesButton : KE.lang['yes'],
			noButton : KE.lang['no']
		});
		this.dialog.show();
	},
	check : function(id) {
		var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
		var type = KE.$('type', dialogDoc).value;
		var width = KE.$('imgWidth', dialogDoc).value;
		var height = KE.$('imgHeight', dialogDoc).value;
		var title = KE.$('imgTitle', dialogDoc).value;
		var urlBox;
		if (type == 2) {
			urlBox = KE.$('imgFile', dialogDoc);
		} else {
			urlBox = KE.$('url', dialogDoc);
		}
		if (!urlBox.value.match(/\.(jpg|jpeg|gif|bmp|png)(\s|$)/i)) {
			alert(KE.lang['invalidImg']);
			urlBox.focus();
			return false;
		}
		if (!width.match(/^\d*$/)) {
			alert(KE.lang['invalidWidth']);
			KE.$('imgWidth', dialogDoc).focus();
			return false;
		}
		if (!height.match(/^\d*$/)) {
			alert(KE.lang['invalidHeight']);
			KE.$('imgHeight', dialogDoc).focus();
			return false;
		}
		return true;
	},
	exec : function(id) {
		var self = this;
		var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
		var type = KE.$('type', dialogDoc).value;
		var width = KE.$('imgWidth', dialogDoc).value;
		var height = KE.$('imgHeight', dialogDoc).value;
		var title = KE.$('imgTitle', dialogDoc).value;
		var alignElements = dialogDoc.getElementsByName('align');
		var align = '';
		for (var i = 0, len = alignElements.length; i < len; i++) {
			if (alignElements[i].checked) {
				align = alignElements[i].value;
				break;
			}
		}
		if (!this.check(id)) return false;
		if (type == 2) {
			KE.$('editorId', dialogDoc).value = id;
			var uploadIframe = KE.$('uploadIframe', dialogDoc);
			KE.util.showLoadingPage(id);
			var onloadFunc = function() {
				KE.event.remove(uploadIframe, 'load', onloadFunc);
				KE.util.hideLoadingPage(id);
				var uploadDoc = KE.util.getIframeDoc(uploadIframe);
				var data = '';
				try {
					data = KE.util.parseJson(uploadDoc.body.innerHTML);
				} catch(e) {
					alert(KE.lang.invalidJson);
				}
				if (typeof data === 'object' && 'error' in data) {
					if (data.error === 0) {
						self.insert(id, data.url, title, width, height, 0, align);
					} else {
						alert(data.message);
						return false;
					}
				}
			};
			KE.event.add(uploadIframe, 'load', onloadFunc);
			dialogDoc.uploadForm.submit();
			return;
		} else {
			var url = KE.$('url', dialogDoc).value;
			this.insert(id, url, title, width, height, 0, align);
		}
	},
	insert : function(id, url, title, width, height, border, align) {
		var html = '<img src="' + url + '" kesrc="' + url + '" ';
		if (width > 0) html += 'width="' + width + '" ';
		if (height > 0) html += 'height="' + height + '" ';
		if (title) html += 'title="' + title + '" ';
		if (align) html += 'align="' + align + '" ';
		html += 'alt="' + title + '" ';
		html += 'border="' + border + '" />';
		KE.util.insertHtml(id, html);
		KE.layout.hide(id);
		KE.util.focus(id);
	}
};

KE.plugin['link'] = {
	getSelectedNode : function(id) {
		var g = KE.g[id];
		var range = g.keRange;
		var startNode = range.startNode;
		var startPos = range.startPos;
		var endNode = range.endNode;
		var endPos = range.endPos;
		var inlineTagHash = KE.util.arrayToHash(g.inlineTags);
		var findLinkNode = function(node) {
			while (node) {
				if (node.nodeType == 1) {
					var tagName = node.tagName.toLowerCase();
					if (tagName == 'a') return node;
				}
				node = node.parentNode;
			}
			return null;
		};
		var startLink = findLinkNode(startNode);
		var endLink = findLinkNode(endNode);
		if (startLink && endLink && startLink === endLink) {
			return startLink;
		}
	},
	init : function(id) {
		var self = this;
		KE.g[id].contextmenuItems.push({
			text : KE.lang['editLink'],
			click : function(id, menu) {
				KE.util.select(id);
				menu.hide();
				self.click(id);
			},
			cond : function(id) {
				return self.getSelectedNode(id);
			},
			options : {
				iconHtml : '<span class="ke-common-icon ke-common-icon-url ke-icon-link"></span>'
			}
		});
	},
	click : function(id) {
		KE.util.selection(id);
		this.dialog = new KE.dialog({
			id : id,
			cmd : 'link',
			file : 'link/link.html?id=' + id + '&ver=' + KE.version,
			width : 400,
			height : 100,
			loadingMode : true,
			title : KE.lang['link'],
			yesButton : KE.lang['yes'],
			noButton : KE.lang['no']
		});
		this.dialog.show();
	},
	exec : function(id) {
		var g = KE.g[id];
		KE.util.select(id);
		var range = g.keRange;
		var startNode = range.startNode;
		var endNode = range.endNode;
		var iframeDoc = g.iframeDoc;
		var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
		var url = KE.$('hyperLink', dialogDoc).value;
		var target = KE.$('linkType', dialogDoc).value;
		if (!url.match(/.+/) || url.match(/^\w+:\/\/\/?$/)) {
			alert(KE.lang['invalidUrl']);
			KE.$('hyperLink', dialogDoc).focus();
			return false;
		}
		var node = range.getParentElement();
		while (node) {
			if (node.tagName.toLowerCase() == 'a' || node.tagName.toLowerCase() == 'body') break;
			node = node.parentNode;
		}
		node = node.parentNode;
		var isItem = (startNode.nodeType == 1 && startNode === endNode);
		var isEmpty = !isItem;
		if (!isItem) isEmpty = KE.browser.IE ? g.range.text === '' : g.range.toString() === '';
		if (isEmpty || KE.util.isEmpty(id)) {
			var html = '<a href="' + url + '"';
			if (target) html += ' target="' + target + '"';
			html += '>' + url + '</a>';
			KE.util.insertHtml(id, html);
		} else {
			iframeDoc.execCommand('createlink', false, '__ke_temp_url__');
			var arr = node.getElementsByTagName('a');
			for (var i = 0, l = arr.length; i < l; i++) {
				if (arr[i].href.match(/\/?__ke_temp_url__$/)) {
					arr[i].href = url;
					arr[i].setAttribute('kesrc', url);
					if (target) arr[i].target = target;
					else arr[i].removeAttribute('target');
				}
			}
			if (KE.browser.WEBKIT && isItem && startNode.tagName.toLowerCase() == 'img') {
				var parent = startNode.parentNode;
				if (parent.tagName.toLowerCase() != 'a') {
					var a = KE.$$('a', iframeDoc);
					parent.insertBefore(a, startNode);
					a.appendChild(startNode);
					parent = a;
				}
				parent.href = url;
				parent.setAttribute('kesrc', url);
				if (target) parent.target = target;
				else parent.removeAttribute('target');
				g.keSel.addRange(range);
			}
		}
		KE.history.add(id, false);
		KE.util.execOnchangeHandler(id);
		KE.layout.hide(id);
		KE.util.focus(id);
	}
};

KE.plugin['unlink'] = {
	init : function(id) {
		var self = this;
		KE.g[id].contextmenuItems.push({
			text : KE.lang['deleteLink'],
			click : function(id, menu) {
				KE.util.select(id);
				menu.hide();
				self.click(id);
			},
			cond : function(id) {
				return KE.plugin['link'].getSelectedNode(id);
			},
			options : {
				iconHtml : '<span class="ke-common-icon ke-common-icon-url ke-icon-unlink"></span>'
			}
		});
	},
	click : function(id) {
		var g = KE.g[id];
		var iframeDoc = g.iframeDoc;
		KE.util.selection(id);
		var range = g.keRange;
		var startNode = range.startNode;
		var endNode = range.endNode;
		var isItem = (startNode.nodeType == 1 && startNode === endNode);
		var isEmpty = !isItem;
		if (!isItem) isEmpty = KE.browser.IE ? g.range.text === '' : g.range.toString() === '';
		if (isEmpty) {
			var linkNode = KE.plugin['link'].getSelectedNode(id);
			if (!linkNode) return;
			var range = g.keRange;
			range.selectTextNode(linkNode);
			g.keSel.addRange(range);
			KE.util.select(id);
			iframeDoc.execCommand('unlink', false, null);
			if (KE.browser.WEBKIT && startNode.tagName.toLowerCase() == 'img') {
				var parent = startNode.parentNode;
				if (parent.tagName.toLowerCase() == 'a') {
					KE.util.removeParent(parent);
					g.keSel.addRange(range);
				}
			}
		} else {
			iframeDoc.execCommand('unlink', false, null);
		}
		KE.toolbar.updateState(id);
		KE.history.add(id, false);
		KE.util.execOnchangeHandler(id);
		KE.util.focus(id);
	}
};

KE.plugin['media'] = {
	init : function(id) {
		var self = this;
		var typeHash = {};
		KE.each(KE.g[id].mediaTypes, function(key, val) {
			typeHash[val] = key;
		});
		KE.g[id].getHtmlHooks.push(function(html) {
			return html.replace(/<img[^>]*class="?ke-\w+"?[^>]*>/ig, function($0) {
				var width = $0.match(/style="[^"]*;?\s*width:\s*(\d+)/i) ? RegExp.$1 : 0;
				var height = $0.match(/style="[^"]*;?\s*height:\s*(\d+)/i) ? RegExp.$1 : 0;
				width = width || ($0.match(/width="([^"]+)"/i) ? RegExp.$1 : 0);
				height = height || ($0.match(/height="([^"]+)"/i) ? RegExp.$1 : 0);
				if ($0.match(/\s+kesrctag="([^"]+)"/i)) {
					var attrs = KE.util.getAttrList(unescape(RegExp.$1));
					attrs.width = width || attrs.width || 0;
					attrs.height = height || attrs.height || 0;
					attrs.kesrc = attrs.src;
					return KE.util.getMediaEmbed(attrs);
				}
			});
		});
		KE.g[id].setHtmlHooks.push(function(html) {
			return html.replace(/<embed[^>]*type="([^"]+)"[^>]*>(?:<\/embed>)?/ig, function($0, $1) {
				if (typeof typeHash[$1] == 'undefined') return $0;
				var src = $0.match(/\s+src="([^"]+)"/i) ? RegExp.$1 : '';
				if ($0.match(/\s+kesrc="([^"]+)"/i)) src = RegExp.$1;
				var width = $0.match(/\s+width="([^"]+)"/i) ? RegExp.$1 : 0;
				var height = $0.match(/\s+height="([^"]+)"/i) ? RegExp.$1 : 0;
				var attrs = KE.util.getAttrList($0);
				attrs.src = src;
				attrs.width = width;
				attrs.height = height;
				return KE.util.getMediaImage(id, '', attrs);
			});
		});
	},
	click : function(id) {
		KE.util.selection(id);
		this.dialog = new KE.dialog({
			id : id,
			cmd : 'media',
			file : 'media.html?id=' + id + '&ver=' + KE.version,
			width : 400,
			height : 170,
			loadingMode : true,
			title : KE.lang['media'],
			yesButton : KE.lang['yes'],
			noButton : KE.lang['no']
		});
		this.dialog.show();
	},
	check : function(id, url, width, height) {
		var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
		if (!url.match(/^.{3,}\.(swf|flv|mp3|wav|wma|wmv|mid|avi|mpg|mpeg|asf|rm|rmvb)(\?|$)/i)) {
			alert(KE.lang['invalidMedia']);
			KE.$('url', dialogDoc).focus();
			return false;
		}
		if (!width.match(/^\d*$/)) {
			alert(KE.lang['invalidWidth']);
			KE.$('width', dialogDoc).focus();
			return false;
		}
		if (!height.match(/^\d*$/)) {
			alert(KE.lang['invalidHeight']);
			KE.$('height', dialogDoc).focus();
			return false;
		}
		return true;
	},
	exec : function(id) {
		var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
		var url = KE.$('url', dialogDoc).value;
		var width = KE.$('width', dialogDoc).value;
		var height = KE.$('height', dialogDoc).value;
		if (!this.check(id, url, width, height)) return false;
		var autostart = KE.$('autostart', dialogDoc).checked ? 'true' : 'false';
		var html = KE.util.getMediaImage(id, '', {
			src : url,
			type : KE.g[id].mediaTypes[KE.util.getMediaType(url)],
			width : width,
			height : height,
			autostart : autostart,
			loop : 'true'
		});
		KE.util.insertHtml(id, html);
		KE.layout.hide(id);
		KE.util.focus(id);
	}
};

KE.plugin['table'] = {
	click : function(id) {
		var self = this;
		var num = 10;
		var cmd = 'table';
		var cellArr = [];
		KE.util.selection(id);
		var table = KE.$$('table');
		table.cellPadding = 0;
		table.cellSpacing = 0;
		table.border = 0;
		table.className = 'ke-plugin-table-table';
		for (var i = 0; i < num; i++) {
			var row = table.insertRow(i);
			cellArr[i] = [];
			for (var j = 0; j < num; j++) {
				var value = (i + 1) + ',' + (j + 1);
				var cell = row.insertCell(j);
				cell.className = 'ke-plugin-table-td';
				var div = KE.$$('div');
				div.className = 'ke-plugin-table-div';
				cell.appendChild(div);
				cellArr[i][j] = div;
				div.onmouseover = (function(x, y) {
					return function() {
						self.locationCell.innerHTML = x + ' by ' + y + ' Table';
						for (var m = 0; m < num; m++) {
							for (var n = 0; n < num; n++) {
								var cell = cellArr[m][n];
								if (m < x && n < y) cell.style.backgroundColor = '#CCCCCC';
								else cell.style.backgroundColor = '#FFFFFF';
							}
						}
					};
				})(i + 1, j + 1);
				div.onclick = (function(value) {
					return function() { KE.plugin[cmd].exec(id, value); };
				})(value);
			}
		}
		var row = table.insertRow(num);
		var cell = row.insertCell(0);
		cell.className = 'ke-plugin-table-td-bottom';
		cell.colSpan = 10;
		self.locationCell = cell;
		var menu = new KE.menu({
			id : id,
			cmd : cmd
		});
		menu.append(table);
		menu.show();
		this.menu = menu;
	},
	exec : function(id, value) {
		var location = value.split(',');
		var html = '<table border="1">';
		for (var i = 0; i < location[0]; i++) {
			html += '<tr>';
			for (var j = 0; j < location[1]; j++) {
				html += '<td>&nbsp;</td>';
			}
			html += '</tr>';
		}
		html += '</table>';
		KE.util.insertHtml(id, html);
		this.menu.hide();
		KE.util.focus(id);
	}
};

})(KindEditor);
