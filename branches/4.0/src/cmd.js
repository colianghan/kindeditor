/**
* KindEditor - WYSIWYG HTML Editor
* Copyright (C) 2006-${THISYEAR} Longhao Luo
*
* @site http://www.kindsoft.net/
* @licence LGPL
* @version ${VERSION}
*/

/**
#using "core.js"
#using "selector.js"
#using "node.js"
#using "range.js"
*/
(function (K, undefined) {

var _each = K.each,
	_node = K.node,
	_range = K.range,
	_INLINE_TAGS = K.INLINE_TAGS;

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
	var range = _range(mixed),
		doc = range.startContainer.ownerDocument || range.startContainer,
		win = doc.parentWindow || doc.defaultView;
	return {
		selection : function() {
			var sel = win.getSelection ? win.getSelection() : doc.selection;
			var rng;
			try {
				if (sel.rangeCount > 0) rng = sel.getRangeAt(0);
				else rng = sel.createRange();
			} catch(e) {}
			range = _range(rng || doc);
		},
		wrap : function(mixed) {
			var wrapper = _node(mixed),
			frag = range.extractContents();
			_node(frag).each(function(node) {
				if (node.type == 3) {
					var clone = wrapper.clone(false);
					clone.append(node.clone(true));
					node.replaceWith(clone);
				}
			});
			range.insertNode(frag);
		},
		remove : function(options) {
		
		},
		bold : function() {
			this.wrap('<strong></strong>');
		},
		italic : function() {
			this.wrap('<em></em>');
		},
		foreColor : function(val) {
			this.wrap('<span style="color:' + val + ';"></strong>');
		},
		hiliteColor : function() {
			this.wrap('<span style="background-color:' + val + ';"></strong>');
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
