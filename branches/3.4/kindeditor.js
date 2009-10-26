/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence LGPL(http://www.opensource.org/licenses/lgpl-license.php)
* @version 3.4
*******************************************************************************/

var KE = {};

KE.version = '3.4';

KE.lang = {
    source : '切换模式',
    preview : '预览',
    undo : '后退(Ctrl+Z)',
    redo : '前进(Ctrl+Y)',
    cut : '剪切(Ctrl+X)',
    copy : '复制(Ctrl+C)',
    paste : '粘贴(Ctrl+V)',
    plainpaste : '粘贴为无格式文本',
    wordpaste : '从Word粘贴',
    selectall : '全选',
    justifyleft : '左对齐',
    justifycenter : '居中',
    justifyright : '右对齐',
    justifyfull : '两端对齐',
    insertorderedlist : '编号',
    insertunorderedlist : '项目符号',
    indent : '增加缩进',
    outdent : '减少缩进',
    subscript : '下标',
    superscript : '上标',
    date : '插入当前日期',
    time : '插入当前时间',
    title : '标题',
    fontname : '字体',
    fontsize : '文字大小',
    textcolor : '文字颜色',
    bgcolor : '文字背景',
    bold : '粗体',
    italic : '斜体',
    underline : '下划线',
    strikethrough : '删除线',
    removeformat : '删除格式',
    image : '图片',
    flash : '插入Flash',
    media : '插入多媒体',
    layer : '插入层',
    table : '插入表格',
    specialchar : '插入特殊字符',
    hr : '插入横线',
    emoticons : '插入笑脸',
    link : '超级连接',
    unlink : '取消超级连接',
    fullscreen : '全屏显示',
    about : '关于',
    print : '打印',
    yes : '确定',
    no : '取消',
    close : '关闭',
    editImage : '编辑图片',
    editLink : '编辑超级连接',
    loading : '正在加载中...',
    invalidImg : "请输入有效的URL地址。\n只允许jpg,gif,bmp,png格式。",
    invalidMedia : "请输入有效的URL地址。\n只允许mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb格式。",
    invalidWidth : "宽度必须为数字。",
    invalidHeight : "高度必须为数字。",
    invalidBorder : "边框必须为数字。",
    invalidUrl : "URL不正确。",
    pleaseInput : "请输入内容"
};

KE.scriptPath = (function() {
    var elements = document.getElementsByTagName('script');
    for (var i = 0, len = elements.length; i < len; i++) {
        if (elements[i].src && elements[i].src.match(/kindeditor[\w\-\.]*\.js/)) {
            return elements[i].src.substring(0, elements[i].src.lastIndexOf('/') + 1);
        }
    }
    return "";
})();

KE.htmlPath = (function() {
    return location.href.substring(0, location.href.lastIndexOf('/') + 1);
})();

KE.browser = (function() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("msie") > -1) return 'IE';
    else if (ua.indexOf("webkit") > -1) return 'WEBKIT';
    else if (ua.indexOf("gecko") > -1) return 'GECKO';
    else if (ua.indexOf("opera") > -1) return 'OPERA';
    else return "";
})();

KE.setting = {
    wyswygMode : true,
    autoOnsubmitMode : true,
    resizeMode : 2,
    filterMode : true,
    tagLineMode : false,
    urlType : 'relative',
    skinType : 'default',
    cssPath : '',
    skinsPath : KE.scriptPath + 'skins/',
    pluginsPath : KE.scriptPath + 'plugins/',
    minWidth : 200,
    minHeight : 100,
    minChangeSize : 5,
    items : [
        'source', 'preview', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
        'plainpaste', 'wordpaste', 'justifyleft', 'justifycenter', 'justifyright',
        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
        'superscript', 'date', 'time', '-',
        'title', 'fontname', 'fontsize', 'textcolor', 'bgcolor', 'bold',
        'italic', 'underline', 'strikethrough', 'removeformat', 'selectall', 'image',
        'flash', 'media', 'layer', 'table', 'specialchar', 'hr',
        'emoticons', 'link', 'unlink', 'about'
    ],
    colorTable : [
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
    ],
    noEndTags : ['br', 'hr', 'img', 'area', 'col', 'embed', 'input', 'param'],
    inlineTags : ['b', 'del', 'em', 'font', 'i', 'span', 'strike', 'strong', 'sub', 'sup', 'u'],
    htmlTags : {
        font : ['color', 'size', 'face', '.background-color'],
        span : [
            '.color', '.background-color', '.font-size', '.font-family',
            '.font-weight', '.font-style', '.text-decoration', '.vertical-align'
        ],
        div : [
            'class', 'align', '.border', '.margin', '.padding', '.text-align', '.color',
            '.background-color', '.font-size', '.font-family', '.font-weight',
            '.font-style', '.text-decoration', '.vertical-align', '.margin-left'
        ],
        table: [
            'class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align',
            '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
            '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration'
        ],
        'td,th': [
            'class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
            '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
            '.font-style', '.text-decoration', '.vertical-align'
        ],
        a : ['class', 'href', 'target', 'name'],
        embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', '/'],
        img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '/'],
        hr : ['class', '/'],
        br : ['/'],
        'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
            'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family',
            '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
        ],
        'tbody,tr,strong,b,sub,sup,em,i,u,strike' : []
    }
};

KE.g = {};

KE.plugin = {};

KE.$ = function(id, doc){
    var doc = doc || document;
    return doc.getElementById(id);
};

KE.$$ = function(name, doc){
    var doc = doc || document;
    return doc.createElement(name);
};

KE.event = {
    add : function(el, event, listener) {
        if (el.addEventListener){
            el.addEventListener(event, listener, false);
        } else if (el.attachEvent){
            el.attachEvent('on' + event, listener);
        }
    },
    remove : function(el, event, listener) {
        if (el.removeEventListener){
            el.removeEventListener(event, listener, false);
        } else if (el.detachEvent){
            el.detachEvent('on' + event, listener);
        }
    },
    input : function(el, func) {
        this.add(el, 'keyup', function(e) {
            if (!e.ctrlKey && !e.shiftKey && !e.altKey && (e.keyCode < 16 || e.keyCode > 18) && e.keyCode != 116) {
                func(e);
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                return false;
            }
        });
    },
    ctrl : function(el, key, func) {
        this.add(el, 'keydown', function(e) {
            if (e.ctrlKey && e.keyCode == key.toUpperCase().charCodeAt(0) && !e.shiftKey && !e.altKey) {
                func(e);
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                return false;
            }
        });
    },
    ready : function(func, win, doc) {
        var win = win || window;
        var doc = doc || document;
        var loaded = false;
        var readyFunc = function() {
            if (loaded) return;
            loaded = true;
            func();
        };
        if (doc.addEventListener) {
            this.add(doc, "DOMContentLoaded", readyFunc);
        } else if (doc.attachEvent){
            this.add(doc, "readystatechange", function() {
                if (doc.readyState == "complete") readyFunc();
            });
            if ( doc.documentElement.doScroll && typeof win.frameElement === "undefined" ) {
                var ieReadyFunc = function() {
                    if (loaded) return;
                    try {
                        doc.documentElement.doScroll("left");
                    } catch(e) {
                        setTimeout(ieReadyFunc, 0);
                        return;
                    }
                    readyFunc();
                };
                ieReadyFunc();
            }
        }
        this.add(win, 'load', readyFunc);
    }
};

KE.each = function(obj, func) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) func(key, obj[key]);
    }
};

KE.eachNode = function(node, func) {
    var walkNodes = function(parent) {
        if (KE.util.getNodeType(parent) != 1) return true;
        var n = parent.firstChild;
        while (n != null) {
            var next = n.nextSibling;
            if (!func(n)) return false;
            if (!walkNodes(n)) return false;
            n = next;
        }
        return true;
    };
    walkNodes(node);
};

KE.selection = function(win, doc) {
    this.sel = null;
    this.range = null;
    this.keRange = null;
    this.init = function() {
        var sel = win.getSelection ? win.getSelection() : doc.selection;
        var range;
        try {
            if (sel.rangeCount > 0) range = sel.getRangeAt(0);
            else range = sel.createRange();
        } catch(e) {}
        if (!range) range = KE.util.createRange(doc);
        this.sel = sel;
        this.range = range;
        var startNode, startPos, endNode, endPos;
        if (KE.browser == 'IE') {
            if (range.item) {
                var el = range.item(0);
                startNode = endNode = el;
                startPos = endPos = 0;
            } else {
                var getStartEnd = function(isStart) {
                    var pointRange = range.duplicate();
                    pointRange.collapse(isStart);
                    var parentNode = pointRange.parentElement();
                    var nodes = parentNode.childNodes;
                    if (nodes.length == 0) return {node: parentNode, pos: 0};
                    var startNode;
                    var endElement;
                    var startPos = 0;
                    var isEnd = false;
                    var testRange = range.duplicate();
                    testRange.moveToElementText(parentNode);
                    for (var i = 0, len = nodes.length; i < len; i++) {
                        var node = nodes[i];
                        var cmp = testRange.compareEndPoints('StartToStart', pointRange);
                        if (cmp > 0) {
                            isEnd = true;
                        } else if (cmp == 0) {
                            if (node.nodeType == 1) {
                                var keRange = new KE.range(doc);
                                keRange.selectTextNode(node);
                                return {node: keRange.startNode, pos: 0};
                            } else {
                                return {node: node, pos: 0};
                            }
                        }
                        if (node.nodeType == 1) {
                            var nodeRange = range.duplicate();
                            nodeRange.moveToElementText(node);
                            testRange.setEndPoint('StartToEnd', nodeRange);
                            if (isEnd) startPos += nodeRange.text.length;
                            else startPos = 0;
                        } else if (node.nodeType == 3) {
                            testRange.moveStart('character', node.nodeValue.length);
                            startPos += node.nodeValue.length;
                        }
                        if (!isEnd) startNode = node;
                    }
                    if (!isEnd && startNode.nodeType == 1) {
                        var startNode = parentNode.lastChild;
                        return {node: startNode, pos: startNode.nodeType == 1 ? 1 : startNode.nodeValue.length};
                    }
                    testRange = range.duplicate();
                    testRange.moveToElementText(parentNode);
                    testRange.setEndPoint('StartToEnd', pointRange);
                    startPos -= testRange.text.replace(/\r\n|\n|\r/g, '').length;
                    return {node: startNode, pos: startPos};
                };
                var start = getStartEnd(true);
                var end = getStartEnd(false);
                startNode = start.node;
                startPos = start.pos;
                endNode = end.node;
                endPos = end.pos;
            }
        } else {
            startNode = range.startContainer;
            startPos = range.startOffset;
            endNode = range.endContainer;
            endPos = range.endOffset;
            if (startNode.nodeType == 1 && typeof startNode.childNodes[startPos] != "undefined") {
                startNode = startNode.childNodes[startPos];
                startPos = 0;
            }
            if (endNode.nodeType == 1 && endPos > 0) {
                if (typeof endNode.childNodes[endPos - 1] != "undefined") {
                    endNode = endNode.childNodes[endPos - 1];
                    endPos = 0;
                }
            }
        }
        var keRange = new KE.range(doc);
        keRange.setTextStart(startNode, startPos);
        keRange.setTextEnd(endNode, endPos);
        this.keRange = keRange;
    };
    this.init();
    this.addRange = function(keRange) {
        this.keRange = keRange;
        if (KE.browser == 'IE') {
            var getEndRange = function(isStart) {
                var range = KE.util.createRange(doc);
                var node = isStart ? keRange.startNode : keRange.endNode;
                if (node.nodeType == 1) {
                    range.moveToElementText(node);
                    range.collapse(isStart);
                } else if (node.nodeType == 3) {
                    range = KE.util.getNodeStartRange(doc, node);
                    var pos = isStart ? keRange.startPos : keRange.endPos;
                    range.moveStart('character', pos);
                }
                return range;
            }
            if (!this.range.item) {
                var node = keRange.startNode;
                if (node == keRange.endNode && KE.util.getNodeType(node) == 1 && KE.util.getNodeTextLength(node) == 0) {
                    var temp = doc.createTextNode(" ");
                    node.appendChild(temp);
                    this.range.moveToElementText(node);
                    this.range.collapse(false);
                    this.range.select();
                    node.removeChild(temp);
                } else {
                    this.range.setEndPoint('StartToStart', getEndRange(true));
                    this.range.setEndPoint('EndToStart', getEndRange(false));
                    this.range.select();
                }
            }
        } else {
            var range = new KE.range(doc);
            range.setTextStart(keRange.startNode, keRange.startPos);
            range.setTextEnd(keRange.endNode, keRange.endPos);
            this.range.setStart(range.startNode, range.startPos);
            this.range.setEnd(range.endNode, range.endPos);
            this.sel.removeAllRanges();
            this.sel.addRange(this.range);
        }
    };
    this.focus = function() {
        if (KE.browser == 'IE' && this.range != null) this.range.select();
    }
};

KE.range = function(doc) {
    this.startNode = null;
    this.startPos = null;
    this.endNode = null;
    this.endPos = null;
    this.getParentElement = function() {
        var scanParent = function(node, func) {
            while (node != null && node.tagName != 'body') {
                node = node.parentNode;
                if (func(node)) return;
            }
        }
        var nodeList = [];
        scanParent(this.startNode, function(node) {
            nodeList.push(node);
        });
        var parentNode;
        scanParent(this.endNode, function(node) {
            if (KE.util.inArray(node, nodeList)) {
                parentNode = node;
                return true;
            }
        });
        return parentNode ? parentNode : doc.body;
    };
    this.getNodeList = function() {
        var parentNode = this.getParentElement();
        var nodeList = [];
        var keRange = this;
        var startNode = this.startNode;
        var isStarted = false;
        if (parentNode == startNode) isStarted = true;
        if (isStarted) nodeList.push(parentNode);
        KE.eachNode(parentNode, function(node) {
            if (node == startNode) isStarted = true;
            var range = new KE.range(doc);
            range.selectTextNode(node);
            if (range.comparePoints('START_TO_END', keRange) >= 0) return false;
            if (isStarted) nodeList.push(node);
            return true;
        });
        return nodeList;
    };
    this.comparePoints = function(how, range) {
        var compareNodes = function(nodeA, posA, nodeB, posB) {
            var cmp;
            if (KE.browser == 'IE') {
                var getStartRange = function(node, pos, isStart) {
                    var range = KE.util.createRange(doc);
                    var type = KE.util.getNodeType(node);
                    if (type == 1) {
                        range.moveToElementText(node);
                        range.collapse(isStart);
                    } else if (type == 3) {
                        range = KE.util.getNodeStartRange(doc, node);
                        range.moveStart('character', pos);
                        range.collapse(true);
                    }
                    return range;
                }
                var rangeA, rangeB;
                if (how == 'START_TO_START' || how == 'START_TO_END') rangeA = getStartRange(nodeA, posA, true);
                else rangeA = getStartRange(nodeA, posA, false);
                if (how == 'START_TO_START' || how == 'END_TO_START') rangeB = getStartRange(nodeB, posB, true);
                else rangeB = getStartRange(nodeB, posB, false);
                return rangeA.compareEndPoints('StartToStart', rangeB);
            } else {
                var rangeA = KE.util.createRange(doc);
                rangeA.selectNode(nodeA);
                if (how == 'START_TO_START' || how == 'START_TO_END') rangeA.collapse(true);
                else rangeA.collapse(false);
                var rangeB = KE.util.createRange(doc);
                rangeB.selectNode(nodeB);
                if (how == 'START_TO_START' || how == 'END_TO_START') rangeB.collapse(true);
                else rangeB.collapse(false);
                if (rangeA.compareBoundaryPoints(Range.START_TO_START, rangeB) > 0) {
                    cmp = 1;
                } else if (rangeA.compareBoundaryPoints(Range.START_TO_START, rangeB) == 0) {
                    if (posA > posB) cmp = 1;
                    else if (posA == posB) cmp = 0;
                    else cmp = -1;
                } else {
                    cmp = -1;
                }
            }
            return cmp;
        }
        if (how == 'START_TO_START') return compareNodes(this.startNode, this.startPos, range.startNode, range.startPos);
        if (how == 'START_TO_END') return compareNodes(this.startNode, this.startPos, range.endNode, range.endPos);
        if (how == 'END_TO_START') return compareNodes(this.endNode, this.endPos, range.startNode, range.startPos);
        if (how == 'END_TO_END') return compareNodes(this.endNode, this.endPos, range.endNode, range.endPos);
    };
    this.setTextStart = function(node, pos) {
        var textNode = node;
        KE.eachNode(node, function(n) {
            if (KE.util.getNodeType(n) == 3 && n.nodeValue.length > 0) {
                textNode = n;
                pos = 0;
                return false;
            }
            return true;
        });
        this.setStart(textNode, pos);
    };
    this.setStart = function(node, pos) {
        this.startNode = node;
        this.startPos = pos;
        if (this.endNode === null) {
            this.endNode = node;
            this.endPos = pos;
        }
    };
    this.setTextEnd = function(node, pos) {
        var textNode = node;
        KE.eachNode(node, function(n) {
            if (KE.util.getNodeType(n) == 3 && n.nodeValue.length > 0) {
                textNode = n;
                pos = n.nodeValue.length;
            }
            return true;
        });
        this.setEnd(textNode, pos);
    };
    this.setEnd = function(node, pos) {
        this.endNode = node;
        this.endPos = pos;
        if (this.startNode === null) {
            this.startNode = node;
            this.startPos = pos;
        }
    };
    this.selectNode = function(node) {
        this.setStart(node, 0);
        this.setEnd(node, node.nodeType == 1 ? 0 : node.nodeValue.length);
    };
    this.selectTextNode = function(node) {
        this.setTextStart(node, 0);
        this.setTextEnd(node, node.nodeType == 1 ? 0 : node.nodeValue.length);
    };
    this.extractContents = function(isDelete) {
        isDelete = (isDelete === false) ? false : true;
        var thisRange = this;
        var startNode = this.startNode;
        var startPos = this.startPos;
        var endNode = this.endNode;
        var endPos = this.endPos;
        var extractTextNode = function(node, startPos, endPos) {
            var length = node.nodeValue.length;
            var cloneNode = node.cloneNode(true);
            var centerNode = cloneNode.splitText(startPos);
            centerNode.splitText(endPos - startPos);
            if (isDelete) {
                var center = node;
                if (startPos > 0) center = node.splitText(startPos);
                if (endPos < length) center.splitText(endPos - startPos);
                center.parentNode.removeChild(center);
            }
            return centerNode;
        };
        var isStarted = false;
        var isEnd = false;
        var extractNodes = function(parent, frag) {
            if (KE.util.getNodeType(parent) != 1) return true;
            var node = parent.firstChild;
            while (node != null) {
                if (node == startNode) isStarted = true;
                if (node == endNode) isEnd = true;
                var nextNode = node.nextSibling;
                var type = KE.util.getNodeType(node);
                if (type == 1) {
                    var range = new KE.range(doc);
                    range.selectNode(node);
                    if (isStarted && range.comparePoints('END_TO_END', thisRange) < 0) {
                        var cloneNode = node.cloneNode(true);
                        frag.appendChild(cloneNode);
                        if (isDelete) {
                            node.parentNode.removeChild(node);
                        }
                    } else {
                        var childFlag = node.cloneNode(false);
                        frag.appendChild(childFlag);
                        if (!extractNodes(node, childFlag)) return false;
                    }
                } else if (type == 3) {
                    if (isStarted) {
                        var textNode;
                        if (node == startNode && node == endNode) {
                            textNode = extractTextNode(node, startPos, endPos);
                            frag.appendChild(textNode);
                            return false;
                        } else if (node == startNode) {
                            textNode = extractTextNode(node, startPos, node.nodeValue.length);
                            frag.appendChild(textNode);
                        } else if (node == endNode) {
                            textNode = extractTextNode(node, 0, endPos);
                            frag.appendChild(textNode);
                            return false;
                        } else {
                            textNode = extractTextNode(node, 0, node.nodeValue.length);
                            frag.appendChild(textNode);
                        }
                    }
                }
                node = nextNode;
                if (isEnd) return false;
            }
            return true;
        }
        var parentNode = this.getParentElement();
        var docFrag = parentNode.cloneNode(false);
        extractNodes(parentNode, docFrag);
        return docFrag;
    };
    this.cloneContents = function() {
        return this.extractContents(false);
    };
    this.getText = function() {
        var html = this.cloneContents().innerHTML;
        return html.replace(/<.*?>/g, "");
    };
};

KE.cmd = function(id) {
    this.doc = KE.g[id].iframeDoc;
    this.keSel = KE.g[id].keSel;
    this.keRange = KE.g[id].keRange;
    this.mergeAttributes = function(el, attr) {
        for (var i = 0, len = attr.length; i < len; i++) {
            KE.each(attr[i], function(key, value) {
                if (key.charAt(0) == '.') {
                    var jsKey = KE.util.getJsKey(key.substr(1));
                    eval('el.style.' + jsKey + ' = value;');
                } else {
                    el.setAttribute(key, value);
                }
            });
        }
        return el;
    };
    this.wrapTextNode = function(node, startPos, endPos, element, attributes) {
        var length = node.nodeValue.length;
        var isFull = (startPos == 0 && endPos == length);
        var range = new KE.range(this.doc);
        range.selectTextNode(node.parentNode);
        if (isFull &&
            node.parentNode.tagName == element.tagName &&
            range.comparePoints('END_TO_END', this.keRange) <= 0 &&
            range.comparePoints('START_TO_START', this.keRange) >= 0) {
            this.mergeAttributes(node.parentNode, attributes);
            return node;
        } else {
            var el = element.cloneNode(true);
            if (isFull) {
                var cloneNode = node.cloneNode(true);
                el.appendChild(cloneNode);
                node.parentNode.replaceChild(el, node);
                return cloneNode;
            } else {
                var centerNode = node;
                if (startPos < endPos) {
                    if (startPos > 0) centerNode = node.splitText(startPos);
                    if (endPos < length) centerNode.splitText(endPos - startPos);
                    var cloneNode = centerNode.cloneNode(true);
                    el.appendChild(cloneNode);
                    centerNode.parentNode.replaceChild(el, centerNode);
                    return cloneNode;
                } else {
                    if (startPos < length) {
                        centerNode = node.splitText(startPos);
                        centerNode.parentNode.insertBefore(el, centerNode);
                    } else {
                        if (centerNode.nextSibling) {
                            centerNode.parentNode.insertBefore(el, centerNode.nextSibling);
                        } else {
                            centerNode.parentNode.appendChild(el);
                        }
                    }
                    return el;
                }
            }
        }
    };
    this.wrap = function(tagName, attributes) {
        var self = this;
        this.keSel.focus();
        var element = KE.$$(tagName, this.doc);
        this.mergeAttributes(element, attributes);
        var keRange = this.keRange;
        var startNode = keRange.startNode;
        var startPos = keRange.startPos;
        var endNode = keRange.endNode;
        var endPos = keRange.endPos;
        var parentNode = keRange.getParentElement();
        var isStarted = false;
        KE.eachNode(parentNode, function(node) {
            if (node == startNode) isStarted = true;
            if (node.nodeType == 1) {
                if (node == startNode && node == endNode) {
                    if (KE.util.inArray(node.tagName.toLowerCase(), KE.setting.noEndTags)) {
                        if (startPos > 0) node.parentNode.appendChild(element);
                        else node.parentNode.insertBefore(element, node);
                    } else {
                        node.appendChild(element);
                    }
                    keRange.selectNode(element);
                    return false;
                } else if (node == startNode) {
                    keRange.setStart(node, 0);
                } else if (node == endNode) {
                    keRange.setEnd(node, 0);
                    return false;
                }
            } else if (node.nodeType == 3) {
                if (isStarted) {
                    if (node == startNode && node == endNode) {
                        var rangeNode = self.wrapTextNode(node, startPos, endPos, element, attributes);
                        keRange.selectNode(rangeNode);
                        return false;
                    } else if (node == startNode) {
                        var rangeNode = self.wrapTextNode(node, startPos, node.nodeValue.length, element, attributes);
                        keRange.setStart(rangeNode, 0);
                    } else if (node == endNode) {
                        var rangeNode = self.wrapTextNode(node, 0, endPos, element, attributes);
                        keRange.setEnd(rangeNode, rangeNode.nodeType == 1 ? 0 : rangeNode.nodeValue.length);
                        return false;
                    } else {
                        self.wrapTextNode(node, 0, node.nodeValue.length, element, attributes);
                    }
                }
            }
            return true;
        });
        this.keSel.addRange(keRange);
    };
    this.getTopParent = function(tagNames, node) {
        var parent = null;
        while (node != null) {
            node = node.parentNode;
            if (KE.util.inArray(node.tagName.toLowerCase(), tagNames)) {
                parent = node;
            } else {
                break;
            }
        }
        return parent;
    };
    this.splitNodeParent = function(parent, node, pos) {
        var leftRange = new KE.range(this.doc);
        leftRange.selectNode(parent.firstChild);
        leftRange.setEnd(node, pos);
        var leftFrag = leftRange.extractContents();
        parent.parentNode.insertBefore(leftFrag, parent);
        return {left : leftFrag, right : parent};
    };
    this.remove = function(tagNames, attributes) {
        var keRange = this.keRange;
        var startNode = keRange.startNode;
        var startPos = keRange.startPos;
        var endNode = keRange.endNode;
        var endPos = keRange.endPos;
        this.keSel.focus();
        if (keRange.getText().replace(/\s+/g, '') === '') return;
        var startParent = this.getTopParent(tagNames, startNode);
        var endParent = this.getTopParent(tagNames, endNode);
        if (startParent) {
            var startFrags = this.splitNodeParent(startParent, startNode, startPos);
            keRange.setStart(startFrags.right, 0);
            if (startNode == endNode && KE.util.getNodeTextLength(startFrags.right) > 0) {
                keRange.selectNode(startFrags.right);
                var range = new KE.range(this.doc);
                range.selectTextNode(startFrags.left);
                if (startPos > 0) endPos -= range.endNode.nodeValue.length;
                range.selectTextNode(startFrags.right);
                endNode = range.startNode;
            }
        }
        if (endParent) {
            var endFrags = this.splitNodeParent(endParent, endNode, endPos);
            this.keRange.setEnd(endFrags.left, 0);
            if (startParent == endParent) {
                keRange.setStart(endFrags.left, 0);
            }
        }
        var nodeList = keRange.getNodeList();
        keRange.setTextStart(keRange.startNode, keRange.startPos);
        keRange.setTextEnd(keRange.endNode, keRange.endPos);
        for (var i = 0; i < nodeList.length; i++) {
            var node = nodeList[i];
            if (node.nodeType == 1) {
                if (KE.util.inArray(node.tagName.toLowerCase(), tagNames)) {
                    KE.util.removeParent(node);
                } else {
                    for (var j = 0; j < attributes.length; j++) {
                        node.removeAttribute(attributes[j]);
                    }
                }
            }
        }
        try {
            this.keSel.addRange(keRange);
        } catch(e) {}
    };
};

KE.format = {
    getUrl : function(url, mode) {
        if (!mode) return url;
        mode = mode.toLowerCase();
        if (!KE.util.inArray(mode, ['absolute', 'relative', 'domain'])) return url;
        if (url.match(/^https?:\/\/([^\/]+)/i)) {
            if (RegExp.$1 !== location.host) return url;
        }
        var host = location.protocol + '//' + location.host;
        var pathname = '/';
        if (location.pathname.match(/^\/(.*)\//)) {
            pathname = RegExp.$1;
        }
        var getRealPath = function(path) {
            var parts = path.split('/');
            paths = [];
            for (var i = 0, len = parts.length; i < len; i++) {
                var part = parts[i];
                if (part == '..') {
                    if (paths.length > 0) paths.pop();
                } else if (part !== '' && part != '.') {
                    paths.push(part);
                }
            }
            return '/' + paths.join('/');
        };
        if (url.match(/^\//)) {
            url = host + getRealPath(url.substr(1));
        } else if (!url.match(/^https?:\/\//i)) {
            url = host + getRealPath(pathname + '/' + url);
        }
        if (mode == 'relative') {
            var getRelativePath = function(path, depth) {
                if (url.substr(0, path.length) === path) {
                    var arr = [];
                    for (var i = 0; i < depth; i++) {
                        arr.push('..');
                    }
                    var prefix = '.';
                    if (arr.length > 0) prefix += '/' + arr.join('/');
                    return prefix + url.substr(path.length);
                } else {
                    if (path.match(/^(.*)\//)) {
                        path = RegExp.$1;
                        return getRelativePath(path, ++depth);
                    }
                }
            };
            var url = getRelativePath(host + '/' + pathname, 0);
        } else if (mode == 'absolute') {
            if (url.substr(0, host.length) === host) {
                url = url.substr(host.length);
            }
        }
        return url;
    },
    getHtml : function(html, htmlTags, urlType) {
        var isFilter = htmlTags ? true : false;
        var htmlTagHash = {};
        if (isFilter) {
            KE.each(htmlTags, function(key, val) {
                var arr = key.split(',');
                for (var i = 0, len = arr.length; i < len; i++) htmlTagHash[arr[i]] = KE.util.arrayToHash(val);
            });
        }
        var noEndTagHash = KE.util.arrayToHash(KE.setting.noEndTags);
        var inlineTagHash = KE.util.arrayToHash(KE.setting.inlineTags);
        html = html.replace(/\r\n|\n|\r/g, '');
        html = html.replace(/<(\/)?(\w+)(.*?)(\/)?>/g, function($0, $1, $2, $3, $4) {
            var startSlash = $1 || '';
            var tagName = $2.toLowerCase();
            var attr = $3 || '';
            var endSlash = $4 || '';
            if (isFilter && typeof htmlTagHash[tagName] == "undefined") return '';
            if (endSlash === '' && typeof noEndTagHash[tagName] != "undefined") endSlash = ' /';
            var nl = '';
            if (endSlash && typeof inlineTagHash[tagName] == "undefined") nl = "\r\n";
            if (attr !== '') {
                attr = attr.replace(/\s*([^\s]+?)=(".*?"|[^\s]*)/g, function($0, $1, $2) {
                    var key = $1.toLowerCase();
                    var val = $2 || '';
                    if (isFilter) {
                        if (key.charAt(0) === "." || (key !== "style" && typeof htmlTagHash[tagName][key] == "undefined")) return ' ';
                    }
                    if (val === '') {
                        val = '""';
                    } else {
                        if (key === "style") {
                            val = val.substr(1, val.length - 2);
                            val = val.replace(/\s*([^\s]+?)\s*:(.*?)(;|$)/g, function($0, $1, $2) {
                                var k = $1.toLowerCase();
                                if (isFilter) {
                                    if (typeof htmlTagHash[tagName]['.' + k] == "undefined") return '';
                                }
                                var v = KE.util.trim($2.toLowerCase());
                                v = KE.util.rgbToHex(v);
                                return k + ':' + v + ';';
                            });
                            val = KE.util.trim(val);
                            if (val === '') return '';
                            val = '"' + val + '"';
                        }
                        if (KE.util.inArray(key, ['src', 'href'])) {
                            if (val.charAt(0) === '"') {
                                val = val.substr(1, val.length - 2);
                            }
                            val = KE.format.getUrl(val, urlType);
                        }
                        if (val.charAt(0) !== '"') val = '"' + val + '"';
                    }
                    return ' ' + key + '=' + val + ' ';
                });
                attr = attr.replace(/\s+(checked|selected|disabled|readonly)(\s+|$)/ig, function($0, $1) {
                    var key = $1.toLowerCase();
                    if (isFilter) {
                        if (key.charAt(0) === "." || typeof htmlTagHash[tagName][key] == "undefined") return ' ';
                    }
                    return ' ' + key + '="' + key + '"' + ' ';
                });
                attr = KE.util.trim(attr);
                attr = attr.replace(/\s+/g, ' ');
                if (attr) attr = ' ' + attr;
                return '<' + startSlash + tagName + attr + endSlash + '>' + nl;
            } else {
                return '<' + startSlash + tagName + endSlash + '>' + nl;
            }
        });
        if (isFilter) {
            var reg = KE.setting.inlineTags.join('|');
            var trimHtml = function(inHtml) {
                var outHtml = inHtml.replace(new RegExp('<(' + reg + ')[^>]*><\\/(' + reg + ')>', 'ig'), function($0, $1, $2) {
                    if ($1 == $2) return '';
                    else return $0;
                });
                if (inHtml !== outHtml) outHtml = trimHtml(outHtml);
                return outHtml;
            };
            return trimHtml(html);
        } else {
            return html;
        }
    }
};

KE.util = {
    getDocumentElement : function(doc) {
        doc = doc || document;
        return (doc.compatMode != "CSS1Compat") ? doc.body : doc.documentElement;
    },
    getDocumentHeight : function(doc) {
        var el = this.getDocumentElement(doc);
        return Math.max(el.scrollHeight, el.clientHeight);
    },
    getDocumentWidth : function(doc) {
        var el = this.getDocumentElement(doc);
        return Math.max(el.scrollWidth, el.clientWidth);
    },
    createTable : function(doc) {
        var table = KE.$$('table', doc);
        table.cellPadding = 0;
        table.cellSpacing = 0;
        table.border = 0;
        return {table: table, cell: table.insertRow(0).insertCell(0)};
    },
    loadStyle : function(path) {
        var link = KE.$$('link');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', path);
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    inArray : function(str, arr) {
        for (var i = 0; i < arr.length; i++) {if (str == arr[i]) return true;}
        return false;
    },
    trim : function(str) {
        return str.replace(/^\s+|\s+$/g, "");
    },
    getJsKey : function(key) {
        var arr = key.split('-');
        key = '';
        for (var i = 0, len = arr.length; i < len; i++) {
            key += (i > 0) ? arr[i].charAt(0).toUpperCase() + arr[i].substr(1) : arr[i];
        }
        return key;
    },
    arrayToHash : function(arr) {
        var hash = {};
        for (var i = 0, len = arr.length; i < len; i++) hash[arr[i]] = 1;
        return hash;
    },
    escape : function(html) {
        html = html.replace(/&/g, "&amp;");
        html = html.replace(/</g, "&lt;");
        html = html.replace(/>/g, "&gt;");
        html = html.replace(/\xA0/g, "&nbsp;");
        html = html.replace(/\x20/g, " ");
        return html;
    },
    getScrollPos : function() {
        var x, y;
        if (KE.browser == 'IE' || KE.browser == 'OPERA') {
            var el = this.getDocumentElement();
            x = el.scrollLeft;
            y = el.scrollTop;
        } else {
            x = window.scrollX;
            y = window.scrollY;
        }
        return {x : x, y : y};
    },
    getElementPos : function(el) {
        var box = el.getBoundingClientRect();
        var el = this.getDocumentElement();
        var pos = this.getScrollPos();
        var x = box.left + pos.x - el.clientLeft;
        var y = box.top + pos.y - el.clientTop;
        return {x : x, y : y};
    },
    getCoords : function(ev) {
        ev = ev || window.event;
        return {
            x : ev.clientX,
            y : ev.clientY
        };
    },
    setOpacity : function(el, opacity) {
        if (typeof el.style.opacity == "undefined") {
            el.style.filter = (opacity == 100) ? "" : "alpha(opacity=" + opacity + ")";
        } else {
            el.style.opacity = (opacity == 100) ? "" : "0." + opacity.toString();
        }
    },
    getIframeDoc : function(iframe) {
        return iframe.contentDocument || iframe.contentWindow.document;
    },
    rgbToHex : function(str) {
        function hex(s) {
            s = parseInt(s).toString(16);
            return s.length > 1 ? s : '0' + s;
        };
        return str.replace(/rgb\s*?\(\s*?(\d+)\s*?,\s*?(\d+)\s*?,\s*?(\d+)\s*?\)/ig,
                           function($0, $1, $2, $3) {
                               return '#' + hex($1) + hex($2) + hex($3);
                           }
                          );
    },
    createRange : function(doc) {
        return doc.createRange ? doc.createRange() : doc.body.createTextRange();
    },
    getNodeType : function(node) {
        return (node.nodeType == 1 && KE.util.inArray(node.tagName.toLowerCase(), KE.setting.noEndTags)) ? 88 : node.nodeType;
    },
    getNodeTextLength : function(node) {
        var type = KE.util.getNodeType(node);
        if (type == 1) {
            var html = node.innerHTML;
            return html.replace(/<.*?>/ig, "").length;
        } else if (type == 3) {
            return node.nodeValue.length;
        }
    },
    getNodeStartRange : function(doc, node) {
        var range = KE.util.createRange(doc);
        var type = node.nodeType;
        if (type == 1) {
            range.moveToElementText(node);
            return range;
        } else if (type == 3) {
            var offset = 0;
            var sibling = node.previousSibling;
            while (sibling) {
                if (sibling.nodeType == 1) {
                    var nodeRange = KE.util.createRange(doc);
                    nodeRange.moveToElementText(sibling);
                    range.setEndPoint('StartToEnd', nodeRange);
                    range.moveStart('character', offset);
                    return range;
                } else if (sibling.nodeType == 3) {
                    offset += sibling.nodeValue.length;
                }
                sibling = sibling.previousSibling;
            }
            range.moveToElementText(node.parentNode);
            range.moveStart('character', offset);
            return range;
        }
    },
    removeParent : function(parent) {
        if (parent.hasChildNodes) {
            var node = parent.firstChild;
            while (node != null) {
                var nextNode = node.nextSibling;
                parent.parentNode.insertBefore(node, parent);
                node = nextNode;
            }
        }
        parent.parentNode.removeChild(parent);
    },
    drag : function(id, mousedownObj, moveObj, func) {
        var obj = KE.g[id];
        mousedownObj.onmousedown = function(e) {
            e = e || window.event;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            var pos = KE.util.getCoords(e);
            var objTop = parseInt(moveObj.style.top);
            var objLeft = parseInt(moveObj.style.left);
            var objWidth = moveObj.style.width;
            var objHeight = moveObj.style.height;
            if (objWidth.match(/%$/)) objWidth = moveObj.offsetWidth + 'px';
            if (objHeight.match(/%$/)) objHeight = moveObj.offsetHeight + 'px';
            objWidth = parseInt(objWidth);
            objHeight = parseInt(objHeight);
            var mouseTop = pos.y;
            var mouseLeft = pos.x;
            var dragFlag = true;
            var moveListener = function(e) {
                if (dragFlag) {
                    var pos = KE.util.getCoords(e);
                    var top = pos.y - mouseTop;
                    var left = pos.x - mouseLeft;
                    func(objTop, objLeft, objWidth, objHeight, top, left);
                }
            };
            var iframePos = KE.util.getElementPos(obj.iframe);
            var iframeMoveListener = function(e) {
                if (dragFlag) {
                    var pos = KE.util.getCoords(e, obj.iframeDoc);
                    var top = iframePos.y + pos.y - mouseTop;
                    var left = iframePos.x + pos.x - mouseLeft;
                    func(objTop, objLeft, objWidth, objHeight, top, left);
                }
            };
            var upListener = function(e) {
                dragFlag = false;
                KE.event.remove(document, 'mousemove', moveListener);
                KE.event.remove(document, 'mouseup', upListener);
                KE.event.remove(obj.iframeDoc, 'mousemove', iframeMoveListener);
                KE.event.remove(obj.iframeDoc, 'mouseup', upListener);
            };
            KE.event.add(document, 'mousemove', moveListener);
            KE.event.add(document, 'mouseup', upListener);
            KE.event.add(obj.iframeDoc, 'mousemove', iframeMoveListener);
            KE.event.add(obj.iframeDoc, 'mouseup', upListener);
        };
    },
    setDefaultPlugin : function(id) {
        var items = [
            'cut', 'copy', 'paste', 'selectall', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript','superscript',
            'bold', 'italic', 'underline', 'strikethrough', 'unlink'
        ];
        for (var i = 0; i < items.length; i++) {
            KE.plugin[items[i]] = {
                click : new Function('id', 'KE.util.execCommand(id, "' + items[i] + '", null);')
            };
        }
    },
    getFullHtml : function(id, tagLineMode) {
        var html = '<html>';
        html += '<head>';
        html += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
        html += '<title>KindEditor</title>';
        if (tagLineMode) {
            html += '<link href="' + KE.g[id].skinsPath + 'editor.css" rel="stylesheet" type="text/css" />';
        }
        if (KE.g[id].cssPath) {
            html += '<link href="' + KE.g[id].cssPath + '" rel="stylesheet" type="text/css" />';
        }
        html += '</head>';
        html += '<body class="ke-content"></body>';
        html += '</html>';
        return html;
    },
    resize : function(id, width, height, isCheck, isResizeWidth) {
        isResizeWidth = (typeof isResizeWidth == "undefined") ? true : isResizeWidth;
        var obj = KE.g[id];
        if (!obj.container) return;
        if (isCheck && (parseInt(width) <= obj.minWidth || parseInt(height) <= obj.minHeight)) return;
        if (isResizeWidth) obj.container.style.width = width;
        obj.container.style.height = height;
        if (!obj.toolbarTable.offsetHeight) {
            setTimeout(function () {
                KE.util.resize(id, width, height, isCheck, isResizeWidth);
            }, 0);
            return;
        }
        var diff = parseInt(height) - obj.toolbarTable.offsetHeight - obj.bottom.offsetHeight;
        if (diff >= 0) {
            obj.textareaTable.style.height = diff + 'px';
            obj.iframe.style.height = diff + 'px';
            obj.newTextarea.style.height = diff + 'px';
        }
    },
    getData : function(id) {
        var obj = KE.g[id];
        if (!obj.wyswygMode) {
            obj.iframeDoc.body.innerHTML = obj.newTextarea.value;
        }
        if (obj.filterMode) {
            return KE.format.getHtml(obj.iframeDoc.body.innerHTML, obj.htmlTags, obj.urlType);
        } else {
            return KE.format.getHtml(obj.iframeDoc.body.innerHTML, null, obj.urlType);
        }
    },
    getSrcData : function(id) {
        var obj = KE.g[id];
        if (!obj.wyswygMode) {
            obj.iframeDoc.body.innerHTML = obj.newTextarea.value;
        }
        return obj.iframeDoc.body.innerHTML;
    },
    getPureData : function(id) {
        var data = this.getSrcData(id);
        data = data.replace(/<br[\s\/]{0,2}>/ig, "\r\n");
        data = data.replace(/<.*?>/ig, "");
        data = data.replace(/&nbsp;/ig, "");
        return data;
    },
    setData : function(id) {
        KE.g[id].srcTextarea.value = this.getData(id);
    },
    focus : function(id) {
        if (KE.g[id].wyswygMode) {
            KE.g[id].iframeWin.focus();
        } else {
            KE.g[id].newTextarea.focus();
        }
    },
    click : function(id, cmd) {
        KE.layout.hide(id);
        KE.util.focus(id);
        KE.plugin[cmd].click(id);
    },
    selection : function(id) {
        var win = KE.g[id].iframeWin;
        var doc = KE.g[id].iframeDoc;
        KE.g[id].keSel = new KE.selection(win, doc);
        KE.g[id].keRange = KE.g[id].keSel.keRange;
        KE.g[id].sel = KE.g[id].keSel.sel;
        KE.g[id].range = KE.g[id].keSel.range;
    },
    select : function(id) {
        if (KE.browser == 'IE') KE.g[id].range.select();
    },
    pToBr : function(id) {
        if(KE.browser == 'IE') {
            KE.event.add(KE.g[id].iframeDoc, 'keydown', function(e) {
                if (e.keyCode == 13) {
                    KE.util.selection(id);
                    if(KE.g[id].range.parentElement().tagName != 'LI') {
                        KE.util.insertHtml(id, '<br />');
                        KE.util.select(id);
                        return false;
                    }
                }
            });
        }
    },
    hideLoadingPage : function(id) {
        var stack = KE.g[id].dialogStack;
        var dialog = stack[stack.length - 1];
        dialog.loading.style.display = 'none';
        dialog.iframe.style.display = '';
    },
    showLoadingPage : function(id) {
        var stack = KE.g[id].dialogStack;
        var dialog = stack[stack.length - 1];
        dialog.loading.style.display = '';
        dialog.iframe.style.display = 'none';
    },
    execCommand : function(id, cmd, value) {
        try {
            KE.g[id].iframeDoc.execCommand(cmd, false, value);
        } catch(e) {}
        KE.toolbar.updateState(id);
        KE.history.add(id, false);
    },
    insertHtml : function(id, html) {
        if (html == '') return;
        KE.util.select(id);
        if (KE.browser == 'IE') {
            if (KE.g[id].sel.type.toLowerCase() == 'control') {
                KE.g[id].range.item(0).outerHTML = html;
            } else {
                KE.g[id].range.pasteHTML(html);
            }
            KE.history.add(id, false);
        } else {
            this.execCommand(id, 'inserthtml', html);
        }
    }
};

KE.layout = {
    hide : function(id) {
        KE.g[id].hideDiv.innerHTML = '';
        KE.g[id].hideDiv.style.display = 'none';
        KE.g[id].maskDiv.style.display = 'none';
    }
};

KE.menu = function(arg){
    this.getPos = function() {
        var id = arg.id;
        var x = 0;
        var y = 0;
        if (this.type == 'menu') {
            var obj = KE.g[id].toolbarIcon[arg.cmd];
            var pos = KE.util.getElementPos(obj[0]);
            x = pos.x;
            y = pos.y + obj[0].offsetHeight;
        } else {
            var pos = KE.util.getCoords(arg.event);
            var iframePos = KE.util.getElementPos(KE.g[id].iframe);
            x = pos.x + iframePos.x;
            y = pos.y + iframePos.y + 5;
        }
        return { x : x, y : y };
    };
    this.init = function() {
        this.type = (arg.type && arg.type == 'contextmenu') ? arg.type : 'menu';
        var div = KE.$$('div');
        div.className = 'ke-' + this.type;
        var pos = this.getPos();
        div.style.top = pos.y + 'px';
        div.style.left = pos.x + 'px';
        this.div = div;
    };
    this.init();
    this.add = function(html, event) {
        var self = this;
        var cDiv = KE.$$('div');
        cDiv.className = 'ke-' + this.type + '-noselected';
        cDiv.style.width = arg.width;
        cDiv.onmouseover = function() { this.className = 'ke-' + self.type + '-selected'; }
        cDiv.onmouseout = function() { this.className = 'ke-' + self.type + '-noselected'; }
        cDiv.onclick = event;
        cDiv.innerHTML = html;
        this.append(cDiv);
    };
    this.append = function(el) {
        this.div.appendChild(el);
    };
    this.insert = function(html) {
        this.div.innerHTML = html;
    };
    this.hide = function() {
        KE.layout.hide(arg.id);
    };
    this.show = function() {
        this.hide();
        var id = arg.id;
        KE.g[id].hideDiv.style.display = '';
        KE.g[id].hideDiv.appendChild(this.div);
    };
    this.picker = function() {
        var colorTable = KE.setting.colorTable;
        var table = KE.$$('table');
        table.cellPadding = 0;
        table.cellSpacing = 0;
        table.border = 0;
        table.style.margin = 0;
        table.style.padding = 0;
        table.style.borderCollapse = 'separate';
        for (var i = 0; i < colorTable.length; i++) {
            var row = table.insertRow(i);
            for (var j = 0; j < colorTable[i].length; j++) {
                var cell = row.insertCell(j);
                cell.className = 'ke-picker-cell';
                cell.style.backgroundColor = colorTable[i][j];
                cell.title = colorTable[i][j];
                cell.onmouseover = function() {this.style.borderColor = '#000000'; }
                cell.onmouseout = function() {this.style.borderColor = '#F0F0EE'; }
                cell.onclick = new Function('KE.plugin["' + arg.cmd + '"].exec("' +
                                            arg.id + '", "' + colorTable[i][j] + '")');
                cell.innerHTML = '&nbsp;';
            }
        }
        this.append(table);
        this.show();
    };
};

KE.dialog = function(arg){
    this.widthMargin = 20;
    this.heightMargin = 90;
    this.zIndex = 19811214;
    this.getPos = function() {
        var id = arg.id;
        var obj = KE.g[id];
        var el = KE.util.getDocumentElement();
        var width = arg.width + this.widthMargin;
        var height = arg.height + this.heightMargin;
        var x = Math.round((el.clientWidth - width) / 2);
        var y = Math.round((el.clientHeight - height) / 2);
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        return {x : x, y : y};
    };
    this.hide = function() {
        var id = arg.id;
        var stack = KE.g[id].dialogStack;
        if (stack[stack.length - 1] != this) return false;
        stack.pop();
        KE.g[id].hideDiv.removeChild(this.div);
        if (stack.length < 1) {
            KE.g[id].hideDiv.style.display = 'none';
            KE.g[id].maskDiv.style.display = 'none';
        }
        if (arg.hideHandler) arg.hideHandler();
        KE.util.focus(id);
    };
    this.show = function() {
        var self = this;
        var id = arg.id;
        var div = KE.$$('div');
        div.className = 'ke-dialog';
        var stack = KE.g[id].dialogStack;
        if (stack.length > 0) {
            this.zIndex = stack[stack.length - 1].zIndex + 1;
        }
        div.style.zIndex = this.zIndex;
        var pos = this.getPos();
        div.style.width = (arg.width + this.widthMargin) + 'px';
        div.style.height = (arg.height + this.heightMargin) + 'px';
        div.style.top = pos.y + 'px';
        div.style.left = pos.x + 'px';
        var titleDiv = KE.$$('div');
        titleDiv.className = 'ke-dialog-title';
        titleDiv.innerHTML = arg.title;
        var span = KE.$$('span');
        var url = KE.g[id].skinsPath + KE.g[id].skinType + '.gif';
        span.style.backgroundImage = "url(" + url + ")";
        span.className = "ke-toolbar-close";
        span.alt = KE.lang['close'];
        span.title = KE.lang['close'];
        span.onclick = function () { self.hide(); };
        titleDiv.appendChild(span);
        KE.util.drag(id, titleDiv, div, function(objTop, objLeft, objWidth, objHeight, top, left) {
            div.style.top = (objTop + top) + 'px';
            div.style.left = (objLeft + left) + 'px';
        });
        div.appendChild(titleDiv);
        var bodyDiv = KE.$$('div');
        bodyDiv.className = 'ke-dialog-body';
        var loadingTable = KE.util.createTable();
        loadingTable.table.style.width = arg.width + 'px';
        loadingTable.table.style.height = arg.height + 'px';
        loadingTable.cell.align = 'center';
        loadingTable.cell.valign = 'middle';
        loadingTable.cell.style.fontSize = '12px';
        var loadingImg = KE.$$('img');
        loadingImg.src = KE.g[id].skinsPath + 'loading.gif';
        loadingImg.width = 16;
        loadingImg.height = 16;
        loadingImg.align = 'absmiddle';
        loadingImg.alt = KE.lang['loading'];
        loadingTable.cell.appendChild(loadingImg);
        loadingTable.cell.innerHTML += ' ' + KE.lang['loading'];
        var iframe = KE.$$('iframe');
        if (arg.useFrameCSS) {
            iframe.className = 'ke-dialog-iframe';
        }
        iframe.width = arg.width + 'px';
        iframe.height = arg.height + 'px';
        iframe.setAttribute("frameBorder", "0");
        iframe.style.display = 'none';
        bodyDiv.appendChild(iframe);
        bodyDiv.appendChild(loadingTable.table);
        div.appendChild(bodyDiv);

        var bottomDiv = KE.$$('div');
        bottomDiv.className = 'ke-dialog-bottom';
        var noButton = null;
        var yesButton = null;
        var previewButton = null;
        if (arg.noButton) {
            noButton = KE.$$('input');
            noButton.className = 'ke-dialog-no';
            noButton.type = 'button';
            noButton.name = 'noButton';
            noButton.value = arg.noButton;
            noButton.onclick = function () {
                self.hide();
                KE.util.select(id);
            };
            bottomDiv.appendChild(noButton);
        }
        if (arg.yesButton) {
            yesButton = KE.$$('input');
            yesButton.className = 'ke-dialog-yes';
            yesButton.type = 'button';
            yesButton.name = 'yesButton';
            yesButton.value = arg.yesButton;
            yesButton.onclick = function() {
                var stack = KE.g[id].dialogStack;
                if (stack[stack.length - 1] == self) {
                    KE.plugin[arg.cmd].exec(id);
                }
            };
            bottomDiv.appendChild(yesButton);
        }
        if (arg.previewButton) {
            previewButton = KE.$$('input');
            previewButton.className = 'ke-dialog-preview';
            previewButton.type = 'button';
            previewButton.name = 'previewButton';
            previewButton.value = arg.previewButton;
            previewButton.onclick = function() {
                var stack = KE.g[id].dialogStack;
                if (stack[stack.length - 1] == self) {
                    KE.plugin[arg.cmd].preview(id);
                }
            };
            bottomDiv.appendChild(previewButton);
        }
        div.appendChild(bottomDiv);
        KE.g[id].hideDiv.style.display = '';
        KE.g[id].hideDiv.appendChild(div);
        window.focus();
        if (yesButton) yesButton.focus();
        else if (noButton) noButton.focus();
        if (typeof arg.html != "undefined") {
            var dialogDoc = KE.util.getIframeDoc(iframe);
            var html = KE.util.getFullHtml(id, false);
            dialogDoc.open();
            dialogDoc.write(html);
            dialogDoc.close();
            dialogDoc.body.innerHTML = arg.html;
        } else {
            if (typeof arg.file == "undefined") {
                iframe.src = KE.g[id].pluginsPath + arg.cmd + '.html';
            } else {
                iframe.src = KE.g[id].pluginsPath + arg.file;
            }
        }
        KE.g[id].maskDiv.style.width = KE.util.getDocumentWidth() + 'px';
        KE.g[id].maskDiv.style.height = KE.util.getDocumentHeight() + 'px';
        KE.g[id].maskDiv.style.display = 'block';
        this.iframe = iframe;
        this.loading = loadingTable.table;
        this.noButton = noButton;
        this.yesButton = yesButton;
        this.previewButton = previewButton;
        this.div = div;
        KE.g[id].dialogStack.push(this);
        KE.g[id].dialog = iframe;
        KE.g[id].yesButton = yesButton;
        KE.g[id].noButton = noButton;
        KE.g[id].previewButton = previewButton;
        if (!arg.loadingMode) KE.util.hideLoadingPage(id);
    };
};

KE.toolbar = {
    updateState : function(id) {
        var cmdList = [
            'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript','superscript',
            'bold', 'italic', 'underline', 'strikethrough'
        ];
        for (var i = 0; i < cmdList.length; i++) {
            var cmd = cmdList[i];
            var state = false;
            try {
                state = KE.g[id].iframeDoc.queryCommandState(cmd);
            } catch(e) {}
            if (state) {
                KE.toolbar.select(id, cmd);
            } else {
                KE.toolbar.unselect(id, cmd);
            }
        }
    },
    isSelected : function(id, cmd) {
        if (KE.plugin[cmd] && KE.plugin[cmd].isSelected) return true;
        else return false;
    },
    select : function(id, cmd) {
        if (KE.g[id].toolbarIcon[cmd]) {
            var a = KE.g[id].toolbarIcon[cmd][0];
            a.className = "ke-icon-selected";
            a.onmouseover = null;
            a.onmouseout = null;
        }
    },
    unselect : function(id, cmd) {
        if (KE.g[id].toolbarIcon[cmd]) {
            var a = KE.g[id].toolbarIcon[cmd][0];
            a.className = "ke-icon";
            a.onmouseover = function(){ this.className = "ke-icon-on"; };
            a.onmouseout = function(){ this.className = "ke-icon"; };
        }
    },
    able : function(id, arr) {
        KE.each(KE.g[id].toolbarIcon, function(cmd, obj) {
            if (!KE.util.inArray(cmd, arr)) {
                var a = obj[0];
                var span = obj[1];
                a.className = 'ke-icon';
                KE.util.setOpacity(span, 100);
                a.onclick = new Function('KE.util.click("' + id + '", "' + cmd + '");');
                a.onmouseover = function(){ this.className = "ke-icon-on"; };
                a.onmouseout = function(){ this.className = "ke-icon"; };
            }
        });
    },
    disable : function(id, arr) {
        KE.each(KE.g[id].toolbarIcon, function(cmd, obj) {
            if (!KE.util.inArray(cmd, arr)) {
                var a = obj[0];
                var span = obj[1];
                a.className = 'ke-icon-disabled';
                KE.util.setOpacity(span, 50);
                a.onclick = null;
                a.onmouseover = null;
                a.onmouseout = null;
            }
        });
    },
    create : function(id) {
        KE.g[id].toolbarIcon = [];
        var tableObj = KE.util.createTable();
        var toolbar = tableObj.table;
        toolbar.className = 'ke-toolbar';
        toolbar.oncontextmenu = function() { return false; };
        toolbar.onmousedown = function() { return false; };
        toolbar.onmousemove = function() { return false; };
        var toolbarCell = tableObj.cell;
        var length = KE.g[id].items.length;
        var cellNum = 0;
        var row;
        for (var i = 0; i < length; i++) {
            var cmd = KE.g[id].items[i];
            if (i == 0 || cmd == '-') {
                var table = KE.util.createTable().table;
                table.className = 'ke-toolbar-table';
                row = table.insertRow(0);
                cellNum = 0;
                toolbarCell.appendChild(table);
                if (cmd == '-') continue;
            }
            var cell = row.insertCell(cellNum);
            cell.hideforcus = true;
            cellNum++;
            var a = KE.$$('a');
            a.className = 'ke-icon';
            a.href = 'javascript:;';
            a.onclick = new Function('KE.util.click("' + id + '", "' + cmd + '");');
            a.onmouseover = function(){ this.className = "ke-icon-on"; };
            a.onmouseout = function(){ this.className = "ke-icon"; };
            a.hidefocus = true;
            a.title = KE.lang[cmd];
            var span = KE.$$('span');
            span.className = "ke-common-icon ke-icon-" + cmd;
            if (KE.util.inArray(cmd, KE.g[id].defaultItems)) {
                var url = KE.g[id].skinsPath + KE.g[id].skinType + '.gif';
                span.style.backgroundImage = "url(" + url + ")";
            }
            a.appendChild(span);
            cell.appendChild(a);
            KE.g[id].toolbarIcon[cmd] = [a, span];
            if (KE.toolbar.isSelected(id, cmd)) KE.toolbar.select(id, cmd);
        }
        return toolbar;
    }
};

KE.history = {
    add : function(id, minChangeFlag) {
        var obj = KE.g[id];
        var html = KE.util.getSrcData(id);
        if (obj.undoStack.length > 0) {
            var prevHtml = obj.undoStack[obj.undoStack.length - 1];
            if (html == prevHtml) return;
            if (minChangeFlag && Math.abs(html.length - prevHtml.length) < obj.minChangeSize) return;
        }
        obj.undoStack.push(html);
        obj.redoStack = [];
    },
    undo : function(id) {
        var obj = KE.g[id];
        if (obj.undoStack.length == 0) return;
        var html = KE.util.getSrcData(id);
        obj.redoStack.push(html);
        var prevHtml = obj.undoStack.pop();
        if (html == prevHtml && obj.undoStack.length > 0) {
            prevHtml = obj.undoStack.pop();
        }
        obj.iframeDoc.body.innerHTML = prevHtml;
        obj.newTextarea.value = prevHtml;
    },
    redo : function(id) {
        var obj = KE.g[id];
        if (obj.redoStack.length == 0) return;
        var html = KE.util.getSrcData(id);
        obj.undoStack.push(html);
        var nextHtml = obj.redoStack.pop();
        obj.iframeDoc.body.innerHTML = nextHtml;
        obj.newTextarea.value = nextHtml;
    }
};

KE.remove = function(id, mode) {
    if (!KE.g[id].container) return false;
    mode = (typeof mode == "undefined") ? 0 : mode;
    var container = KE.g[id].container;
    if (mode == 1) {
        document.body.removeChild(container);
    } else {
        var srcTextarea = KE.g[id].srcTextarea;
        srcTextarea.parentNode.removeChild(container);
        if (mode == 0) srcTextarea.style.display = '';
    }
    document.body.removeChild(KE.g[id].hideDiv);
    document.body.removeChild(KE.g[id].maskDiv);
    KE.g[id].container = null;
    KE.g[id].contextmenuItems = [];
};

KE.create = function(id, mode) {
    if (KE.browser == 'IE') try { document.execCommand('BackgroundImageCache', false, true); }catch(e){}
    var srcTextarea = KE.$(id);
    mode = (typeof mode == "undefined") ? 0 : mode;
    if (mode == 0 && KE.g[id].container) return;
    var width = KE.g[id].width || srcTextarea.style.width || srcTextarea.offsetWidth + 'px';
    var height = KE.g[id].height || srcTextarea.style.height || srcTextarea.offsetHeight + 'px';
    var tableObj = KE.util.createTable();
    var container = tableObj.table;
    container.className = 'ke-container';
    container.style.width = width;
    container.style.height = height;
    var toolbarOuter = tableObj.cell;
    toolbarOuter.className = 'ke-toolbar-outer';
    var textareaOuter = container.insertRow(1).insertCell(0);
    textareaOuter.className = 'ke-textarea-outer';
    tableObj = KE.util.createTable();
    var textareaTable = tableObj.table;
    textareaTable.className = 'ke-textarea-table';
    var textareaCell = tableObj.cell;
    textareaOuter.appendChild(textareaTable);
    var bottomOuter = container.insertRow(2).insertCell(0);
    bottomOuter.className = 'ke-bottom-outer';
    if (mode == 1) document.body.appendChild(container);
    else srcTextarea.parentNode.insertBefore(container, srcTextarea);
    var toolbarTable = KE.toolbar.create(id);
    toolbarOuter.appendChild(toolbarTable);
    var iframe = KE.$$('iframe');
    iframe.className = 'ke-iframe';
    iframe.setAttribute("frameBorder", "0");
    var newTextarea = KE.$$('textarea');
    newTextarea.className = 'ke-textarea';
    newTextarea.style.display = 'none';
    textareaCell.appendChild(iframe);
    textareaCell.appendChild(newTextarea);
    var bottom = KE.$$('table');
    bottom.className = 'ke-bottom';
    bottom.cellPadding = 0;
    bottom.cellSpacing = 0;
    bottom.border = 0;
    var row = bottom.insertRow(0);
    var bottomLeft = row.insertCell(0);
    bottomLeft.className = 'ke-bottom-left';
    var bottomRight = row.insertCell(1);
    bottomRight.className = 'ke-bottom-right';
    bottomRight.align = 'right';
    bottomRight.vAlign = 'bottom';
    var span = KE.$$('span');
    var url = KE.g[id].skinsPath + KE.g[id].skinType + '.gif';
    span.style.backgroundImage = "url(" + url + ")";
    span.className = 'ke-bottom-right-img';
    bottomRight.appendChild(span);
    bottomOuter.appendChild(bottom);
    var hideDiv = KE.$$('div');
    hideDiv.style.display = 'none';
    var maskDiv = KE.$$('div');
    maskDiv.className = 'ke-mask';
    KE.util.setOpacity(maskDiv, 50);
    document.body.appendChild(hideDiv);
    document.body.appendChild(maskDiv);
    srcTextarea.style.display = 'none';
    KE.util.setDefaultPlugin(id);
    var iframeWin = iframe.contentWindow;
    var iframeDoc = KE.util.getIframeDoc(iframe);
    iframeDoc.designMode = "On";
    var html = KE.util.getFullHtml(id, KE.g[id].tagLineMode);
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    if (!KE.g[id].wyswygMode) {
        newTextarea.value = srcTextarea.value;
        newTextarea.style.display = 'block';
        iframe.style.display = 'none';
        KE.toolbar.disable(id, ['source', 'preview', 'fullscreen']);
        KE.toolbar.select(id, 'source');
    }
    if (KE.g[id].autoOnsubmitMode) {
        var node = srcTextarea.parentNode;
        while (node != null) {
            if (node.nodeType == 1 && node.tagName.toLowerCase() == 'form') {
                KE.event.add(node, 'submit', new Function('KE.util.setData("' + id + '")'));
                break;
            }
            node = node.parentNode;
        }
    }
    var hideMenu = function() {
        hideDiv.innerHTML = '';
        hideDiv.style.display = 'none';
    };
    var updateToolbar = function () {
        KE.toolbar.updateState(id);
    };
    var addHistory = function () {
        KE.history.add(id, true);
    };
    KE.event.add(iframeDoc, 'click', hideMenu);
    KE.event.add(iframeDoc, 'click', updateToolbar);
    KE.event.input(iframeDoc, addHistory);
    KE.event.input(iframeDoc, updateToolbar);
    KE.event.add(newTextarea, 'click', hideMenu);
    KE.event.input(newTextarea, addHistory);
    KE.event.add(iframeDoc, 'keydown', function(e) {
        if (e.keyCode == 9) {
            KE.util.selection(id);
            KE.util.insertHtml(id, '　　');
            KE.util.select(id);
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            return false;
        }
    });
    KE.g[id].container = container;
    KE.g[id].toolbarTable = toolbarTable;
    KE.g[id].textareaTable = textareaTable;
    KE.g[id].iframe = iframe;
    KE.g[id].newTextarea = newTextarea;
    KE.g[id].srcTextarea = srcTextarea;
    KE.g[id].bottom = bottom;
    KE.g[id].hideDiv = hideDiv;
    KE.g[id].maskDiv = maskDiv;
    KE.g[id].iframeWin = iframeWin;
    KE.g[id].iframeDoc = iframeDoc;
    KE.g[id].width = width;
    KE.g[id].height = height;
    KE.util.resize(id, width, height);
    if (KE.g[id].resizeMode > 0) {
        KE.util.drag(id, bottomRight, container, function(objTop, objLeft, objWidth, objHeight, top, left) {
            if (KE.g[id].resizeMode == 2) KE.util.resize(id, (objWidth + left) + 'px', (objHeight + top) + 'px', true);
            else if (KE.g[id].resizeMode == 1) KE.util.resize(id, objWidth + 'px', (objHeight + top) + 'px', true, false);
        });
        KE.util.drag(id, bottomLeft, container, function(objTop, objLeft, objWidth, objHeight, top, left) {
            if (KE.g[id].resizeMode > 0) KE.util.resize(id, objWidth + 'px', (objHeight + top) + 'px', true, false);
        });
    }
    for (var i = 0, len = KE.g[id].items.length; i < len; i++) {
        var cmd = KE.g[id].items[i];
        if (KE.plugin[cmd] && KE.plugin[cmd].init) KE.plugin[cmd].init(id);
    }
    if (KE.g[id].contextmenuItems.length > 0) {
        KE.event.add(iframeDoc, 'contextmenu', function(e){
            KE.util.selection(id);
            var showFlag = false;
            for (var i = 0, len = KE.g[id].contextmenuItems.length; i < len; i++) {
                var item = KE.g[id].contextmenuItems[i];
                if (item.cond(id)) {
                    showFlag = true;
                    break;
                }
            }
            if (showFlag) {
                var menu = new KE.menu({
                    id : id,
                    event : e,
                    type : 'contextmenu',
                    width : '160px'
                });
                for (var i = 0, len = KE.g[id].contextmenuItems.length; i < len; i++) {
                    var item = KE.g[id].contextmenuItems[i];
                    if (item.cond(id)) {
                        menu.add(item.text, (function(item) {
                            return function() {
                                item.click(id, menu);
                            };
                        })(item));
                    }
                }
                menu.show();
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                return false;
            }
            return true;
        });
    }
    if (srcTextarea.value !== "") iframeDoc.body.innerHTML = srcTextarea.value;
    KE.history.add(id, false);
};

KE.init = function(config) {
    config.wyswygMode = (typeof config.wyswygMode == "undefined") ? KE.setting.wyswygMode : config.wyswygMode;
    config.autoOnsubmitMode = (typeof config.autoOnsubmitMode == "undefined") ? KE.setting.autoOnsubmitMode : config.autoOnsubmitMode;
    config.resizeMode = (typeof config.resizeMode == "undefined") ? KE.setting.resizeMode : config.resizeMode;
    config.filterMode = (typeof config.filterMode == "undefined") ? KE.setting.filterMode : config.filterMode;
    config.tagLineMode = (typeof config.tagLineMode == "undefined") ? KE.setting.tagLineMode : config.tagLineMode;
    config.urlType = KE.setting.urlType || config.urlType;
    config.skinType = config.skinType || KE.setting.skinType;
    config.cssPath = config.cssPath || KE.setting.cssPath;
    config.skinsPath = config.skinsPath || KE.setting.skinsPath;
    config.pluginsPath = config.pluginsPath || KE.setting.pluginsPath;
    config.minWidth = config.minWidth || KE.setting.minWidth;
    config.minHeight = config.minHeight || KE.setting.minHeight;
    config.minChangeSize = config.minChangeSize || KE.setting.minChangeSize;
    config.defaultItems = KE.setting.items;
    config.items = config.items || KE.setting.items;
    config.htmlTags = config.htmlTags || KE.setting.htmlTags;
    KE.g[config.id] = config;
    KE.g[config.id].undoStack = [];
    KE.g[config.id].redoStack = [];
    KE.g[config.id].dialogStack = [];
    KE.g[config.id].contextmenuItems = [];
    KE.util.loadStyle(config.skinsPath + config.skinType + '.css');
}

KE.show = function(config) {
    KE.init(config);
    KE.event.ready(new Function('KE.create("' + config.id + '")'));
};

KE.plugin['about'] = {
    click : function(id) {
        var dialog = new KE.dialog({
            id : id,
            cmd : 'about',
            width : 300,
            height : 80,
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
    },
    click : function(id) {
        KE.history.undo(id);
    }
};

KE.plugin['redo'] = {
    init : function(id) {
        KE.event.ctrl(KE.g[id].iframeDoc, 'Y', function(e) {
            KE.plugin['redo'].click(id);
            KE.util.focus(id);
        });
    },
    click : function(id) {
        KE.history.redo(id);
    }
};

KE.plugin['plainpaste'] = {
    click : function(id) {
        KE.util.selection(id);
        this.dialog = new KE.dialog({
            id : id,
            cmd : 'plainpaste',
            width : 330,
            height : 300,
            title : KE.lang['plainpaste'],
            yesButton : KE.lang['yes'],
            noButton : KE.lang['no']
        });
        this.dialog.show();
    },
    exec : function(id) {
        KE.util.select(id);
        var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
        var html = KE.$('textArea', dialogDoc).value;
        html = KE.util.escape(html);
        html = html.replace(/\r\n|\n|\r/g, "<br />$&");
        KE.util.insertHtml(id, html);
        this.dialog.hide();
        KE.util.focus(id);
    }
};

KE.plugin['wordpaste'] = {
    click : function(id) {
        KE.util.selection(id);
        this.dialog = new KE.dialog({
            id : id,
            cmd : 'wordpaste',
            width : 330,
            height : 300,
            title : KE.lang['wordpaste'],
            yesButton : KE.lang['yes'],
            noButton : KE.lang['no']
        });
        this.dialog.show();
    },
    exec : function(id) {
        KE.util.select(id);
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
        str = KE.format.getHtml(str, KE.g[id].htmlTags, KE.g[id].urlType);
        KE.util.insertHtml(id, str);
        this.dialog.hide();
        KE.util.focus(id);
    }
};

KE.plugin['fullscreen'] = {
    click : function(id) {
        var obj = KE.g[id];
        var self = this;
        var resetSize = function() {
            var el = KE.util.getDocumentElement();
            obj.width = el.clientWidth + 'px';
            obj.height = el.clientHeight + 'px';
        };
        var windowSize = '';
        var resizeListener = function() {
            if (!self.isSelected) return;
            var el = KE.util.getDocumentElement();
            var size = [el.clientWidth, el.clientHeight].join('');
            if (windowSize != size) {
                windowSize = size;
                resetSize();
                KE.util.resize(id, obj.width, obj.height);
            }
        }
        if (this.isSelected) {
            this.isSelected = false;
            KE.util.setData(id);
            KE.remove(id, 1);
            obj.width = this.width;
            obj.height = this.height;
            KE.create(id, 2);
            document.body.parentNode.style.overflow = 'auto';
            KE.event.remove(window, 'resize', resizeListener);
            KE.toolbar.unselect(id, "fullscreen");
        } else {
            this.isSelected = true;
            KE.util.setData(id);
            this.width = obj.container.style.width;
            this.height = obj.container.style.height;
            KE.remove(id, 2);
            document.body.parentNode.style.overflow = 'hidden';
            resetSize();
            KE.create(id, 1);
            var pos = KE.util.getScrollPos();
            var div = KE.g[id].container;
            div.style.position = 'absolute';
            div.style.left = pos.x + 'px';
            div.style.top = pos.y + 'px';
            div.style.zIndex = 19811211;
            KE.event.add(window, 'resize', resizeListener);
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
        cmd.wrap('span', [{'.background-color': value}]);
        KE.history.add(id, false);
        this.menu.hide();
        KE.util.focus(id);
    }
};

KE.plugin['date'] = {
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
    click : function(id) {
        var fontName = {
            'SimSun'             : '宋体',
            'SimHei'             : '黑体',
            'FangSong_GB2312'    : '仿宋体',
            'KaiTi_GB2312'       : '楷体',
            'NSimSun'            : '新宋体',
            'Arial'              : 'Arial',
            'Arial Black'        : 'Arial Black',
            'Times New Roman'    : 'Times New Roman',
            'Courier New'        : 'Courier New',
            'Tahoma'             : 'Tahoma',
            'Verdana'            : 'Verdana'
        };
        var cmd = 'fontname';
        KE.util.selection(id);
        var menu = new KE.menu({
            id : id,
            cmd : cmd,
            width : '160px'
        });
        KE.each(fontName, function(key, value) {
            var html = '<span style="font-family: ' + key + ';">' + value + '</span>';
            menu.add(html, new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "' + key + '")'));
        });
        menu.show();
        this.menu = menu;
    },
    exec : function(id, value) {
        var cmd = new KE.cmd(id);
        cmd.wrap('span', [{'.font-family': value}]);
        KE.history.add(id, false);
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
            cmd : cmd,
            width : '100px'
        });
        for (var i = 0, len = fontSize.length; i < len; i++) {
            var value = fontSize[i];
            var html = '<span style="font-size: ' + value + ';">' + value + '</span>';
            menu.add(html, new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "' + value + '")'));
        }
        menu.show();
        this.menu = menu;
    },
    exec : function(id, value) {
        var cmd = new KE.cmd(id);
        cmd.wrap('span', [{'.font-size': value}]);
        KE.history.add(id, false);
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

KE.plugin['preview'] = {
    click : function(id) {
        var dialog = new KE.dialog({
            id : id,
            cmd : 'preview',
            html : KE.util.getData(id),
            width : 600,
            height : 400,
            useFrameCSS : true,
            title : KE.lang['preview'],
            noButton : KE.lang['close']
        });
        dialog.show();
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
        cmd.remove(KE.setting.inlineTags, ['class', 'style']);
        KE.history.add(id, false);
        KE.toolbar.updateState(id);
        KE.util.focus(id);
    }
};

KE.plugin['source'] = {
    click : function(id) {
        var obj = KE.g[id];
        if (!obj.wyswygMode) {
            var html = obj.newTextarea.value;
            html = html.replace(/\r\n|\n|\r/g, '');
            obj.iframeDoc.body.innerHTML = html;
            obj.iframe.style.display = 'block';
            obj.newTextarea.style.display = 'none';
            KE.toolbar.able(id, ['source', 'preview', 'fullscreen']);
            obj.wyswygMode = true;
            this.isSelected = false;
            KE.toolbar.unselect(id, "source");
        } else {
            KE.layout.hide(id);
            if (KE.g[id].filterMode) {
                obj.newTextarea.value = KE.format.getHtml(obj.iframeDoc.body.innerHTML, obj.htmlTags, obj.urlType);
            } else {
                obj.newTextarea.value = KE.format.getHtml(obj.iframeDoc.body.innerHTML, null, obj.urlType);
            }
            obj.iframe.style.display = 'none';
            obj.newTextarea.style.display = 'block';
            KE.toolbar.disable(id, ['source', 'preview', 'fullscreen']);
            obj.wyswygMode = false;
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
        cmd.wrap('span', [{'.color': value}]);
        KE.history.add(id, false);
        this.menu.hide();
        KE.util.focus(id);
    }
};

KE.plugin['time'] = {
    click : function(id) {
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
    click : function(id) {
        var title = {
            'H1' : '标题 1',
            'H2' : '标题 2',
            'H3' : '标题 3',
            'H4' : '标题 4',
            'H5' : '标题 5',
            'H6' : '标题 6'
        };
        var cmd = 'title';
        KE.util.selection(id);
        var menu = new KE.menu({
            id : id,
            cmd : cmd,
            width : '120px'
        });
        KE.each(title, function(key, value) {
            var html = '<' + key + ' style="margin:0px;">' + value + '</' + key + '>';
            menu.add(html, new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "<' + key + '>")'));
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
    icon : 'emoticons.gif',
    click : function(id) {
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
        table.style.margin = 0;
        table.style.padding = 0;
        table.style.borderCollapse = 'separate';
        table.style.borderSpacing = '2px';
        for (var i = 0; i < emoticonTable.length; i++) {
            var row = table.insertRow(i);
            for (var j = 0; j < emoticonTable[i].length; j++) {
                var cell = row.insertCell(j);
                cell.style.margin = 0;
                cell.style.padding = '1px';
                cell.style.border = '1px solid #F0F0EE';
                cell.style.cursor = 'pointer';
                cell.onmouseover = function() {this.style.borderColor = '#000000'; }
                cell.onmouseout = function() {this.style.borderColor = '#F0F0EE'; }
                cell.onclick = new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "' + emoticonTable[i][j] + '")');
                var img = KE.$$('img');
                img.src = KE.g[id].pluginsPath + 'emoticons/' + emoticonTable[i][j];
                cell.appendChild(img);
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
        KE.util.select(id);
        var html = '<img src="' + KE.g[id].pluginsPath + 'emoticons/' + value + '" border="0" />';
        KE.util.insertHtml(id, html);
        this.menu.hide();
        KE.util.focus(id);
    }
};

KE.plugin['flash'] = {
    click : function(id) {
        KE.util.selection(id);
        this.dialog = new KE.dialog({
            id : id,
            cmd : 'flash',
            width : 280,
            height : 250,
            title : KE.lang['flash'],
            previewButton : KE.lang['preview'],
            yesButton : KE.lang['yes'],
            noButton : KE.lang['no']
        });
        this.dialog.show();
    },
    check : function(id, url) {
        if (url.match(/\w+:\/\/.{3,}/) == null) {
            alert(KE.lang['invalidUrl']);
            window.focus();
            this.dialog.yesButton.focus();
            return false;
        }
        return true;
    },
    preview : function(id) {
        var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
        var url = KE.$('url', dialogDoc).value;
        if (!this.check(id, url)) return false;
        var embed = KE.$$('embed', dialogDoc);
        embed.src = url;
        embed.type = "application/x-shockwave-flash";
        embed.quality = "high";
        embed.width = 190;
        embed.height = 190;
        KE.$('previewDiv', dialogDoc).innerHTML = "";
        KE.$('previewDiv', dialogDoc).appendChild(embed);
    },
    exec : function(id) {
        KE.util.select(id);
        var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
        var url = KE.$('url', dialogDoc).value;
        if (!this.check(id, url)) return false;
        var html = '<embed src="' + url + '" type="application/x-shockwave-flash" quality="high" />';
        KE.util.insertHtml(id, html);
        this.dialog.hide();
        KE.util.focus(id);
    }
};

KE.plugin['image'] = {
    getSelectedNode : function(id) {
        var startNode = KE.g[id].keRange.startNode;
        var startPos = KE.g[id].keRange.startPos;
        var endNode = KE.g[id].keRange.endNode;
        var endPos = KE.g[id].keRange.endPos;
        var startImg = null;
        var endImg = null;
        if (startNode.nodeType == 1 && startNode.tagName.toLowerCase() == 'img') {
            startImg = startNode;
        } else {
            if (startNode.nodeType == 3 && startPos == startNode.nodeValue.length) {
                var nextNode = startNode.nextSibling;
                if (nextNode) {
                    if (nextNode.nodeType == 1 && nextNode.tagName.toLowerCase() == 'img') startImg = nextNode;
                }
            }
        }
        if (endNode.nodeType == 1 && endNode.tagName.toLowerCase() == 'img') {
            endImg = endNode;
        } else {
            if (endPos == 0) {
                var prevNode = endNode.previousSibling;
                if (prevNode) {
                    if (prevNode.nodeType == 1 && prevNode.tagName.toLowerCase() == 'img') endImg = prevNode;
                }
            }
        }
        if (startImg && endImg && startImg === endImg) {
            return startImg;
        }
    },
    init : function(id) {
        var self = this;
        KE.g[id].contextmenuItems.push({
            text : KE.lang['editImage'],
            click : function(id, menu) {
                KE.util.select(id);
                menu.hide();
                self.click(id);
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
            file : 'image/image.html?id=' + id,
            width : 400,
            height : 130,
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
        var url = '';
        if (type == 2) {
            url = KE.$('imgFile', dialogDoc).value;
        } else {
            url = KE.$('url', dialogDoc).value;
        }
        if (!url.match(/\.(jpg|jpeg|gif|bmp|png)(\s|$)/i)) {
            alert(KE.lang['invalidImg']);
            window.focus();
            this.dialog.yesButton.focus();
            return false;
        }
        return true;
    },
    exec : function(id) {
        KE.util.select(id);
        var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
        var type = KE.$('type', dialogDoc).value;
        if (!this.check(id)) return false;
        if (type == 2) {
            KE.$('editorId', dialogDoc).value = id;
            dialogDoc.uploadForm.submit();
            return false;
        } else {
            var url = KE.$('url', dialogDoc).value;
            var alignElements = dialogDoc.getElementsByName('align');
            var align = '';
            for (var i = 0, len = alignElements.length; i < len; i++) {
                if (alignElements[i].checked) {
                    align = alignElements[i].value;
                    break;
                }
            }
            this.insert(id, url, '', 0, 0, 0, align);
        }
    },
    insert : function(id, url, title, width, height, border, align) {
        var html = '<img src="' + url + '" ';
        if (width > 0) html += 'width="' + width + '" ';
        if (height > 0) html += 'height="' + height + '" ';
        if (title) html += 'title="' + title + '" ';
        if (align) html += 'align="' + align + '" ';
        html += 'alt="' + title + '" ';
        html += 'border="' + border + '" />';
        KE.util.insertHtml(id, html);
        this.dialog.hide();
        KE.util.focus(id);
    }
};

KE.plugin['layer'] = {
    click : function(id) {
        var cmd = 'layer';
        var styles = [
            'margin:5px;border:1px solid #000000;',
            'margin:5px;border:2px solid #000000;',
            'margin:5px;border:1px dashed #000000;',
            'margin:5px;border:2px dashed #000000;',
            'margin:5px;border:1px dotted #000000;',
            'margin:5px;border:2px dotted #000000;'
        ];
        KE.util.selection(id);
        var menu = new KE.menu({
            id : id,
            cmd : cmd,
            width : '150px'
        });
        for (var i = 0; i < styles.length; i++) {
            var html = '<div style="height:15px;' + styles[i] + '"></div>';
            menu.add(html, new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "padding:5px;' + styles[i] + '")'));
        }
        menu.show();
        this.menu = menu;
    },
    exec : function(id, value) {
        KE.util.select(id);
        var html = '<div style="' + value + '">' + KE.lang['pleaseInput'] + '</div>';
        KE.util.insertHtml(id, html);
        this.menu.hide();
        KE.util.focus(id);
    }
};

KE.plugin['link'] = {
    getSelectedNode : function(id) {
        var startNode = KE.g[id].keRange.startNode;
        var startPos = KE.g[id].keRange.startPos;
        var endNode = KE.g[id].keRange.endNode;
        var endPos = KE.g[id].keRange.endPos;
        var parent = KE.g[id].keRange.getParentElement();
        var startLink = null;
        var endLink = null;
        if (startNode.nodeType == 1 && startNode.tagName.toLowerCase() == 'a') {
            startLink = startNode;
        } else {
            if (startPos == 0) {
                var parentNode = startNode.parentNode;
                if (parentNode && parentNode.tagName.toLowerCase() == 'a') startLink = parentNode;
            }
        }
        if (endNode.nodeType == 1 && endNode.tagName.toLowerCase() == 'a') {
            endLink = endNode;
        } else {
            if (endNode.nodeType == 3 && endPos == endNode.nodeValue.length) {
                var parentNode = endNode.parentNode;
                if (parentNode && parentNode.tagName.toLowerCase() == 'a') endLink = parentNode;
            }
        }
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
            }
        });
    },
    click : function(id) {
        KE.util.selection(id);
        this.dialog = new KE.dialog({
            id : id,
            cmd : 'link',
            file : 'link/link.html?id=' + id,
            width : 310,
            height : 70,
            loadingMode : true,
            title : KE.lang['link'],
            yesButton : KE.lang['yes'],
            noButton : KE.lang['no']
        });
        this.dialog.show();
    },
    exec : function(id) {
        KE.util.select(id);
        var iframeDoc = KE.g[id].iframeDoc;
        var range = KE.g[id].range;
        var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
        var url = KE.$('hyperLink', dialogDoc).value;
        var target = KE.$('linkType', dialogDoc).value;
        if (url.match(/\w+:\/\/.{3,}/) == null) {
            alert(KE.lang['invalidUrl']);
            window.focus();
            this.dialog.yesButton.focus();
            return false;
        }
        var node;
        if (KE.browser == 'IE') {
            node = range.item ? range.item(0).parentNode : iframeDoc.body;
        } else {
            node = (range.startContainer == range.endContainer) ? range.startContainer.parentNode : iframeDoc.body;
        }
        if (node && node.tagName == 'A') node = node.parentNode;
        if (!node) node = iframeDoc.body;
        iframeDoc.execCommand("createlink", false, "__ke_temp_url__");
        var arr = node.getElementsByTagName('a');
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i].href.match(/\/?__ke_temp_url__$/) != null) {
                arr[i].href = url;
                if (target) arr[i].target = target;
            }
        }
        KE.history.add(id);
        this.dialog.hide();
        KE.util.focus(id);
    }
};

KE.plugin['media'] = {
    click : function(id) {
        KE.util.selection(id);
        this.dialog = new KE.dialog({
            id : id,
            cmd : 'media',
            width : 280,
            height : 250,
            title : KE.lang['media'],
            previewButton : KE.lang['preview'],
            yesButton : KE.lang['yes'],
            noButton : KE.lang['no']
        });
        this.dialog.show();
    },
    check : function(id, url) {
        if (!url.match(/^\w+:\/\/.{3,}\.(mp3|wav|wma|wmv|mid|avi|mpg|mpeg|asf|rm|rmvb)(\?|$)/i)) {
            alert(KE.lang['invalidMedia']);
            window.focus();
            this.dialog.yesButton.focus();
            return false;
        }
        return true;
    },
    preview : function(id) {
        var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
        var url = KE.$('url', dialogDoc).value;
        if (!this.check(id, url)) return false;
        var embed = KE.$$('embed', dialogDoc);
        embed.src = url;
        if (url.match(/\.(rm|rmvb)$/i) == null) {
            embed.type = "video/x-ms-asf-plugin";
        } else {
            embed.type = "audio/x-pn-realaudio-plugin";
        }
        embed.loop = "true";
        embed.autostart = "true";
        embed.width = 260;
        embed.height = 190;
        KE.$('previewDiv', dialogDoc).innerHTML = "";
        KE.$('previewDiv', dialogDoc).appendChild(embed);
    },
    exec : function(id) {
        KE.util.select(id);
        var dialogDoc = KE.util.getIframeDoc(this.dialog.iframe);
        var url = KE.$('url', dialogDoc).value;
        if (!this.check(id, url)) return false;
        var html;
        if (url.match(/\.(rm|rmvb)$/i) == null) {
            html = '<embed src="' + url + '" type="video/x-ms-asf-plugin" loop="true" autostart="true" />';
        } else {
            html = '<embed src="' + url + '" type="audio/x-pn-realaudio-plugin" loop="true" autostart="true" />';
        }
        KE.util.insertHtml(id, html);
        this.dialog.hide();
        KE.util.focus(id);
    }
};

KE.plugin['specialchar'] = {
    click : function(id) {
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
        table.style.margin = 0;
        table.style.padding = 0;
        table.style.borderCollapse = 'separate';
        table.style.borderSpacing = '2px';
        for (var i = 0; i < charTable.length; i++) {
            var row = table.insertRow(i);
            for (var j = 0; j < charTable[i].length; j++) {
                var cell = row.insertCell(j);
                cell.style.padding = '1px';
                cell.style.margin = 0;
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
        this.menu = menu;
    },
    exec : function(id, value) {
        KE.util.select(id);
        KE.util.insertHtml(id, value);
        this.menu.hide();
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
        table.cellSpacing = 2;
        table.border = 0;
        table.style.margin = 0;
        table.style.padding = 0;
        table.style.borderCollapse = 'separate';
        table.style.borderSpacing = '2px';
        for (var i = 0; i < num; i++) {
            var row = table.insertRow(i);
            cellArr[i] = [];
            for (var j = 0; j < num; j++) {
                var value = (i + 1) + ',' + (j + 1);
                var cell = row.insertCell(j);
                cellArr[i][j] = cell;
                cell.style.margin = 0;
                cell.style.padding = 0;
                cell.style.border = '1px solid #DDDDDD';
                cell.style.backgroundColor = '#FFFFFF';
                cell.style.cursor = 'pointer';
                cell.style.fontSize = '1px';
                cell.style.width = '12px';
                cell.style.height = '12px';
                cell.id = value;
                cell.onmouseover = function() {
                    var location = this.id.split(',');
                    var x = location[0];
                    var y = location[1];
                    self.locationCell.innerHTML = x + ' by ' + y + ' Table';
                    for (var m = 0; m < num; m++) {
                        for (var n = 0; n < num; n++) {
                            var cell = cellArr[m][n];
                            if (m < x && n < y) cell.style.backgroundColor = '#CCCCCC';
                            else cell.style.backgroundColor = '#FFFFFF';
                        }
                    }
                };
                cell.onclick = new Function('KE.plugin["' + cmd + '"].exec("' + id + '", "' + value + '")');
            }
        }
        var row = table.insertRow(num);
        var cell = row.insertCell(0);
        cell.colSpan = 10;
        cell.style.fontSize = '12px';
        cell.style.textAlign = 'center';
        cell.style.height = '20px';
        cell.style.margin = 0;
        cell.style.padding = 0;
        cell.style.border = 0;
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
        this.menu.hide();
        KE.util.focus(id);
    }
};
