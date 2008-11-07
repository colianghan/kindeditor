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
KE.plugin['fontname'] = {
    icon: 'font.gif',
    click : function(id)
    {
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
    }
};
KE.plugin['fontsize'] = {
    icon : 'fontsize.gif',
    click : function(id)
    {
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
    }
};