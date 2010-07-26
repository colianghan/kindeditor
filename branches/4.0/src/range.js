/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name range.js
 * @fileOverview W3C Range、W3C Range和原生Range之间转换
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "html.js"
#using "selector.js"
#using "node.js"
*/

/**
	@name KindEditor.START_TO_START
	@type {Int}
	@description
	调用range.compareBoundaryPoints时使用。
	@see KindEditor.range#compareBoundaryPoints
*/
/**
	@name KindEditor.START_TO_END
	@type {Int}
	@description
	调用range.compareBoundaryPoints时使用。
	@see KindEditor.range#compareBoundaryPoints
*/
/**
	@name KindEditor.END_TO_END
	@type {Int}
	@description
	调用range.compareBoundaryPoints时使用。
	@see KindEditor.range#compareBoundaryPoints
*/
/**
	@name KindEditor.END_TO_START
	@type {Int}
	@description
	调用range.compareBoundaryPoints时使用。
	@see KindEditor.range#compareBoundaryPoints
*/
var _START_TO_START = 0,
	_START_TO_END = 1,
	_END_TO_END = 2,
	_END_TO_START = 3;

//更新collapsed
function _updateCollapsed() {
	this.collapsed = (this.startContainer === this.endContainer && this.startOffset === this.endOffset);
}
/**
	根据参数复制或删除KRange的内容。
	cloneContents: _copyAndDelete.call(this, true, false)
	extractContents: _copyAndDelete.call(this, true, true)
	deleteContents: _copyAndDelete.call(this, false, true)
*/
function _copyAndDelete(isCopy, isDelete) {
	var self = this, doc = self.doc,
		sc = self.startContainer, so = self.startOffset,
		ec = self.endContainer, eo = self.endOffset,
		nodeList = [], selfRange = self;
	if (isDelete) {
		selfRange = self.cloneRange();
		if (sc.nodeType == 3 && so === 0) {
			self.setStart(sc.parentNode, 0);
		}
		self.collapse(true);
	}
	function splitTextNode(node, startOffset, endOffset) {
		var length = node.nodeValue.length, centerNode;
		if (isCopy) {
			var cloneNode = node.cloneNode(true);
			centerNode = cloneNode.splitText(startOffset);
			centerNode.splitText(endOffset - startOffset);
		}
		if (isDelete) {
			var center = node;
			if (startOffset > 0) {
				center = node.splitText(startOffset);
			}
			if (endOffset < length) {
				center.splitText(endOffset - startOffset);
			}
			nodeList.push(center);
		}
		return centerNode;
	}
	function extractNodes(parent, frag) {
		var textNode;
		if (parent.nodeType == 3) {
			textNode = splitTextNode(parent, so, eo);
			if (isCopy) {
				frag.appendChild(textNode);
			}
			return false;
		}
		var node = parent.firstChild, testRange, nextNode,
			start = incStart = incEnd = end = false;
		while (node) {
			testRange = new KRange(doc);
			testRange.selectNode(node);
			if (!start) {
				start = testRange.compareBoundaryPoints(_START_TO_END, selfRange) > 0;
			}
			if (start && !incStart) {
				incStart = testRange.compareBoundaryPoints(_START_TO_START, selfRange) >= 0;
			}
			if (incStart && !incEnd) {
				incEnd = testRange.compareBoundaryPoints(_END_TO_END, selfRange) > 0;
			}
			if (incEnd && !end) {
				end = testRange.compareBoundaryPoints(_END_TO_START, selfRange) >= 0;
			}
			if (end) {
				return false;
			}
			//下一个节点保存在nextNode，因为下面可能会分割textNode
			nextNode = node.nextSibling;
			if (start) {
				if (node.nodeType == 1) {
					if (incStart && !incEnd) {
						if (isCopy) {
							frag.appendChild(node.cloneNode(true));
						}
						if (isDelete) {
							nodeList.push(node);
						}
					} else {
						var childFlag;
						if (isCopy) {
							childFlag = node.cloneNode(false);
							frag.appendChild(childFlag);
						}
						if (extractNodes(node, childFlag) === false) {
							return false;
						}
					}
				} else if (node.nodeType == 3) {
					if (node == sc && node == ec) {
						textNode = splitTextNode(node, so, eo);
					} else if (node == sc) {
						textNode = splitTextNode(node, so, node.nodeValue.length);
					} else if (node == ec) {
						textNode = splitTextNode(node, 0, eo);
					} else {
						textNode = splitTextNode(node, 0, node.nodeValue.length);
					}
					if (isCopy) {
						frag.appendChild(textNode);
					}
				}
			}
			node = nextNode;
		}
	}
	var frag = doc.createDocumentFragment();
	extractNodes(selfRange.commonAncestor(), frag);
	//isDelete为true时，删除range内容
	for (var i = 0, len = nodeList.length; i < len; i++) {
		var node = nodeList[i];
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}
	return isCopy ? frag : self;
}
//判断一个Node是否在marquee元素里，IE专用
function _inMarquee(node) {
	var n = node;
	while (n) {
		if (K(n).name === 'marquee') {
			return true;
		}
		n = n.parentNode;
	}
	return false;
}
//在marquee元素里不能使用moveToElementText，IE专用
function _moveToElementText(range, el) {
	if (!_inMarquee(el)) {
		range.moveToElementText(el);
	}
}
//根据原生Range，取得开始节点和结束节点的位置。IE专用
function _getStartEnd(rng, isStart) {
	var doc = rng.parentElement().ownerDocument,
		pointRange = rng.duplicate();
	pointRange.collapse(isStart);
	var parent = pointRange.parentElement(),
		nodes = parent.childNodes;
	if (nodes.length === 0) {
		return {node: parent.parentNode, offset: K(parent).index()};
	}
	var startNode = doc, startPos = 0, isEnd = false;
	var testRange = rng.duplicate();
	_moveToElementText(testRange, parent);
	for (var i = 0, len = nodes.length; i < len; i++) {
		var node = nodes[i];
		var cmp = testRange.compareEndPoints('StartToStart', pointRange);
		if (cmp > 0) {
			isEnd = true;
		}
		if (cmp === 0) {
			return {node: node.parentNode, offset: i};
		}
		if (node.nodeType == 1) {
			var nodeRange = rng.duplicate();
			_moveToElementText(nodeRange, node);
			testRange.setEndPoint('StartToEnd', nodeRange);
			if (isEnd) {
				startPos += nodeRange.text.replace(/\r\n|\n|\r/g, '').length;
			} else {
				startPos = 0;
			}
		} else if (node.nodeType == 3) {
			testRange.moveStart('character', node.nodeValue.length);
			startPos += node.nodeValue.length;
		}
		if (!isEnd) {
			startNode = node;
		}
	}
	if (!isEnd && startNode.nodeType == 1) {
		return {node: parent, offset: K(parent.lastChild).index() + 1};
	}
	testRange = rng.duplicate();
	_moveToElementText(testRange, parent);
	testRange.setEndPoint('StartToEnd', pointRange);
	startPos -= testRange.text.replace(/\r\n|\n|\r/g, '').length;
	return {node: startNode, offset: startPos};
}
//将原生Range转换成KRange
function _toRange(rng) {
	var doc, range;
	if (_IE) {
		if (rng.item) {
			doc = _getDoc(rng.item(0));
			range = new KRange(doc);
			range.selectNode(rng.item(0));
			return range;
		}
		doc = rng.parentElement().ownerDocument;
		var start = _getStartEnd(rng, true),
			end = _getStartEnd(rng, false);
		range = new KRange(doc);
		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);
		return range;
	} else {
		var startContainer = rng.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		range = new KRange(doc);
		range.setStart(startContainer, rng.startOffset);
		range.setEnd(rng.endContainer, rng.endOffset);
		return range;
	}
}
//取得父节点里的该节点前的纯文本长度。IE专用
function _getBeforeLength(node) {
	var doc = node.ownerDocument,
		len = 0,
		sibling = node.previousSibling;
	while (sibling) {
		if (sibling.nodeType == 1) {
			if (!K(sibling).isSingle()) {
				var range = doc.body.createTextRange();
				_moveToElementText(range, sibling);
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
//根据Node和offset，取得表示该位置的原生Range。IE专用
function _getEndRange(node, offset) {
	var doc = node.ownerDocument || node,
		range = doc.body.createTextRange();
	if (doc == node) {
		range.collapse(true);
		return range;
	}
	if (node.nodeType == 1) {
		var children = node.childNodes, isStart, child, isTemp = false, temp;
		if (offset === 0) {
			child = children[0];
			isStart = true;
		} else {
			child = children[offset - 1];
			isStart = false;
		}
		if (!child) {
			temp = doc.createTextNode(' ');
			node.appendChild(temp);
			child = temp;
			isTemp = true;
		}
		if (child.nodeName.toLowerCase() === 'head') {
			if (offset === 1) {
				isStart = true;
			}
			if (offset === 2) {
				isStart = false;
			}
			range.collapse(isStart);
			return range;
		}
		if (child.nodeType == 1) {
			_moveToElementText(range, child);
			range.collapse(isStart);
		} else {
			_moveToElementText(range, node);
			if (isTemp) {
				node.removeChild(temp);
			}
			var len = _getBeforeLength(child);
			len = isStart ? len : len + child.nodeValue.length;
			range.moveStart('character', len);
		}
	} else if (node.nodeType == 3) {
		_moveToElementText(range, node.parentNode);
		range.moveStart('character', offset + _getBeforeLength(node));
	}
	return range;
}

/**
	@name KindEditor.range
	@class KRange类
	@param {document|Range} mixed document或原生Range
	@description
	KRange类，包含W3C Range所有接口，此外还有包含KRange和原生Range之间的转换功能。
	@example
	var krange = K.range(document); //新建KRange对象
	krange = K.range(originalRange); //将原生Range转换成KRange
	@see <a href="http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html" target="_blank">DOM Level 2 Range Reference</a>
*/
function KRange(doc) {
	var self = this;
	/**
		@name KindEditor.range#startContainer
		@property
		@public
		@type {Node}
		@description
		Range的开始节点。
	*/
	self.startContainer = doc;
	/**
		@name KindEditor.range#startOffset
		@property
		@public
		@type {Int}
		@description
		Range的开始节点的位置。
	*/
	self.startOffset = 0;
	/**
		@name KindEditor.range#endContainer
		@property
		@public
		@type {Node}
		@description
		Range的结束节点。
	*/
	self.endContainer = doc;
	/**
		@name KindEditor.range#endOffset
		@property
		@public
		@type {Int}
		@description
		Range的结束节点的位置。
	*/
	self.endOffset = 0;
	/**
		@name KindEditor.range#collapsed
		@property
		@public
		@type {Boolean}
		@description
		Range的折叠状态，当Range处于折叠状态时true，否则false。
	*/
	self.collapsed = true;
	self.doc = doc;
}

KRange.prototype = {
	/**
		@name KindEditor.range#commonAncestor
		@function
		@public
		@returns {Element}
		@description
		取得KRange的共同祖先。
	*/
	commonAncestor : function() {
		function getParents(node) {
			var parents = [];
			while (node) {
				parents.push(node);
				node = node.parentNode;
			}
			return parents;
		}
		var parentsA = getParents(this.startContainer),
			parentsB = getParents(this.endContainer),
			i = 0, lenA = parentsA.length, lenB = parentsB.length, parentA, parentB;
		while (++i) {
			parentA = parentsA[lenA - i];
			parentB = parentsB[lenB - i];
			if (!parentA || !parentB || parentA !== parentB) {
				break;
			}
		}
		return parentsA[lenA - i + 1];
	},
	/**
		@name KindEditor.range#setStart
		@function
		@public
		@param {Node} node
		@param {Int} offset
		@returns {KRange}
		@description
		设置Range的开始节点和位置。
	*/
	setStart : function(node, offset) {
		var self = this, doc = self.doc;
		self.startContainer = node;
		self.startOffset = offset;
		if (self.endContainer === doc) {
			self.endContainer = node;
			self.endOffset = offset;
		}
		_updateCollapsed.call(this);
		return self;
	},
	/**
		@name KindEditor.range#setEnd
		@function
		@public
		@param {Node} node
		@param {Int} offset
		@returns {KRange}
		@description
		设置Range的结束节点和位置。
	*/
	setEnd : function(node, offset) {
		var self = this, doc = self.doc;
		self.endContainer = node;
		self.endOffset = offset;
		if (self.startContainer === doc) {
			self.startContainer = node;
			self.startOffset = offset;
		}
		_updateCollapsed.call(this);
		return self;
	},
	/**
		@name KindEditor.range#setStartBefore
		@function
		@public
		@param {Node} node
		@returns {KRange}
		@description
		将Node的开始位置设为Range的开始位置。
	*/
	setStartBefore : function(node) {
		return this.setStart(node.parentNode || this.doc, K(node).index());
	},
	/**
		@name KindEditor.range#setStartAfter
		@function
		@public
		@param {Node} node
		@returns {KRange}
		@description
		将Node的结束位置设为Range的开始位置。
	*/
	setStartAfter : function(node) {
		return this.setStart(node.parentNode || this.doc, K(node).index() + 1);
	},
	/**
		@name KindEditor.range#setEndBefore
		@function
		@public
		@param {Node} node
		@returns {KRange}
		@description
		将Node的开始位置设为Range的结束位置。
	*/
	setEndBefore : function(node) {
		return this.setEnd(node.parentNode || this.doc, K(node).index());
	},
	/**
		@name KindEditor.range#setEndAfter
		@function
		@public
		@param {Node} node
		@returns {KRange}
		@description
		将Node的结束位置设为Range的结束位置。
	*/
	setEndAfter : function(node) {
		return this.setEnd(node.parentNode || this.doc, K(node).index() + 1);
	},
	/**
		@name KindEditor.range#selectNode
		@function
		@public
		@param {Node} node
		@returns {KRange}
		@description
		将Node的开始位置和结束位置分别设为Range的开始位置和结束位置。
	*/
	selectNode : function(node) {
		return this.setStartBefore(node).setEndAfter(node);
	},
	/**
		@name KindEditor.range#selectNodeContents
		@function
		@public
		@param {Node} node
		@returns {KRange}
		@description
		<p>将Node的子节点的开始位置和结束位置分别设为Range的开始位置和结束位置。</p>
		<p>对于文本节点和无结束符的元素，相当于使用selectNode。</p>
	*/
	selectNodeContents : function(node) {
		var knode = K(node);
		if (knode.type == 3 || knode.isSingle()) {
			return this.selectNode(node);
		}
		var children = knode.children();
		if (children.length > 0) {
			return this.setStartBefore(children[0].get()).setEndAfter(children[children.length - 1].get());
		}
		return this.setStart(node, 0).setEnd(node, 0);
	},
	/**
		@name KindEditor.range#collapse
		@function
		@public
		@param {Boolean} toStart 折叠方向，true或false
		@returns {KRange}
		@description
		折叠KRange，当toStart为true时向前折叠，false时向后折叠。
	*/
	collapse : function(toStart) {
		if (toStart) {
			return this.setEnd(this.startContainer, this.startOffset);
		}
		return this.setStart(this.endContainer, this.endOffset);
	},
	/**
		@name KindEditor.range#compareBoundaryPoints
		@function
		@public
		@param {Int} how 位置信息，可设置K.START_TO_START、K.START_TO_END、K.END_TO_END、K.END_TO_START。
		@param {KRange} range 目标range
		@returns {Int} 当this range在目标range的左侧时返回-1，在目标range的右侧时返回1，相同时返回0。
		@description
		<p>根据how参数比较2个range的边界。</p>
		<p>how参数的方向规则：</p>
		<p>K.START_TO_START：比较目标range的开始位置和this range的开始位置。</p>
		<p>K.START_TO_END：比较目标range的开始位置和this range的结束位置。</p>
		<p>K.END_TO_END：比较目标range的结束位置和this range的结束位置。</p>
		<p>K.END_TO_START：比较目标range的结束位置和this range的开始位置。</p>
	*/
	compareBoundaryPoints : function(how, range) {
		var rangeA = this.get(), rangeB = range.get();
		if (!this.doc.createRange) {
			var arr = {};
			arr[_START_TO_START] = 'StartToStart';
			arr[_START_TO_END] = 'EndToStart';
			arr[_END_TO_END] = 'EndToEnd';
			arr[_END_TO_START] = 'StartToEnd';
			var cmp = rangeA.compareEndPoints(arr[how], rangeB);
			if (cmp !== 0) {
				return cmp;
			}
			var nodeA, nodeB, nodeC, posA, posB;
			if (how === _START_TO_START || how === _END_TO_START) {
				nodeA = this.startContainer;
				posA = this.startOffset;
			}
			if (how === _START_TO_END || how === _END_TO_END) {
				nodeA = this.endContainer;
				posA = this.endOffset;
			}
			if (how === _START_TO_START || how === _START_TO_END) {
				nodeB = range.startContainer;
				posB = range.startOffset;
			}
			if (how === _END_TO_END || how === _END_TO_START) {
				nodeB = range.endContainer;
				posB = range.endOffset;
			}
			//nodeA和nodeA相同时
			if (nodeA === nodeB) {
				var diff = posA - posB;
				return diff > 0 ? 1 : (diff < 0 ? -1 : 0);
			}
			//nodeA是nodeB的祖先时
			nodeC = nodeB;
			while (nodeC && nodeC.parentNode !== nodeA) {
				nodeC = nodeC.parentNode;
			}
			if (nodeC) {
				return K(nodeC).index() >= posA ? -1 : 1;
			}
			//nodeB是nodeA的祖先时
			nodeC = nodeA;
			while (nodeC && nodeC.parentNode !== nodeB) {
				nodeC = nodeC.parentNode;
			}
			if (nodeC) {
				return K(nodeC).index() >= posB ? 1 : -1;
			}
			//其它情况，暂时不需要
		} else {
			return rangeA.compareBoundaryPoints(how, rangeB);
		}
	},
	/**
		@name KindEditor.range#cloneRange
		@function
		@public
		@returns {KRange}
		@description
		复制KRange。
	*/
	cloneRange : function() {
		return new KRange(this.doc).setStart(this.startContainer, this.startOffset).setEnd(this.endContainer, this.endOffset);
	},
	/**
		@name KindEditor.range#toString
		@function
		@public
		@returns {String}
		@description
		返回KRange的文本内容。
	*/
	toString : function() {
		//TODO
		var rng = this.get(),
			str = this.doc.createRange ? rng.toString() : rng.text;
		return str.replace(/\r\n|\n|\r/g, '');
	},
	/**
		@name KindEditor.range#cloneContents
		@function
		@public
		@returns {documentFragment}
		@description
		复制并返回KRange的内容。
	*/
	cloneContents : function() {
		return _copyAndDelete.call(this, true, false);
	},
	/**
		@name KindEditor.range#deleteContents
		@function
		@public
		@returns {KRange}
		@description
		删除KRange的内容。
	*/
	deleteContents : function() {
		return _copyAndDelete.call(this, false, true);
	},
	/**
		@name KindEditor.range#extractContents
		@function
		@public
		@returns {documentFragment}
		@description
		删除并返回KRange的内容。
	*/
	extractContents : function() {
		return _copyAndDelete.call(this, true, true);
	},
	/**
		@name KindEditor.range#insertNode
		@function
		@public
		@param {Node} node
		@returns {KRange}
		@description
		将指定Node插入到KRange的开始位置。
	*/
	insertNode : function(node) {
		var self = this,
			sc = self.startContainer, so = self.startOffset,
			ec = self.endContainer, eo = self.endOffset,
			firstChild, lastChild, c, nodeCount = 1;
		//node为文档碎片时
		if (node.nodeName.toLowerCase() === '#document-fragment') {
			firstChild = node.firstChild;
			lastChild = node.lastChild;
			nodeCount = node.childNodes.length;
		}
		//startContainer为element时
		if (sc.nodeType == 1) {
			c = sc.childNodes[so];
			if (c) {
				sc.insertBefore(node, c);
				//调整结束节点位置
				if (sc === ec) {
					eo += nodeCount;
				}
			} else {
				sc.appendChild(node);
			}
		//startContainer为text时
		} else if (sc.nodeType == 3) {
			if (so === 0) {
				sc.parentNode.insertBefore(node, sc);
				//调整结束节点位置
				if (sc.parentNode === ec) {
					eo += nodeCount;
				}
			} else if (so >= sc.nodeValue.length) {
				if (sc.nextSibling) {
					sc.parentNode.insertBefore(node, sc.nextSibling);
				} else {
					sc.parentNode.appendChild(node);
				}
			} else {
				c = sc.splitText(so);
				sc.parentNode.insertBefore(node, c);
				//调整结束节点位置
				if (sc === ec) {
					ec = c;
					eo -= so;
				}
			}
		}
		if (firstChild) {
			self.setStartBefore(firstChild).setEndAfter(lastChild);
		} else {
			self.selectNode(node);
		}
		if (self.compareBoundaryPoints(_END_TO_END, self.cloneRange().setEnd(ec, eo)) >= 1) {
			return self;
		}
		return self.setEnd(ec, eo);
	},
	/**
		@name KindEditor.range#surroundContents
		@function
		@public
		@param {Node} node
		@returns {KRange}
		@description
		用指定Node围住KRange的内容。
	*/
	surroundContents : function(node) {
		node.appendChild(this.extractContents());
		return this.insertNode(node).selectNode(node);
	},
	/**
		@name KindEditor.range#isControl
		@function
		@public
		@returns {Boolean}
		@description
		判断当前KRange是否可选择的Contral Range。
	*/
	isControl : function() {
		var self = this,
			sc = self.startContainer, so = self.startOffset,
			ec = self.endContainer, eo = self.endOffset, rng;
		return sc === ec && so + 1 === eo && K(sc.childNodes[so]).name === 'img';
	},
	/**
		@name KindEditor.range#get
		@function
		@public
		@returns {Range}
		@description
		将KRange转换成原生Range并返回。
	*/
	get : function(hasControlRange) {
		var self = this, doc = self.doc, node,
			sc = self.startContainer, so = self.startOffset,
			ec = self.endContainer, eo = self.endOffset, rng;
		// not IE
		if (doc.createRange) {
			rng = doc.createRange();
			try {
				rng.setStart(sc, so);
				rng.setEnd(ec, eo);
			} catch (e) {}
			return rng;
		}
		// IE control range
		if (hasControlRange && self.isControl()) {
			rng = doc.body.createControlRange();
			rng.addElement(sc.childNodes[so]);
			return rng;
		}
		// IE text range
		rng = doc.body.createTextRange();
		rng.setEndPoint('StartToStart', _getEndRange(sc, so));
		rng.setEndPoint('EndToStart', _getEndRange(ec, eo));
		return rng;
	},
	/**
		@name KindEditor.range#html
		@function
		@public
		@returns {String}
		@description
		返回KRange内容的HTML。
	*/
	html : function() {
		return K(this.cloneContents()).outer();
	}
};

function _range(mixed) {
	if (!mixed.nodeName) {
		return mixed.get ? mixed : _toRange(mixed);
	}
	return new KRange(mixed);
}

K.range = _range;
K.START_TO_START = _START_TO_START;
K.START_TO_END = _START_TO_END;
K.END_TO_END = _END_TO_END;
K.END_TO_START = _END_TO_START;
