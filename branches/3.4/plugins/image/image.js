var KE = parent.KE;
location.href.match(/\?id=([\w-]+)/i);
var id = RegExp.$1;
var domain = document.domain;
var fileManager = null;
var allowUpload = (typeof KE.g[id].allowUpload == 'undefined') ? true : KE.g[id].allowUpload;
var allowFileManager = (typeof KE.g[id].allowFileManager == 'undefined') ? false : KE.g[id].allowFileManager;
KE.event.ready(function() {
    var typeBox = KE.$('type', document);
    var urlBox = KE.$('url', document);
    var alignElements = document.getElementsByName('align');
    var fileBox = KE.$('imgFile', document);
    var tabNavi = KE.$('tabNavi', document);
    var viewServer = KE.$('viewServer', document);
    var liList = tabNavi.getElementsByTagName('li');
    var selectTab = function(num) {
        for (var i = 0, len = liList.length; i < len; i++) {
            var li = liList[i];
            if (i === num) {
                li.className = 'selected';
                li.onclick = null;
            } else {
                if (allowUpload) {
                    li.className = '';
                    li.onclick = (function (i) {
                        return function() {
                            if (!fileManager) selectTab(i);
                        };
                    })(i);
                } else {
                    li.parentNode.removeChild(li);
                }
            }
            KE.$('tab' + (i + 1), document).style.display = 'none';
        }
        typeBox.value = num + 1;
        KE.$('tab' + (num + 1), document).style.display = '';
    }
    if (!allowFileManager) {
        viewServer.parentNode.removeChild(viewServer);
    }
    var imgNode = KE.plugin['image'].getSelectedNode(id);
    if (imgNode) {
        var src = KE.format.getUrl(imgNode.src, KE.g[id].urlType);
        urlBox.value = src;
        for (var i = 0, len = alignElements.length; i < len; i++) {
            if (alignElements[i].value == imgNode.align) {
                alignElements[i].checked = true;
                break;
            }
        }
    }
    KE.event.add(viewServer, 'click', function () {
        if (fileManager) return false;
        fileManager = new KE.dialog({
            id : id,
            cmd : 'file_manager',
            file : 'file_manager/file_manager.html?id=' + id,
            width : 500,
            height : 400,
            loadingMode : true,
            title : '浏览服务器',
            noButton : '取消',
            hideHandler : function() {
                fileManager = null;
            }
        });
        fileManager.show();
    });
    selectTab(0);
    KE.util.hideLoadingPage(id);
}, window, document);