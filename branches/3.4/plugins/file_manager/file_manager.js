//require lib/json2.js
var JSON_URL = './../../php/file_manager_json.php';
var KE = parent.KE;
location.href.match(/\?id=([\w-]+)/i);
var id = RegExp.$1;
var domain = document.domain;
KE.event.ready(function() {
    var moveupLink = KE.$('moveup', document);
    var viewType = KE.$('viewType', document);
    var orderType = KE.$('orderType', document);
    var listTable = KE.$('listTable', document);
    var viewTable = KE.$('viewTable', document);
    var viewDiv = KE.$('viewDiv', document);
    var changeType = function(type) {
        if (type == 'VIEW') {
            viewTable.style.display = '';
            listTable.style.display = 'none';
        } else {
            viewTable.style.display = 'none';
            listTable.style.display = '';
        }
    };
    var insertImage = function(url, title) {
        KE.util.insertHtml(id, '<img src="' + url + '" alt="' + title + '" border="0" />');
        KE.layout.hide(id);
        KE.util.focus(id);
    };
    var insertFile = function(url, title) {
        KE.util.insertHtml(id, '<a href="' + url + '" target="_blank">' + title + '</a>');
        KE.layout.hide(id);
        KE.util.focus(id);
    };
    var createList = function(responseText) {
        var result = JSON.parse(responseText);
        var path = result.path;
        var fileList = result.file_list;
        for (var i = 0, len = result.length; i < len; i++) {
            var data = result[i];
            var row = listTable.insertRow(i + 1);
            var cell0 = row.insertCell(0);
            var iconName = data.is_dir ? 'folder-16.gif' : 'file-16.gif';
            var html = '';
            if (!data.is_dir || data.has_file) html += '<a href="#">';
            html += '<img src="./images/' + iconName + '" width="16" height="16" border="0" align="absmiddle" /> ' + data.name;
            if (!data.is_dir || data.has_file) html += '</a>';
            cell0.innerHTML = html;
            var cell1 = row.insertCell(1);
            cell1.innerHTML = data.size;
            var cell2 = row.insertCell(2);
            cell2.innerHTML = data.is_dir ? '文件夹' : '文件';
            var cell3 = row.insertCell(3);
            cell3.align = 'center';
            cell3.innerHTML = data.datetime;
        }
    };
    var createView = function(responseText) { 
        viewDiv.innerHTML = '';
        var result = JSON.parse(responseText);
        if (result.current_path) {
            moveupLink.onclick = function () {
                httpRequest('?path=' + result.moveup_path, createView);
            };
        } else {
            moveupLink.onclick = null;
        }
        var fileList = result.file_list;
        for (var i = 0, len = fileList.length; i < len; i++) {
            var data = fileList[i];
            var div = KE.$$('div', document);
            div.className = 'area';
            viewDiv.appendChild(div);
            var tableObj = KE.util.createTable(document);
            var table = tableObj.table;
            table.className = 'photo';
            var cell = tableObj.cell;
            cell.valign = 'middle';
            cell.align = 'center';
            var icon_url = data.is_dir ? './images/folder-64.gif' : (data.is_photo ? data.url : './images/file-64.gif');
            var file_url = data.url;
            var img = KE.$$('img', document);
            img.src = icon_url;
            img.width = 64;
            img.height = 64;
            img.alt = data.name;
            img.title = data.name;
            if (!data.is_dir || data.has_file) {
                img.style.cursor = 'pointer';
                if (data.is_dir) {
                    img.onclick = (function (url, path, title) {
                        return function () {
                            httpRequest('?path=' + path, createView);
                        }
                    })(file_url, data.dir_path, data.name);
                } else if (data.is_photo) {
                    img.onclick = (function (url, title) {
                        return function () {
                            insertImage(url, title);
                        }
                    })(file_url, data.name);
                } else {
                    img.onclick = (function (url, title) {
                        return function () {
                            insertFile(url, title);
                        }
                    })(file_url, data.name);                
                }
            }
            cell.appendChild(img);
            div.appendChild(table);
            var titleDiv = KE.$$('div', document);
            titleDiv.className = 'name';
            titleDiv.title = data.name;
            titleDiv.innerHTML = data.name;
            div.appendChild(titleDiv);
        }
    };
    var httpRequest = function (param, func) {
        var req = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
        var url = JSON_URL;
        url += param;
        url += (url.match(/\?/) ? "&" : "?") + (new Date()).getTime()
        req.open('GET', url, true);
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if(req.status == 200) func(req.responseText);
                else alert("Error: status=" + req.status);
            }
        };
        req.send(null);
    };
    KE.event.add(viewType, 'change', function() {
        changeType(viewType.value);
        if (viewType.value == 'VIEW') httpRequest('', createView);
        else httpRequest('', createList);
    });
    changeType('VIEW');
    viewType.value = 'VIEW';
    httpRequest('', createView);

}, window, document);