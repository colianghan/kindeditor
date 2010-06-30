/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name cmd.js
 * @fileOverview 编辑命令集合，可代替execCommand、queryCommandState、queryCommandValue
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "html.js"
#using "selector.js"
#using "node.js"
#using "range.js"
*/
(function (K, undefined) {

var _each = K.each,
	_node = K.node,
	_range = K.range,
	_IE = K.IE,
	_INLINE_TAGS = K.INLINE_TAGS;

/**
	@name KindEditor.cmd
	@class Command类
	@param {document|KRange} mixed document或KRange
	@description
	Command类，控制可视化编辑区域的HTML。
	@example
	K.cmd(document).bold();
	K.cmd(document).wrap('<span style="color:red;"></span>');
	K.cmd(document).remove({
		span : '*',
		div : 'class,border'
	});
*/
function _cmd(mixed) {
	var sel, doc, rng;
	if (mixed.nodeName) {
		//get selection and original range when mixed is a document or a node
		doc = mixed.nodeName.toLowerCase() === '#document' ? mixed : mixed.ownerDocument;
		sel = _getSel(doc);
		try {
			if (sel.rangeCount > 0) rng = sel.getRangeAt(0);
			else rng = sel.createRange();
		} catch(e) {}
		mixed = rng || doc;
		if (_IE) {
			if (!rng || rng.parentElement().ownerDocument !== doc) return null;
		}
	} else {
		//get selection and original range when mixed is KRange
		var startContainer = mixed.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		sel = _getSel(doc);
		rng = mixed.get();
	}
	var win = _getWin(doc);
	var range = _range(mixed);
	//create KRange object
	return {
		wrap : function(val) {
			var wrapper = _node(val, doc);
			//非inline标签
			if (!wrapper.isInline()) {
				var clone = wrapper.clone(false);
				range.surroundContents(clone.get());
				_select(sel, range);
				return this;
			}
			//inline标签，collapsed = true
			if (range.collapsed) {
				var clone = wrapper.clone(false);
				range.insertNode(clone.get());
				range.selectNodeContents(clone.get());
				_select(sel, range);
				return this;
			}
			//inline标签，collapsed = false
			var frag = range.extractContents(),
				name = wrapper.name;
			_node(frag).each(function(node) {
				if (node.type == 3 && node.parent().name !== name) {
					var clone = wrapper.clone(false);
					clone.append(node.clone(true));
					node.replaceWith(clone);
				} else if (node.name === name) {
					_each(wrapper.attr(), function(key, val) {
						if (key !== 'style') node.attr(key, val);
					});
					_each(wrapper.css(), function(key, val) {
						node.css(key, val);
					});
				}
			});
			range.insertNode(frag);
			_select(sel, range);
			return this;
		},
		remove : function(options) {
			_select(sel, range);
			return this;
		},
		bold : function() {
			return this.wrap('<strong></strong>');
		},
		italic : function() {
			return this.wrap('<em></em>');
		},
		foreColor : function(val) {
			return this.wrap('<span style="color:' + val + ';"></span>');
		},
		hiliteColor : function(val) {
			return this.wrap('<span style="background-color:' + val + ';"></span>');
		},
		fontSize : function(val) {
			return this.wrap('<span style="font-size:' + val + ';"></span>');
		},
		fontFamily : function(val) {
			return this.wrap('<span style="font-family:' + val + ';"></span>');
		},
		removeFormat : function() {
			var options = {
				'*' : 'class,style'
			},
			tags = _INLINE_TAGS.split(',');
			_each(tags, function(key, val) {
				options[val] = '*';
			});
			this.remove(options);
			return this;
		}
	};
}

//get window by document
function _getWin(doc) {
	return doc.parentWindow || doc.defaultView;
}
//get current selection of a document
function _getSel(doc) {
	var win = _getWin(doc);
	return win.getSelection ? win.getSelection() : doc.selection;
}
//add KRange to the selection
function _select(sel, range) {
	var sc = range.startContainer, so = range.startOffset,
		ec = range.endContainer, eo = range.endOffset,
		doc = sc.ownerDocument || sc, win = _getWin(doc), rng;
	//case 1: tag内部无内容时选中tag内部，比如：<tagName>[]</tagName>，IE专用
	//Webkit和Opera这个方法没有效果，需要研究
	if (_IE && sc.nodeType == 1 && range.collapsed) {
		var empty = doc.createTextNode(' ');
		ec.appendChild(empty);
		rng = doc.body.createTextRange();
		rng.moveToElementText(ec);
		rng.collapse(false);
		rng.select();
		ec.removeChild(empty);
		win.focus();
		return;
	}
	//case 2: 一般情况
	rng = range.get();
	if (_IE) {
		rng.select();
	} else {
		sel.removeAllRanges();
		sel.addRange(rng);
	}
	win.focus();
}

K.cmd = _cmd;

})(KindEditor);
