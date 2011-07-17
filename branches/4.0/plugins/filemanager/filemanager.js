
KindEditor.plugin('file_manager', function(K) {
	var self = this, name = 'filemanager',
		fileManagerJson = K.undef(self.fileManagerJson, self.scriptPath + 'php/file_manager_json.php'),
		imgPath = self.pluginsPath + name + '/images/',
		lang = self.lang(name + '.');
	// define common functions
	function insertLink(url) {
		if (self.dialogs.length > 1) {
			var parentDialog = self.dialogs[self.dialogs.length - 2];
			K('[name="url"]', parentDialog.div()).val(url);
			self.hideDialog();
			return true;
		}
		return false;
	}
	function insertImage(url, title) {
		if (!insertLink(url)) {
			self.inserthtml('<img src="' + url + '" alt="' + title + '" />');
		}
	}
	function insertFile(url, title) {
		if (!insertLink(url)) {
			self.insertHtml('<a href="' + url + '" target="_blank">' + title + '</a>');
		}
	}
	function makeFileTitle(filename, filesize, datetime) {
		return filename + ' (' + Math.ceil(filesize / 1024) + 'KB, ' + datetime + ')';
	}
	function bindTitle(el, data) {
		if (data.is_dir) {
			el.attr('title', data.filename);
		} else {
			el.attr('title', makeFileTitle(data.filename, data.filesize, data.datetime));
		}
	}
	self.clickToolbar(name, function() {
		var html = [
			'<div style="padding:10px 20px;">',
			// header start
			'<div class="ke-plugin-filemanager-header">',
			// left start
			'<div class="left">',
			'<img class="ke-inline-block" name="moveupImg" src="' + imgPath + 'go-up.gif" width="16" height="16" border="0" alt="" /> ',
			'<a class="ke-inline-block" name="moveupLink" href="javascript:;">' + lang.moveup + '</a>',
			'</div>',
			// right start
			'<div class="right">',
			lang.viewType + ' <select class="ke-inline-block" name="viewType">',
			'<option value="VIEW">' + lang.viewImage + '</option>',
			'<option value="LIST">' + lang.listImage + '</option>',
			'</select> ',
			lang.orderType + ' <select class="ke-inline-block" name="orderType">',
			'<option value="NAME">' + lang.fileName + '</option>',
			'<option value="SIZE">' + lang.fileSize + '</option>',
			'<option value="TYPE">' + lang.fileType + '</option>',
			'</select>',
			'</div>',
			'<div class="ke-clearfix"></div>',
			'</div>',
			// body start
			'<div class="ke-plugin-filemanager-body"></div>',
			'</div>'
		].join('');
		var dialog = self.createDialog({
			name : name,
			width : 520,
			height : 510,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
				}
			}
		}),
		div = dialog.div(),
		bodyDiv = K('.ke-plugin-filemanager-body', div),
		moveupImg = K('[name="moveupImg"]', div),
		moveupLink = K('[name="moveupLink"]', div),
		viewServerBtn = K('[name="viewServer"]', div),
		viewTypeBox = K('[name="viewType"]', div),
		orderTypeBox = K('[name="orderType"]', div);
		function reloadPage(path, order, func) {
			var url = fileManagerJson, param = '&path=' + path + '&order=' + order;
			if (!/\?/.test(url)) {
				url += '?';
				param = param.substr(1);
			}
			url += param + '&' + (new Date()).getTime();
			K.ajax(url, func);
		}
		var elList = [];
		function bindEvent(el, result, data, createFunc) {
			var fileUrl = K.formatUrl(result.current_url + data.filename, 'absolute'),
				dirPath = encodeURIComponent(result.current_dir_path + data.filename + '/');
			if (data.is_dir) {
				el.click(function(e) {
					reloadPage(dirPath, orderTypeBox.val(), createFunc);
				});
			} else if (data.is_photo) {
				el.click(function(e) {
					insertImage(fileUrl, data.filename);
				});
			} else {
				el.click(function(e) {
					insertFile(fileUrl, data.filename);
				});
			}
			elList.push(el);
		}
		function createCommon(result, createFunc) {
			// remove events
			K.each(elList, function() {
				this.unbind();
			});
			moveupLink.unbind();
			viewTypeBox.unbind();
			orderTypeBox.unbind();
			// add events
			if (result.current_dir_path) {
				moveupLink.click(function(e) {
					reloadPage(result.moveup_dir_path, orderTypeBox.val(), createFunc);
				});
			}
			function changeFunc() {
				if (viewTypeBox.val() == 'VIEW') {
					reloadPage(result.current_dir_path, orderTypeBox.val(), createView);
				} else {
					reloadPage(result.current_dir_path, orderTypeBox.val(), createList);
				}
			}
			viewTypeBox.change(changeFunc);
			orderTypeBox.change(changeFunc);
			bodyDiv.html('');
		}
		function createList(result) {
			createCommon(result, createList);
			var table = document.createElement('table');
			table.className = 'table';
			table.cellPadding = 0;
			table.cellSpacing = 2;
			table.border = 0;
			bodyDiv.append(table);
			var fileList = result.file_list;
			for (var i = 0, len = fileList.length; i < len; i++) {
				var data = fileList[i];
				var row = table.insertRow(i);
				row.onmouseover = function () { this.className = 'on'; };
				row.onmouseout = function () { this.className = ''; };
				var cell0 = row.insertCell(0);
				cell0.className = 'name';
				var img = document.createElement('img');
				img.src = imgPath + (data.is_dir ? 'folder-16.gif' : 'file-16.gif');
				img.width = 16;
				img.height = 16;
				img.align = 'absmiddle';
				img.alt = data.filename;
				cell0.appendChild(img);
				cell0.appendChild(document.createTextNode(' ' + data.filename));
				if (!data.is_dir || data.has_file) {
					row.style.cursor = 'pointer';
					img.title = data.filename;
					cell0.title = data.filename;
					bindEvent(K(cell0), result, data, createList);
				} else {
					img.title = lang.emptyFolder;
					cell0.title = lang.emptyFolder;
				}
				var cell1 = row.insertCell(1);
				cell1.className = 'size';
				cell1.innerHTML = data.is_dir ? '-' : Math.ceil(data.filesize / 1024) + 'KB';
				var cell2 = row.insertCell(2);
				cell2.className = 'datetime';
				cell2.innerHTML = data.datetime;
			}
		}
		function createView(result) {
			createCommon(result, createView);
			var fileList = result.file_list;
			for (var i = 0, len = fileList.length; i < len; i++) {
				var data = fileList[i],
					div = K('<div class="ke-inline-block item"></div>');
				bodyDiv.append(div);
				var photoDiv = K('<div class="ke-inline-block photo"></div>')
					.mouseover(function(e) {
						K(this).addClass('on');
					})
					.mouseout(function(e) {
						K(this).removeClass('on');
					});
				div.append(photoDiv);
				var fileUrl = result.current_url + data.filename,
					iconUrl = data.is_dir ? imgPath + 'folder-64.gif' : (data.is_photo ? fileUrl : imgPath + 'file-64.gif');
				var img = K('<img src="' + iconUrl + '" width="80" height="80" alt="' + data.filename + '" />');
				if (!data.is_dir || data.has_file) {
					photoDiv.css('cursor', 'pointer');
					bindTitle(photoDiv, data);
					bindEvent(photoDiv, result, data, createView);
				} else {
					photoDiv.attr('title', lang.emptyFolder);
				}
				photoDiv.append(img);
				div.append('<div class="name" title="' + data.filename + '">' + data.filename + '</div>');
			}
		}
		viewTypeBox.val('VIEW');
		reloadPage('', orderTypeBox.val(), createView);
	});

});
