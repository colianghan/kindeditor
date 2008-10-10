/*******************************************************************************
* WYSIWYG HTML Editor for Internet
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence LGPL(http://www.opensource.org/licenses/lgpl-license.php)
* @version 3.0
*******************************************************************************/

KE.$ = function(id, doc){
    var doc = doc || document;
    return doc.getElementById(id);
};
KE.$$ = function(name, doc){
    var doc = doc || document;
    return doc.createElement(name);
};
KE.event = {
    add : function(el, event, listener)
    {
        if (el.addEventListener){
            el.addEventListener(event, listener, false);
        } else if (el.attachEvent){
            el.attachEvent('on' + event, listener);
        }
    }
};
KE.util = {
    getDocumentHeight: function() {
        var scrollHeight =
        (document.compatMode != "CSS1Compat") ? document.body.scrollHeight : document.documentElement.scrollHeight;
        return Math.max(scrollHeight, this.getViewportHeight());
    },
    getDocumentWidth: function() {
        var scrollWidth =
        (document.compatMode != "CSS1Compat") ? document.body.scrollWidth : document.documentElement.scrollWidth;
        return Math.max(scrollWidth, this.getViewportWidth());
    },
    getViewportHeight: function() {
        var height = self.innerHeight;
        var mode = document.compatMode;
        if ((mode || KE.browser == 'IE') && KE.browser != 'OPERA') {
            height = (mode == "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight;
        }
        return height;
    },
    getViewportWidth: function() {
        var width = self.innerWidth;
        var mode = document.compatMode;
        if (mode || KE.browser == 'IE') {
            width = (mode == "CSS1Compat") ? document.documentElement.clientWidth : document.body.clientWidth;
        }
        return width;
    },
    getScriptPath : function()
    {
        var elements = document.getElementsByTagName('script');
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].src && elements[i].src.indexOf('ke-core.js') != -1) {
                return elements[i].src.substring(0, elements[i].src.lastIndexOf('/') + 1);
            }
        }
    },
    getHtmlPath : function()
    {
        return location.href.substring(0, location.href.lastIndexOf('/') + 1);
    },
    getBrowser : function()
    {
        var browser = '';
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("msie") > -1) {
            browser = 'IE';
        } else if (ua.indexOf("gecko") > -1) {
            browser = 'GECKO';
        } else if (ua.indexOf("webkit") > -1) {
            browser = 'SAFARI';
        } else if (ua.indexOf("opera") > -1) {
            browser = 'OPERA';
        } else if (ua.indexOf("chrome") > -1) {
            browser = 'CHROME';
        }
        return browser;
    },
    loadStyle : function(path)
    {
        var link = KE.$$('link');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', path);
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    inArray : function(str, arr)
    {
        for (var i in arr) {if (str == arr[i]) return true;}
        return false;
    },
    getTop : function(el)
    {
        var top = el.offsetTop;
        var parent = el.offsetParent;
        while (parent) { top += parent.offsetTop; parent = parent.offsetParent; }
        return top;
    },
    getLeft : function(el)
    {
        var left = el.offsetLeft;
        var parent = el.offsetParent;
        while (parent) { left += parent.offsetLeft; parent = parent.offsetParent; }
        return left;
    },
    setDefaultPlugin : function(id)
    {
        var items = [
            'undo', 'redo', 'cut', 'copy', 'paste', 'selectall', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript','superscript',
            'bold', 'italic', 'underline', 'strikethrough', 'removeformat', 'unlink', 'print'
        ];
        for (var i in items) {
            KE.plugin[items[i]] = {
                icon : items[i] + '.gif',
                click : new Function('KE.g["' + id + '"].iframeDoc.execCommand("' + items[i] + '", false, null)')
            };
        }
    },
    getFullHtml : function(id, body)
    {
        var html = '<html>';
        html += '<head>';
        html += '<base href="' + KE.htmlPath + '" />';
        html += '<title>blank_page</title>';
        html += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
        if (KE.g[id].cssPath) {
            html += '<link href="' + KE.g[id].cssPath + '" rel="stylesheet" type="text/css" />';
        }
        html += '</head>';
        html += '<body>';
        html += body;
        html += '</body>';
        html += '</html>';
        return html;
    },
    getData : function(id)
    {
        var html;
        if (KE.g[id].wyswygMode == true) {
            html = KE.g[id].iframeDoc.body.innerHTML;
        } else {
            html = KE.g[id].newTextarea.value;
        }
        KE.g[id].hideInput.value = html;
        return html;
    },
    focus : function(id)
    {
        if (KE.g[id].wyswygMode == true) {
            KE.g[id].iframeWin.focus();
        } else {
            KE.g[id].newTextarea.focus();
        }
    },
    click : function(id, cmd)
    {
        KE.layout.hide(id);
        KE.util.focus(id);
        KE.plugin[cmd].click(id);
    },
    selection : function(id)
    {
        var selection, range, rangeText;
        if (KE.g[id].iframeDoc.selection) {
            selection = KE.g[id].iframeDoc.selection;
            range = selection.createRange();
            rangeText = range.text;
        } else {
            selection = KE.g[id].iframeWin.getSelection();
            range = selection.getRangeAt(0);
            rangeText = range.toString();
        }
        KE.g[id].selection = selection;
        KE.g[id].range = range;
        KE.g[id].rangeText = rangeText;
    },
    select : function(id)
    {
        if (KE.browser == 'IE') KE.g[id].range.select();
    },
    pToBr : function(id)
    {
        if(KE.browser == 'IE') {
            KE.event.add(KE.g[id].iframeDoc, 'keydown', function(e) {
                KE.util.selection(id);
                if(e.keyCode == 13 && KE.g[id].range.parentElement().tagName != 'LI') {
                    KE.util.insertHtml(id, '<br>');
                    return false;
                }
            });
        }
    },
    insertHtml : function(id, html)
    {
        KE.util.select(id);
        if (KE.browser == 'IE') {
            if (KE.g[id].selection.type.toLowerCase() == 'control') {
                KE.g[id].range.item(0).outerHTML = html;
            } else {
                KE.g[id].range.pasteHTML(html);
            }
        } else {
            KE.g[id].iframeDoc.execCommand('inserthtml', false, html);
        }
    }
};
KE.button = function(cf){
    var doc = cf.doc || document;
    var input = KE.$$('input', doc);
    input.type = cf.type || 'button';
    input.className = 'ke-button';
    input.value = cf.text;
    input.onclick = cf.click;
    return input;
};
KE.layout = {
    show : function(id, div)
    {
        KE.layout.hide(id);
        KE.g[id].hideDiv.appendChild(div);
        KE.g[id].hideDiv.style.display = 'block';
        KE.g[id].layoutDiv = div;
    },
    hide : function(id)
    {
        try {
            KE.g[id].hideDiv.removeChild(KE.g[id].layoutDiv);
        } catch (e) {}
        KE.g[id].hideDiv.style.display = 'none';
        KE.g[id].maskDiv.style.display = 'none';
    },
    make : function(id)
    {
        var div = KE.$$('div');
        div.style.position = 'absolute';
        div.style.zIndex = 10000;
        return div;
    }
};
KE.menu = function(cf){
    this.cf = cf;
    var div = KE.layout.make(cf.id);
    div.className = 'ke-menu';
    var obj = KE.g[cf.id].toolbarIcon[cf.cmd];
    div.style.top = KE.util.getTop(obj) + obj.offsetHeight + 'px';
    div.style.left = KE.util.getLeft(obj) + 'px';
    this.div = div;
    this.add = function(text, event)
    {
        var cDiv = KE.$$('div');
        cDiv.className = 'ke-menu-noselected';
        cDiv.style.width = this.cf.width;
        cDiv.onmouseover = function() { this.className = 'ke-menu-selected'; }
        cDiv.onmouseout = function() { this.className = 'ke-menu-noselected'; }
        cDiv.onclick = event;
        cDiv.innerHTML = text;
        this.append(cDiv);
    };
    this.append = function(el)
    {
        this.div.appendChild(el);
    };
    this.insert = function(html)
    {
        this.div.innerHTML = html;
    };
    this.show = function()
    {
        KE.layout.show(this.cf.id, this.div);
    };
    this.picker = function()
    {
        var colorTable = [
                ["#FFFFFF","#E5E4E4","#D9D8D8","#C0BDBD","#A7A4A4","#8E8A8B","#827E7F","#767173","#5C585A","#000000"],
                ["#FEFCDF","#FEF4C4","#FEED9B","#FEE573","#FFED43","#F6CC0B","#E0B800","#C9A601","#AD8E00","#8C7301"],
                ["#FFDED3","#FFC4B0","#FF9D7D","#FF7A4E","#FF6600","#E95D00","#D15502","#BA4B01","#A44201","#8D3901"],
                ["#FFD2D0","#FFBAB7","#FE9A95","#FF7A73","#FF483F","#FE2419","#F10B00","#D40A00","#940000","#6D201B"],
                ["#FFDAED","#FFB7DC","#FFA1D1","#FF84C3","#FF57AC","#FD1289","#EC0078","#D6006D","#BB005F","#9B014F"],
                ["#FCD6FE","#FBBCFF","#F9A1FE","#F784FE","#F564FE","#F546FF","#F328FF","#D801E5","#C001CB","#8F0197"],
                ["#E2F0FE","#C7E2FE","#ADD5FE","#92C7FE","#6EB5FF","#48A2FF","#2690FE","#0162F4","#013ADD","#0021B0"],
                ["#D3FDFF","#ACFAFD","#7CFAFF","#4AF7FE","#1DE6FE","#01DEFF","#00CDEC","#01B6DE","#00A0C2","#0084A0"],
                ["#EDFFCF","#DFFEAA","#D1FD88","#BEFA5A","#A8F32A","#8FD80A","#79C101","#3FA701","#307F00","#156200"],
                ["#D4C89F","#DAAD88","#C49578","#C2877E","#AC8295","#C0A5C4","#969AC2","#92B7D7","#80ADAF","#9CA53B"]
            ];
        var table = KE.$$('table');
        table.cellPadding = 0;
        table.cellSpacing = 1;
        table.border = 0;
        for (var i = 0; i < colorTable.length; i++) {
            var row = table.insertRow(i);
            for (var j = 0; j < colorTable[i].length; j++) {
                var cell = row.insertCell(j);
                cell.className = 'ke-picker-cell';
                cell.style.background = colorTable[i][j];
                cell.title = colorTable[i][j];
                cell.onmouseover = function() {this.style.borderColor = '#000000'; }
                cell.onmouseout = function() {this.style.borderColor = '#F0F0EE'; }
                cell.onclick = new Function('KE.plugin["' + this.cf.cmd + '"].exec("' +
                                            this.cf.id + '", "' + colorTable[i][j] + '")');
                cell.innerHTML = '&nbsp;';
            }
        }
        this.append(table);
        this.show();
    };
};
KE.toolbar = {
    able : function(id, arr)
    {
        for (var cmd in KE.g[id].toolbarIcon) {
            if (KE.util.inArray(cmd, arr)) continue;
            var obj = KE.g[id].toolbarIcon[cmd];
            obj.className = 'ke-icon';
            obj.onmouseover = function(){ this.className = "ke-icon-selected"; };
            obj.onmouseout = function(){ this.className = "ke-icon"; };
            obj.onclick = new Function('KE.util.click("' + id + '", "' + cmd + '")');
        }
    },
    disable : function(id, arr)
    {
        for (var cmd in KE.g[id].toolbarIcon) {
            if (KE.util.inArray(cmd, arr)) continue;
            var obj = KE.g[id].toolbarIcon[cmd];
            obj.className = 'ke-icon-disabled';
            obj.onmouseover = function(){ };
            obj.onmouseout = function(){ };
            obj.onclick = function(){ };
        }
    },
    create : function(id)
    {
        KE.g[id].toolbarIcon = [];
        var el = KE.$$('div');
        el.className = 'ke-toolbar';
        for (var i in KE.g[id].items) {
            var cmd = KE.g[id].items[i];
            var obj;
            if (cmd == '-') {
                obj = KE.$$('br');
            } else {
                obj = KE.$$('img');
                obj.src = KE.g[id].skinsPath + KE.plugin[cmd].icon;
                obj.align = 'absmiddle';
                obj.className = 'ke-icon';
                obj.alt = KE.lang[cmd];
                obj.title = KE.lang[cmd];
                obj.onmouseover = function(){ this.className = "ke-icon-selected"; };
                obj.onmouseout = function(){ this.className = "ke-icon"; };
                obj.onclick = new Function('KE.util.click("' + id + '", "' + cmd + '")');
                KE.g[id].toolbarIcon[cmd] = obj;
            }
            el.appendChild(obj);
        }
        return el;
    }
};
/*******************************************************************************
* create editor window
*******************************************************************************/
KE.create = function(id)
{
    var oldTextarea = KE.$(id);
    var width = oldTextarea.style.width;
    var height = oldTextarea.style.height;
    var widthArr = width.match(/(\d+)([px%]{1,2})/);
    var formWidth = (parseInt(widthArr[1]) - 2).toString(10) + widthArr[2];
    var heightArr = height.match(/(\d+)([px%]{1,2})/);
    var formHeight = (parseInt(heightArr[1]) - 4).toString(10) + heightArr[2];
    var containerDiv = KE.$$('div');
    containerDiv.className = 'ke-container';
    containerDiv.style.width = width;
    oldTextarea.parentNode.insertBefore(containerDiv, oldTextarea);
    var formDiv = KE.$$('div');
    formDiv.className = 'ke-form';
    formDiv.style.height = height;

    var iframe = KE.$$('iframe');
    iframe.id = id + 'Iframe';
    iframe.name = id + 'Iframe';
    iframe.style.width = formWidth;
    iframe.style.height = formHeight;
    iframe.setAttribute("frameBorder", "0");

    var newTextarea = KE.$$('textarea');
    newTextarea.className = 'ke-textarea';
    newTextarea.style.width = formWidth;
    newTextarea.style.height = formHeight;
    newTextarea.style.display = 'none';
    var hideInput;
    if (KE.browser == 'IE') {
        hideInput = KE.$$('<input type="hidden" name="' + oldTextarea.name + '">');
    } else {
        hideInput = KE.$$('input');
        hideInput.setAttribute('type', 'hidden');
        hideInput.setAttribute('name', oldTextarea.name);
    }
    var hideDiv = KE.$$('div');
    hideDiv.style.display = 'none';
    formDiv.appendChild(iframe);
    formDiv.appendChild(newTextarea);

    var maskDiv = KE.$$('div');
    maskDiv.className = 'ke-mask';
    maskDiv.style.width = KE.util.getDocumentWidth(true);
    maskDiv.style.height = KE.util.getDocumentHeight(true);

    KE.util.setDefaultPlugin(id);
    containerDiv.appendChild(KE.toolbar.create(id));
    containerDiv.appendChild(formDiv);
    containerDiv.appendChild(hideInput);
    containerDiv.appendChild(hideDiv);
    containerDiv.appendChild(maskDiv);
    var iframeWin = iframe.contentWindow;
    var iframeDoc = iframeWin.document;
    iframeDoc.designMode = "on";
    var html = KE.util.getFullHtml(id, oldTextarea.value);
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    if (KE.g[id].wyswygMode == false) {
        newTextarea.value = oldTextarea.value;
        newTextarea.style.display = 'block';
        iframe.style.display = 'none';
        KE.toolbar.disable(id, ['source', 'preview']);
    }
    oldTextarea.parentNode.removeChild(oldTextarea);

    var form = hideDiv.parentNode;
    while (form.tagName != 'FORM') { form = form.parentNode; }
    KE.event.add(form, 'submit', new Function('KE.util.getData("' + id + '")'));
    KE.event.add(iframeDoc, 'mousedown', new Function('KE.layout.hide("' + id + '")'));
    KE.event.add(newTextarea, 'mousedown', new Function('KE.layout.hide("' + id + '")'));

    KE.g[id].containerDiv = containerDiv;
    KE.g[id].iframe = iframe;
    KE.g[id].newTextarea = newTextarea;
    KE.g[id].hideInput = hideInput;
    KE.g[id].hideDiv = hideDiv;
    KE.g[id].maskDiv = maskDiv;
    KE.g[id].iframeWin = iframeWin;
    KE.g[id].iframeDoc = iframeDoc;
    KE.g[id].width = width;
    KE.g[id].height = height;

    KE.util.pToBr(id);
    KE.util.focus(id);
};
KE.version = 'KindEditor 3.0';
KE.scriptPath = KE.util.getScriptPath();
KE.htmlPath = KE.util.getHtmlPath();
KE.browser = KE.util.getBrowser();
KE.plugin = {};
KE.g = {};
KE.show = function(config)
{
    config.wyswygMode = config.wyswygMode || true;
    config.skinType = config.skinType || 'default';
    config.cssPath = config.cssPath || '';
    config.skinsPath = KE.scriptPath + 'skins/' + config.skinType + '/';
    config.items = config.items || [
        'source', 'preview', 'zoom', 'print', 'undo', 'redo', 'cut', 'copy', 'paste',
        'selectall', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull',
        'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
        'superscript', 'date', 'time', '-',
        'title', 'fontname', 'fontsize', 'textcolor', 'bgcolor', 'bold',
        'italic', 'underline', 'strikethrough', 'removeformat', 'image',
        'flash', 'media', 'real', 'layer', 'table', 'specialchar', 'hr',
        'emoticons', 'link', 'unlink'
    ];
    KE.g[config.id] = config;
    KE.util.loadStyle(KE.scriptPath + 'skins/' + config.skinType + '.css');
    KE.event.add(window, 'load', new Function('KE.create("' + config.id + '")'));
};
