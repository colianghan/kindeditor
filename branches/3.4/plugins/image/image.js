var KE = parent.KE;
location.href.match(/\?id=([\w-]+)/i);
var id = RegExp.$1;
var domain = document.domain;
KE.event.ready(function() {
    var typeBox = KE.$('type', document);
    var urlBox = KE.$('url', document);
    var fileBox = KE.$('imgFile', document);
    var widthBox = KE.$('imgWidth', document);
    var heightBox = KE.$('imgHeight', document);
    var borderBox = KE.$('imgBorder', document);
    var changeType = function(type) {
        if (type == 1) {
            urlBox.style.display = 'none';
            fileBox.style.display = 'block';
        } else {
            urlBox.style.display = 'block';
            fileBox.style.display = 'none';
        }
    }
    KE.event.add(typeBox, 'change', function(){
        changeType(this.value);
    });
    var startNode = KE.g[id].keRange.startNode;
    if (startNode.nodeType == 1 && startNode.tagName.toLowerCase() == 'img') {
        typeBox.value = 2;
        var src = startNode.src;
        urlBox.value = src.replace(/http:\/\/(.*?)\//g, function($0, $1) {
            if ($1 === domain) return '/';
            else return $0;
        });
        widthBox.value = startNode.width || 0;
        heightBox.value = startNode.height || 0;
        borderBox.value = startNode.border || 0;
        changeType(2);
    } else {
        typeBox.value = 1;
        changeType(1);
    }
}, window, document);