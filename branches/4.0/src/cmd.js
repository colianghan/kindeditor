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
	_IE = K.IE,
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
	var sel, doc;
	function getWin(doc) {
		return doc.parentWindow || doc.defaultView;
	}
	function getSel(doc) {
		var win = getWin(doc);
		return win.getSelection ? win.getSelection() : doc.selection;
	}
	if (mixed.nodeName) {
		doc = mixed;
		sel = getSel(doc);
		var rng;
		try {
			if (sel.rangeCount > 0) rng = sel.getRangeAt(0);
			else rng = sel.createRange();
		} catch(e) {}
		mixed = rng || doc;
	} else {
		var startContainer = mixed.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		sel = getSel(doc);
	}
	var win = getWin(doc);
	var range = _range(mixed);
	function select(range) {
		var rng = range.get();
		if (_IE) rng.select();
		else sel.addRange(rng);
		win.focus();
	}
	return {
		wrap : function(mixed) {
			var wrapper = _node(mixed, doc),
			name = wrapper.name,
			frag = range.extractContents();
			_node(frag).each(function(node) {
				if (node.type == 3 && node.parent().name !== name) {
					var clone = wrapper.clone(false);
					clone.append(node.clone(true));
					node.replaceWith(clone);
				} else if (node.name === name) {
					//node.attr();
					//merge attributes
				}
			});
			range.insertNode(frag);
			select(range);
		},
		remove : function(options) {
			select(range);
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
