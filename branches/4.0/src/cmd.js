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

//get window by document
function _getWin(doc) {
	return doc.parentWindow || doc.defaultView;
}
//get current selection of a document
function _getSel(doc) {
	var win = _getWin(doc);
	return win.getSelection ? win.getSelection() : doc.selection;
}
/**
	Examples:
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
			if (rng.parentElement().ownerDocument !== doc) return null;
		}
	} else {
		//get selection and original range when mixed is K.range
		var startContainer = mixed.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		sel = _getSel(doc);
		rng = mixed.get();
	}
	var win = _getWin(doc);
	var range = _range(mixed);
	//select a K.range (add K.range to the selection)
	function _select(range) {
		var rng = range.get();
		if (_IE) rng.select();
		else sel.addRange(rng);
		win.focus();
	}
	//new K.range object
	return {
		wrap : function(val) {
			var wrapper = _node(val, doc),
			name = wrapper.name,
			frag = range.extractContents();
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
			_select(range);
		},
		remove : function(options) {
			_select(range);
		},
		bold : function() {
			this.wrap('<strong></strong>');
		},
		italic : function() {
			this.wrap('<em></em>');
		},
		foreColor : function(val) {
			this.wrap('<span style="color:' + val + ';"></span>');
		},
		hiliteColor : function() {
			this.wrap('<span style="background-color:' + val + ';"></span>');
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
		}
	};
}

function _execCommand(doc, cmdName, ui, val) {
	var cmd = _cmd(doc);
	cmd[cmdName].call(cmd, val);
}

function _queryCommandValue(doc, cmdName) {

}

K.cmd = _cmd;
K.execCommand = _execCommand;
K.queryCommandValue = _queryCommandValue;

})(KindEditor);
