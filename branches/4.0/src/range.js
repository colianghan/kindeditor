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
*/
(function (K, undefined) {

var _IE = K.IE,
	_node = K.node,
	_inArray = K.inArray,
	_isAncestor = K.isAncestor,
	_START_TO_START = 0,
	_START_TO_END = 1,
	_END_TO_END = 2,
	_END_TO_START = 3;

function _range(mixed) {
	function toRange(rng) {
		if (_IE) {
			var doc = rng.parentElement().ownerDocument;
			if (rng.item) {
				var range = _range(doc);
				range.selectNode(rng.item(0));
				return range;
			}
			function getStartEnd(isStart) {
				var range = _range(doc);
				var pointRange = rng.duplicate();
				pointRange.collapse(isStart);
				var parent = pointRange.parentElement();
				var children = parent.childNodes;
				if (children.length == 0) {
					range.selectNode(parent);
					return {node: range.startContainer, offset: range.startOffset};
				}
				var startNode = doc, startPos = 0, isEnd = false;
				var testRange = rng.duplicate();
				testRange.moveToElementText(parent);
				for (var i = 0, len = children.length; i < len; i++) {
					var node = children[i];
					var cmp = testRange.compareEndPoints('StartToStart', pointRange);
					if (cmp > 0) isEnd = true;
					if (cmp == 0) {
						var range = _range(doc);
						if (node.nodeType == 1) range.selectNode(node);
						else range.setStartBefore(node);
						return {node: range.startContainer, offset: range.startOffset};
					}
					if (node.nodeType == 1) {
						var nodeRange = rng.duplicate();
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
					range.setStartAfter(parent.lastChild);
					return {node: range.startContainer, offset: range.startOffset};
				}
				testRange = rng.duplicate();
				testRange.moveToElementText(parent);
				testRange.setEndPoint('StartToEnd', pointRange);
				startPos -= testRange.text.length;
				return {node: startNode, offset: startPos};
			}
			var start = getStartEnd(true);
			var end = getStartEnd(false);
			var range = _range(doc);
			range.setStart(start.node, start.offset);
			range.setEnd(end.node, end.offset);
			return range;
		} else {
			var doc = rng.startContainer.ownerDocument;
			var range = _range(doc);
			range.setStart(rng.startContainer, rng.startOffset);
			range.setEnd(rng.endContainer, rng.endOffset);
			return range;
		}
	}
	if (_node(mixed).name !== '#document') {
		return toRange(mixed);
	}
	var doc = mixed;
	function updateCollapsed() {
		this.collapsed = (this.startContainer === this.endContainer && this.startOffset === this.endOffset);
	}
	function updateCommonAncestor() {
		function scan(node, fn) {
			if (node === doc) return;
			while (node) {
				if (fn(node)) return;
				node = node.parentNode;
			}
		}
		var nodes = [];
		scan(this.startContainer, function(node) {
			nodes.push(node);
		});
		var ancestor = doc;
		scan(this.endContainer, function(node) {
			if (_inArray(node, nodes) >= 0) {
				ancestor = node;
				return true;
			}
		});
		this.commonAncestorContainer = ancestor;
	}
	function compareAndUpdate() {
		var rangeA = _range(doc);
		var rangeB = _range(doc);
		rangeA.startContainer = rangeA.endContainer = this.startContainer;
		rangeA.startOffset = rangeA.endOffset = this.startOffset;
		rangeB.startContainer = rangeB.endContainer = this.endContainer;
		rangeB.startOffset = rangeB.endOffset = this.endOffset;
		if (rangeA.compareBoundaryPoints(_START_TO_START, rangeB) == 1) {
			this.startContainer = this.endContainer;
			this.startOffset = this.endOffset;
		}
	}
	return {
		startContainer : doc,
		startOffset : 0,
		endContainer : doc,
		endOffset : 0,
		collapsed : true,
		commonAncestorContainer : doc,
		setStart : function(node, offset) {
			this.startContainer = node;
			this.startOffset = offset;
			if (this.endContainer === doc) {
				this.endContainer = node;
				this.endOffset = offset;
			}
			compareAndUpdate.call(this);
			updateCollapsed.call(this);
			updateCommonAncestor.call(this);
		},
		setEnd : function(node, offset) {
			this.endContainer = node;
			this.endOffset = offset;
			if (this.startContainer === doc) {
				this.startContainer = node;
				this.startOffset = offset;
			}
			compareAndUpdate.call(this);
			updateCollapsed.call(this);
			updateCommonAncestor.call(this);
		},
		setStartBefore : function(node) {
			this.setStart(node.parentNode || doc, _node(node).index);
		},
		setStartAfter : function(node) {
			this.setStart(node.parentNode || doc, _node(node).index + 1);
		},
		setEndBefore : function(node) {
			this.setEnd(node.parentNode || doc, _node(node).index);
		},
		setEndAfter : function(node) {
			this.setEnd(node.parentNode || doc, _node(node).index + 1);
		},
		selectNode : function(node) {
			this.setStartBefore(node);
			this.setEndAfter(node);
		},
		selectNodeContents : function(node) {
			var knode = _node(node);
			if (knode.type == 3 || !knode.paired()) {
				this.selectNode(node);
			} else {
				if (knode.children.length > 0) {
					this.setStartBefore(knode.firstChild);
					this.setEndAfter(knode.lastChild);
				} else {
					this.setStart(node, 0);
					this.setEnd(node, 0);
				}
			}
		},
		collapse : function(toStart) {
			if (toStart) this.setEnd(this.startContainer, this.startOffset);
			else this.setStart(this.endContainer, this.endOffset);
		},
		compareBoundaryPoints : function(how, range) {
			var rangeA = this.get();
			var rangeB = range.get();
			if (_IE) {
				var arr = {};
				arr[_START_TO_START] = 'StartToStart';
				arr[_START_TO_END] = 'EndToStart';
				arr[_END_TO_END] = 'EndToEnd';
				arr[_END_TO_START] = 'StartToEnd';
				var cmp = rangeA.compareEndPoints(arr[how], rangeB);
				if (cmp !== 0) return cmp;
				var nodeA, nodeB;
				if (how === _START_TO_START || how === _END_TO_START) nodeA = this.startContainer;
				if (how === _START_TO_END || how === _END_TO_END) nodeA = this.endContainer;
				if (how === _START_TO_START || how === _START_TO_END) nodeB = range.startContainer;
				if (how === _END_TO_END || _END_TO_START) nodeB = range.endContainer;
				if (nodeA === nodeB) return 0;
				if (how === _START_TO_START || how === _END_TO_START) return _isAncestor(nodeA, nodeB) ? -1 : 1;
				if (how === _END_TO_END || how === _START_TO_END) return _isAncestor(nodeA, nodeB) ? 1 : -1;
			} else {
				return rangeA.compareBoundaryPoints(how, rangeB);
			}
		},
		cloneRange : function() {
			var range = _range(doc);
			range.setStart(this.startContainer, this.startOffset);
			range.setEnd(this.endContainer, this.endOffset);
			return range;
		},
		toString : function() {
			var rng = this.get();
			var str = _IE ? rng.text : rng.toString();
			return str.replace(/\r\n|\n|\r/g, '');
		},
		extractContents : function() {
			// TODO
		},
		cloneContents : function() {
			// TODO
		},
		get : function() {
			function getBeforeLength(node) {
				var doc = node.ownerDocument;
				var len = 0;
				var sibling = node.previousSibling;
				while (sibling) {
					if (sibling.nodeType == 1) {
						if (_node(sibling).paired()) {
							var range = doc.body.createTextRange();
							range.moveToElementText(sibling);
							len += range.text.length;
						} else {
							len += 1;
						}
					} else if (sibling.nodeType == 3) {
						len += sibling.nodeValue.length;
					}
					sibling = sibling.previousSibling;
				}
				return len;
			}
			function getEndRange(node, offset) {
				var doc = node.ownerDocument || node;
				var range = doc.body.createTextRange();
				if (doc == node) {
					range.collapse(true);
					return range;
				}
				if (node.nodeType == 1) {
					var children = node.childNodes;
					var isStart, child, isTemp = false;
					if (offset == 0) {
						child = children[0];
						isStart = true;
					} else {
						child = children[offset - 1];
						isStart = false;
					}
					if (!child) {
						var temp = doc.createTextNode(' ');
						node.appendChild(temp);
						child = temp;
						isTemp = true;
					}
					if (child.nodeName.toLowerCase() === 'head') {
						if (offset === 1) isStart = true;
						if (offset === 2) isStart = false;
						range.collapse(isStart);
						return range;
					}
					if (child.nodeType == 1) {
						range.moveToElementText(child);
						range.collapse(isStart);
					} else {
						range.moveToElementText(node);
						if (isTemp) node.removeChild(temp);
						var len = getBeforeLength(child);
						len = isStart ? len : len + child.nodeValue.length;
						range.moveStart('character', len);
					}
				} else if (node.nodeType == 3) {
					range.moveToElementText(node.parentNode);
					range.moveStart('character', offset + getBeforeLength(node));
				}
				return range;
			}
			var startContainer = this.startContainer,
				startOffset = this.startOffset,
				endContainer = this.endContainer,
				endOffset = this.endOffset,
				range;
			if (doc.createRange) {
				range = doc.createRange();
				range.selectNodeContents(doc.body);
			} else {
				range = doc.body.createTextRange();
			}
			if (_IE) {
				range.setEndPoint('StartToStart', getEndRange(startContainer, startOffset));
				range.setEndPoint('EndToStart', getEndRange(endContainer, endOffset));
			} else {
				range.setStart(startContainer, startOffset);
				range.setEnd(endContainer, endOffset);
			}
			return range;
		}
	};
}

K.range = _range;
K.START_TO_START = _START_TO_START;
K.START_TO_END = _START_TO_END;
K.END_TO_END = _END_TO_END;
K.END_TO_START = _END_TO_START;

})(KindEditor);