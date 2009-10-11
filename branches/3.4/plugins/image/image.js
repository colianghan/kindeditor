var KE = parent.KE;
location.href.match(/\?id=([\w-]+)/i);
var id = RegExp.$1;
var domain = document.domain;
var fileManager = null;
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
                li.className = '';
                li.onclick = (function (i) {
                    return function() {
                        if (!fileManager) selectTab(i);
                    };
                })(i);
            }
            KE.$('tab' + (i + 1), document).style.display = 'none';
        }
        typeBox.value = num + 1;
        KE.$('tab' + (num + 1), document).style.display = '';
    }
    var startNode = KE.g[id].keRange.startNode;
    if (startNode && startNode.nodeType == 1 && startNode.tagName.toLowerCase() == 'img') {
        var src = startNode.src;
        urlBox.value = src.replace(/http:\/\/(.*?)\//g, function($0, $1) {
            if ($1 === domain) return '/';
            else return $0;
        });
        for (var i = 0, len = alignElements.length; i < len; i++) {
            if (alignElements[i].value == startNode.align) {
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
}, window, document);