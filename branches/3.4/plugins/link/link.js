var KE = parent.KE;
location.href.match(/\?id=([\w-]+)/i);
var id = RegExp.$1;
KE.event.ready(function() {
    var hyperLink = KE.$('hyperLink', document);
    var linkType = KE.$('linkType', document);
    var linkNode = KE.plugin['link'].getSelectedNode(id);
    if (linkNode) {
        var src = KE.format.getUrl(linkNode.href, KE.g[id].urlType);
        var target = linkNode.target;
        hyperLink.value = src;
        linkType.value = target == '_blank' ? target : '_self';
    }
    KE.util.hideLoadingPage(id);
}, window, document);