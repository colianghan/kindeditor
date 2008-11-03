/*******************************************************************************
* WYSIWYG HTML Editor for Internet
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence LGPL(http://www.opensource.org/licenses/lgpl-license.php)
* @version 3.0
*******************************************************************************/
KE.plugin['bgcolor'] = {
    icon : 'bgcolor.gif',
    click : function(id) {
        KE.util.selection(id);
        var menu = new KE.menu({
                id : id,
                cmd : 'bgcolor'
            });
        menu.picker();
    },
    exec : function(id, value) {
        KE.util.select(id);
        if (KE.browser == 'IE') {
            KE.g[id].iframeDoc.execCommand('backcolor', false, value);
        } else  {
            KE.g[id].iframeDoc.execCommand('hiliteColor', false, value);
        }
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['date'] = {
    icon : 'date.gif',
    click : function(id) {
        var date = new Date();
        var year = date.getFullYear().toString(10);
        var month = (date.getMonth() + 1).toString(10);
        month = month.length < 2 ? '0' + month : month;
        var day = date.getDate().toString(10);
        day = day.length < 2 ? '0' + day : day;
        var value = year + '-' + month + '-' + day;
        KE.util.selection(id);
        KE.util.insertHtml(id, value);
    }
};
KE.plugin['fontname'] = {
    icon: 'font.gif',
    click : function(id) {
        var cmd = 'fontname';
        KE.util.selection(id);
        var fontName = KE.lang.fontTable;
        var menu = new KE.menu({
                id : id,
                cmd : cmd,
                width : '160px'
            });
        for (var i in fontName) {
            menu.add(fontName[i], new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "' + i + '")'));
        }
        menu.show();
    },
    exec : function(id, value)
    {
        KE.util.select(id);
        KE.g[id].iframeDoc.execCommand('fontname', false, value);
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['fontsize'] = {
    icon : 'fontsize.gif',
    click : function(id) {
        var fontSize = {
            '1' : '8pt',
            '2' : '10pt',
            '3' : '12pt',
            '4' : '14pt',
            '5' : '18pt',
            '6' : '24pt',
            '7' : '36pt'
        };
        var cmd = 'fontsize';
        KE.util.selection(id);
        var menu = new KE.menu({
                id : id,
                cmd : cmd,
                width : '100px'
            });
        for (var i in fontSize) {
            menu.add(fontSize[i], new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "' + i + '")'));
        }
        menu.show();
    },
    'exec' : function(id, value)
    {
        KE.util.select(id);
        KE.g[id].iframeDoc.execCommand('fontsize', false, value.substr(0, 1));
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['hr'] = {
    icon : 'hr.gif',
    click : function(id)
    {
        KE.util.selection(id);
        var menu = new KE.menu({
                id : id,
                cmd : 'hr'
            });
        menu.picker();
    },
    exec : function(id, value)
    {
        KE.util.select(id);
        var html = '<hr color="' + value + '" size="1">';
        KE.util.insertHtml(id, html);
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['preview'] = {
    icon : 'preview.gif',
    click : function(id)
    {
        KE.util.selection(id);
        var dialog = new KE.dialog({
                id : id,
                cmd : 'preview',
                html : KE.util.getData(id),
                width : 600,
                height : 400,
                title : "预览",
                noButton : "关闭"
            });
        dialog.show();
    }
};
KE.plugin['print'] = {
    icon : 'print.gif',
    click : function(id)
    {
        KE.util.selection(id);
        KE.g[id].iframeWin.print();
    }
};
KE.plugin['source'] = {
    icon : 'source.gif',
    click : function(id) {
        var obj = KE.g[id];
        if (obj.wyswygMode == true) {
            KE.layout.hide(id);
            obj.newTextarea.value = obj.iframeDoc.body.innerHTML;
            obj.iframe.style.display = 'none';
            obj.newTextarea.style.display = 'block';
            KE.toolbar.disable(id, ['source', 'preview']);
            obj.wyswygMode = false;
        } else {
            obj.iframeDoc.body.innerHTML = obj.newTextarea.value;
            obj.iframe.style.display = 'block';
            obj.newTextarea.style.display = 'none';
            KE.toolbar.able(id, ['source', 'preview']);
            obj.wyswygMode = true;
        }
        KE.util.focus(id);
    }
};
KE.plugin['textcolor'] = {
    icon : 'textcolor.gif',
    click : function(id)
    {
        KE.util.selection(id);
        var menu = new KE.menu({
                id : id,
                cmd : 'textcolor'
            });
        menu.picker();
    },
    exec : function(id, value)
    {
        KE.util.select(id);
        KE.g[id].iframeDoc.execCommand('forecolor', false, value);
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['time'] = {
    icon : 'time.gif',
    click : function(id)
    {
        var date = new Date();
        var hour = date.getHours().toString(10);
        hour = hour.length < 2 ? '0' + hour : hour;
        var minute = date.getMinutes().toString(10);
        minute = minute.length < 2 ? '0' + minute : minute;
        var second = date.getSeconds().toString(10);
        second = second.length < 2 ? '0' + second : second;
        var value = hour + ':' + minute + ':' + second;
        KE.util.selection(id);
        KE.util.insertHtml(id, value);
    }
};
KE.plugin['title'] = {
    icon : 'title.gif',
    click : function(id)
    {
        var title = KE.lang.titleTable;
        var cmd = 'title';
        KE.util.selection(id);
        var menu = new KE.menu({
                id : id,
                cmd : cmd,
                width : '100px'
            });
        for (var i in title) {
            menu.add(title[i], new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "<' + i + '>")'));
        }
        menu.show();
    },
    exec : function(id, value)
    {
        KE.util.select(id);
        KE.g[id].iframeDoc.execCommand('formatblock', false, value);
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['zoom'] = {
    icon : 'zoom.gif',
    click : function(id)
    {
        var cmd = 'zoom';
        var zoom = ['250%', '200%', '150%', '120%', '100%', '80%', '50%'];
        var menu = new KE.menu({
                id : id,
                cmd : cmd,
                width : '120px'
            });
        for (var i in zoom) {
            menu.add(zoom[i], new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "' + zoom[i] + '")'));
        }
        menu.show();
    },
    exec : function(id, value)
    {
        KE.g[id].iframeDoc.body.style.zoom = value;
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['emoticons'] = {
    icon : 'emoticons.gif',
    click : function(id)
    {
        var emoticonTable = [
                ['etc_01.gif','etc_02.gif','etc_03.gif','etc_04.gif','etc_05.gif','etc_06.gif'],
                ['etc_07.gif','etc_08.gif','etc_09.gif','etc_10.gif','etc_11.gif','etc_12.gif'],
                ['etc_13.gif','etc_14.gif','etc_15.gif','etc_16.gif','etc_17.gif','etc_18.gif'],
                ['etc_19.gif','etc_20.gif','etc_21.gif','etc_22.gif','etc_23.gif','etc_24.gif'],
                ['etc_25.gif','etc_26.gif','etc_27.gif','etc_28.gif','etc_29.gif','etc_30.gif'],
                ['etc_31.gif','etc_32.gif','etc_33.gif','etc_34.gif','etc_35.gif','etc_36.gif']
            ];
        var cmd = 'emoticons';
        KE.util.selection(id);
        var table = KE.$$('table');
        table.cellPadding = 0;
        table.cellSpacing = 2;
        table.border = 0;
        for (var i = 0; i < emoticonTable.length; i++) {
            var row = table.insertRow(i);
            for (var j = 0; j < emoticonTable[i].length; j++) {
                var cell = row.insertCell(j);
                cell.style.padding = '1px';
                cell.style.border = '1px solid #F0F0EE';
                cell.style.cursor = 'pointer';
                cell.onmouseover = function() {this.style.borderColor = '#000000'; }
                cell.onmouseout = function() {this.style.borderColor = '#F0F0EE'; }
                cell.onclick = new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "' + emoticonTable[i][j] + '")');
                var img = KE.$$('img');
                img.src = KE.scriptPath + 'plugin/emoticons/' + emoticonTable[i][j];
                cell.appendChild(img);
            }
        }
        var menu = new KE.menu({
                id : id,
                cmd : cmd
            });
        menu.append(table);
        menu.show();
    },
    exec : function(id, value)
    {
        KE.util.select(id);
        var html = '<img src="' + KE.scriptPath + 'plugin/emoticons/' + value + '" border="0">';
        KE.util.insertHtml(id, html);
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['flash'] = {
    icon : 'flash.gif',
    click : function(id)
    {
        alert(1);
    }
};
KE.plugin['image'] = {
    icon : 'image.gif',
    click : function(id) {
        KE.util.selection(id);
        var dialog = new KE.dialog({
                id : id,
                cmd : 'image',
                width : 340,
                height : 400,
                title : "插入图片",
                previewButton : "预览",
                yesButton : "确定",
                noButton : "取消"
            });
        dialog.show();
    },
    preview : function(id) {
        var divWidth = 280;
        var divHeight = 180;
        var iframeDoc = KE.g[id].iframeDoc;
        var dialogDoc = KE.util.getIframeDoc(KE.g[id].dialog);
        var type = KE.$('imgType', dialogDoc).value;
        var url = KE.$('imgLink', dialogDoc).value;
        if (type == 1) return false;
        if (url.match(/^\w+:\/\/.{3,}(jpg|jpeg|gif|bmp|png)$/) == null) {
            alert('无效的图片地址。');
            window.focus();
            KE.g[id].yesButton.focus();
            return false;
        }
        var img = KE.$$('img', dialogDoc);
        img.src = url;
        var width = parseInt(img.width);
        var height = parseInt(img.height);
        KE.$('imgWidth', dialogDoc).value = width;
        KE.$('imgHeight', dialogDoc).value = height;
        var rate = parseInt(width/height);
        if (width > divWidth && height <= divHeight) {
            width = divWidth;
            height = parseInt(width / rate);
        } else if (width <= divWidth && height > divHeight) {
            height = divHeight;
            width = parseInt(height * rate);
        } else if (width > divWidth && height > divHeight) {
            if (width >= height) {
                width = divWidth;
                height = parseInt(width / rate);
            } else {
                height = divHeight;
                width = parseInt(height * rate);
            }
        }
        img.width = width;
        img.height = height;
        KE.$('previewImage', dialogDoc).innerHTML = "";
        KE.$('previewImage', dialogDoc).appendChild(img);
    },
    exec : function(id)
    {
        KE.util.select(id);
        var iframeDoc = KE.g[id].iframeDoc;
        var dialogDoc = KE.util.getIframeDoc(KE.g[id].dialog);
        var type = KE.$('imgType', dialogDoc).value;
        var url = KE.$('imgLink', dialogDoc).value;
        var title = KE.$('imgTitle', dialogDoc).value;
        var width = KE.$('imgWidth', dialogDoc).value;
        var height = KE.$('imgHeight', dialogDoc).value;
        var border = KE.$('imgBorder', dialogDoc).value;
        if (type == 1) {
            dialogDoc.uploadForm.submit();
            return false;
        }
        if (url.match(/^\w+:\/\/.{3,}(jpg|jpeg|gif|bmp|png)$/) == null) {
            alert('无效的图片地址。');
            window.focus();
            KE.g[id].yesButton.focus();
            return false;
        }
        if (width.match(/^\d+$/) == null) {
            alert('宽度必须为数字。');
            window.focus();
            KE.g[id].yesButton.focus();
            return false;
        }
        if (height.match(/^\d+$/) == null) {
            alert('高度必须为数字。');
            window.focus();
            KE.g[id].yesButton.focus();
            return false;
        }
        if (border.match(/^\d+$/) == null) {
            alert('边框必须为数字。');
            window.focus();
            KE.g[id].yesButton.focus();
            return false;
        }
        var html = '<img src="' + url + '" ';
        if (width > 0) html += 'width="' + width + '" ';
        if (height > 0) html += 'height="' + height + '" ';
        html += 'border="' + border + '" />';
        KE.util.insertHtml(id, html);
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['layer'] = {
    icon : 'layer.gif',
    click : function(id) {
        KE.util.selection(id);
        var menu = new KE.menu({
                id : id,
                cmd : 'layer'
            });
        menu.picker();
    },
    exec : function(id, value)
    {
        KE.util.select(id);
        var html = '<div style="padding:5px;border:1px solid #AAAAAA;background-color:' + value + '">请输入内容</div>';
        KE.util.insertHtml(id, html);
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['link'] = {
    icon : 'link.gif',
    click : function(id)
    {
        KE.util.selection(id);
        var dialog = new KE.dialog({
                id : id,
                cmd : 'link',
                width : 330,
                height : 130,
                title : "超级连接",
                yesButton : "确定",
                noButton : "取消"
            });
        dialog.show();
    },
    exec : function(id)
    {
        KE.util.select(id);
        var iframeDoc = KE.g[id].iframeDoc;
        var dialogDoc = KE.util.getIframeDoc(KE.g[id].dialog);
        var url = KE.$('hyperLink', dialogDoc).value;
        var target = KE.$('linkType', dialogDoc).value;
        if (url.match(/\w+:\/\/.{3,}/) == null) {
            alert('URL不正确。');
            window.focus();
            KE.g[id].yesButton.focus();
            return false;
        }
        if (KE.g[id].rangeText != '') {
            var element;
            if (KE.browser == 'IE') {
                if (KE.g[id].selection.type.toLowerCase() == 'control') {
                    var el = KE.$$("a", iframeDoc);
                    el.href = url;
                    if (target) el.target = target;
                    KE.g[id].range.item(0).applyElement(el);
                } else if (KE.g[id].selection.type.toLowerCase() == 'text') {
                    iframeDoc.execCommand("createlink", false, url);
                    var el = KE.g[id].range.parentElement();
                    if (target) el.target = target;
                }
            } else {
                iframeDoc.execCommand("createlink", false, url);
                var el = KE.g[id].range.startContainer.previousSibling;
                if (target) el.target = target;
            }
        }
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['media'] = {
    icon : 'media.gif',
    click : function(id)
    {
        alert(1);
    }
};
KE.plugin['real'] = {
    icon : 'real.gif',
    click : function(id)
    {
        alert(1);
    }
};
KE.plugin['specialchar'] = {
    icon : 'specialchar.gif',
    click : function(id)
    {
        var charTable = [
            ['§','№','☆','★','○','●','◎','◇','◆','□'],
            ['℃','‰','■','△','▲','※','→','←','↑','↓'],
            ['〓','¤','°','＃','＆','＠','＼','︿','＿','￣'],
            ['―','α','β','γ','δ','ε','ζ','η','θ','ι'],
            ['κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ'],
            ['υ','φ','χ','ψ','ω','≈','≡','≠','＝','≤'],
            ['≥','＜','＞','≮','≯','∷','±','＋','－','×'],
            ['÷','／','∫','∮','∝','∞','∧','∨','∑','∏'],
            ['∪','∩','∈','∵','∴','⊥','∥','∠','⌒','⊙'],
            ['≌','∽','〖','〗','【','】','（','）','［','］']
        ];
        var cmd = 'specialchar';
        KE.util.selection(id);
        var table = KE.$$('table');
        table.cellPadding = 0;
        table.cellSpacing = 2;
        table.border = 0;
        for (var i = 0; i < charTable.length; i++) {
            var row = table.insertRow(i);
            for (var j = 0; j < charTable[i].length; j++) {
                var cell = row.insertCell(j);
                cell.style.padding = '1px';
                cell.style.border = '1px solid #AAAAAA';
                cell.style.fontSize = '12px';
                cell.style.cursor = 'pointer';
                cell.onmouseover = function() {this.style.borderColor = '#000000'; }
                cell.onmouseout = function() {this.style.borderColor = '#AAAAAA'; }
                cell.onclick = new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "' + charTable[i][j] + '")');
                cell.innerHTML = charTable[i][j];
            }
        }
        var menu = new KE.menu({
                id : id,
                cmd : cmd
            });
        menu.append(table);
        menu.show();
    },
    exec : function(id, value)
    {
        KE.util.select(id);
        KE.util.insertHtml(id, value);
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};
KE.plugin['table'] = {
    icon    : 'table.gif',
    selected : function(id, i, j)
    {
        var text = i.toString(10) + ' by ' + j.toString(10) + ' Table';
        KE.$('tableLocation' + id).innerHTML = text;
        var num = 10;
        for (var m = 1; m <= num; m++) {
            for (var n = 1; n <= num; n++) {
                var td = KE.$('tableTd' + id + m.toString(10) + '_' + n.toString(10) + '');
                if (m <= i && n <= j) {
                    td.style.backgroundColor = '#CCCCCC';
                } else {
                    td.style.backgroundColor = '#FFFFFF';
                }
            }
        }
    },
    click : function(id)
    {
        var cmd = 'table';
        KE.util.selection(id);
        var num = 10;
        var html = '<table cellpadding="0" cellspacing="0" border="0" style="width:130px;">';
        for (i = 1; i <= num; i++) {
            html += '<tr>';
            for (j = 1; j <= num; j++) {
                var value = i.toString(10) + ',' + j.toString(10);
                html += '<td id="tableTd' + id + i.toString(10) + '_' + j.toString(10) +
                    '" style="font-size:1px;width:12px;height:12px;background-color:#FFFFFF;' +
                    'border:1px solid #DDDDDD;cursor:pointer;" ' +
                    'onclick="javascript:KE.plugin[\'table\'].exec(\'' + id + '\', \'' + value + '\');" ' +
                    'onmouseover="javascript:KE.plugin[\'table\'].selected(\'' + id + '\', \'' + i.toString(10) +
                    '\', \'' + j.toString(10) + '\');">&nbsp;</td>';
            }
            html += '</tr>';
        }
        html += '<tr><td colspan="10" id="tableLocation' + id +
        '" style="font-size:12px;text-align:center;height:20px;"></td></tr>';
        html += '</table>';
        var menu = new KE.menu({
                id : id,
                cmd : cmd
            });
        menu.insert(html);
        menu.show();
    },
    exec : function(id, value)
    {
        KE.util.select(id);
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
        KE.layout.hide(id);
        KE.util.focus(id);
    }
};