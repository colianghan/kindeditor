/**
 * KindEditor - WYSIWYG HTML Editor
 *
 * Copyright (c) 2010 kindsoft.net All rights reserved.
 * Released under LGPL License.
 */

/**
 * @name range.js
 * @fileOverview W3C Rangeã€�W3C Rangeå’ŒåŽŸç”ŸRangeä¹‹é—´è½¬æ�¢
 * @author Longhao Luo
 */

/**
#using "core.js"
#using "html.js"
#using "selector.js"
#using "node.js"
*/
(function (K, undefined) {

/**
	@name KindEditor.START_TO_START
	@type {Int}
	@description
	è°ƒç”¨range.compareBoundaryPointsæ—¶ä½¿ç”¨ã€‚
	@see KindEditor.range#compareBoundaryPoints
*/
/**
	@name KindEditor.START_TO_END
	@type {Int}
	@description
	è°ƒç”¨range.compareBoundaryPointsæ—¶ä½¿ç”¨ã€‚
	@see KindEditor.range#compareBoundaryPoints
*/
/**
	@name KindEditor.END_TO_END
	@type {Int}
	@description
	è°ƒç”¨range.compareBoundaryPointsæ—¶ä½¿ç”¨ã€‚
	@see KindEditor.range#compareBoundaryPoints
*/
/**
	@name KindEditor.END_TO_START
	@type {Int}
	@description
	è°ƒç”¨range.compareBoundaryPointsæ—¶ä½¿ç”¨ã€‚
	@see KindEditor.range#compareBoundaryPoints
*/
var _IE = K.IE,
	_node = K.node,
	_inArray = K.inArray,
	_START_TO_START = 0,
	_START_TO_END = 1,
	_END_TO_END = 2,
	_END_TO_START = 3;
	  
/**
	@name KindEditor.range
	@class KRangeç±»
	@param {document|Range} mixed documentæˆ–åŽŸç”ŸRange
	@description
	KRangeç±»ï¼ŒåŒ…å�«W3C Rangeæ‰€æœ‰æŽ¥å�£ï¼Œæ­¤å¤–è¿˜æœ‰åŒ…å�«KRangeå’ŒåŽŸç”ŸRangeä¹‹é—´çš„è½¬æ�¢åŠŸèƒ½ã€‚
	@example
	var krange = K.range(document); //æ–°å»ºKRangeå¯¹è±¡
	krange = K.range(originalRange); //å°†åŽŸç”ŸRangeè½¬æ�¢æˆ�KRange
	@see <a href="http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html" target="_blank">DOM Level 2 Range Reference</a>
*/

function _range(mixed) {
	if (!mixed.nodeName) {
		return mixed.get ? mixed : _toRange(mixed);
	}
	var doc = mixed;
	return {
		/**
			@name KindEditor.range#startContainer
			@property
			@public
			@type {Node}
			@description
			Rangeçš„å¼€å§‹èŠ‚ç‚¹ã€‚
		*/
		startContainer : doc,
		/**
			@name KindEditor.range#startOffset
			@property
			@public
			@type {Int}
			@description
			Rangeçš„å¼€å§‹èŠ‚ç‚¹çš„ä½�ç½®ã€‚
		*/
		startOffset : 0,
		/**
			@name KindEditor.range#endContainer
			@property
			@public
			@type {Node}
			@description
			Rangeçš„ç»“æ�ŸèŠ‚ç‚¹ã€‚
		*/
		endContainer : doc,
		/**
			@name KindEditor.range#endOffset
			@property
			@public
			@type {Int}
			@description
			Rangeçš„ç»“æ�ŸèŠ‚ç‚¹çš„ä½�ç½®ã€‚
		*/
		endOffset : 0,
		/**
			@name KindEditor.range#collapsed
			@property
			@public
			@type {Boolean}
			@description
			Rangeçš„æŠ˜å� çŠ¶æ€�ï¼Œå½“Rangeå¤„äºŽæŠ˜å� çŠ¶æ€�æ—¶trueï¼Œå�¦åˆ™falseã€‚
		*/
		collapsed : true,
		/**
			@name KindEditor.range#commonAncestorContainer
			@property
			@public
			@type {Node}
			@description
			å¼€å§‹èŠ‚ç‚¹å’Œç»“æ�ŸèŠ‚ç‚¹çš„å…±å�Œç¥–å…ˆNodeã€‚
		*/
		commonAncestorContainer : doc,
		/**
			@name KindEditor.range#setStart
			@function
			@public
			@param {Node} node
			@param {Int} offset
			@returns {KRange}
			@description
			è®¾ç½®Rangeçš„å¼€å§‹èŠ‚ç‚¹å’Œä½�ç½®ã€‚
		*/
		setStart : function(node, offset) {
			this.startContainer = node;
			this.startOffset = offset;
			if (this.endContainer === doc) {
				this.endContainer = node;
				this.endOffset = offset;
			}
			_compareAndUpdate.call(this, doc);
			_updateCollapsed.call(this);
			_updateCommonAncestor.call(this, doc);
			return this;
		},
		/**
			@name KindEditor.range#setEnd
			@function
			@public
			@param {Node} node
			@param {Int} offset
			@returns {KRange}
			@description
			è®¾ç½®Rangeçš„ç»“æ�ŸèŠ‚ç‚¹å’Œä½�ç½®ã€‚
		*/
		setEnd : function(node, offset) {
			this.endContainer = node;
			this.endOffset = offset;
			if (this.startContainer === doc) {
				this.startContainer = node;
				this.startOffset = offset;
			}
			_compareAndUpdate.call(this, doc);
			_updateCollapsed.call(this);
			_updateCommonAncestor.call(this, doc);
			return this;
		},
		/**
			@name KindEditor.range#setStartBefore
			@function
			@public
			@param {Node} node
			@returns {KRange}
			@description
			å°†Nodeçš„å¼€å§‹ä½�ç½®è®¾ä¸ºRangeçš„å¼€å§‹ä½�ç½®ã€‚
		*/
		setStartBefore : function(node) {
			return this.setStart(node.parentNode || doc, _node(node).index);
		},
		/**
			@name KindEditor.range#setStartAfter
			@function
			@public
			@param {Node} node
			@returns {KRange}
			@description
			å°†Nodeçš„ç»“æ�Ÿä½�ç½®è®¾ä¸ºRangeçš„å¼€å§‹ä½�ç½®ã€‚
		*/
		setStartAfter : function(node) {
			return this.setStart(node.parentNode || doc, _node(node).index + 1);
		},
		/**
			@name KindEditor.range#setEndBefore
			@function
			@public
			@param {Node} node
			@returns {KRange}
			@description
			å°†Nodeçš„å¼€å§‹ä½�ç½®è®¾ä¸ºRangeçš„ç»“æ�Ÿä½�ç½®ã€‚
		*/
		setEndBefore : function(node) {
			return this.setEnd(node.parentNode || doc, _node(node).index);
		},
		/**
			@name KindEditor.range#setEndAfter
			@function
			@public
			@param {Node} node
			@returns {KRange}
			@description
			å°†Nodeçš„ç»“æ�Ÿä½�ç½®è®¾ä¸ºRangeçš„ç»“æ�Ÿä½�ç½®ã€‚
		*/
		setEndAfter : function(node) {
			return this.setEnd(node.parentNode || doc, _node(node).index + 1);
		},
		/**
			@name KindEditor.range#selectNode
			@function
			@public
			@param {Node} node
			@returns {KRange}
			@description
			å°†Nodeçš„å¼€å§‹ä½�ç½®å’Œç»“æ�Ÿä½�ç½®åˆ†åˆ«è®¾ä¸ºRangeçš„å¼€å§‹ä½�ç½®å’Œç»“æ�Ÿä½�ç½®ã€‚
		*/
		selectNode : function(node) {
			this.setStartBefore(node);
			this.setEndAfter(node);
			return this;
		},
		/**
			@name KindEditor.range#selectNodeContents
			@function
			@public
			@param {Node} node
			@returns {KRange}
			@description
			<p>å°†Nodeçš„å­�èŠ‚ç‚¹çš„å¼€å§‹ä½�ç½®å’Œç»“æ�Ÿä½�ç½®åˆ†åˆ«è®¾ä¸ºRangeçš„å¼€å§‹ä½�ç½®å’Œç»“æ�Ÿä½�ç½®ã€‚</p>
			<p>å¯¹äºŽæ–‡æœ¬èŠ‚ç‚¹å’Œæ— ç»“æ�Ÿç¬¦çš„å…ƒç´ ï¼Œç›¸å½“äºŽä½¿ç”¨selectNodeã€‚</p>
		*/
		selectNodeContents : function(node) {
			var knode = _node(node);
			if (knode.type == 3 || knode.isSingle()) {
				this.selectNode(node);
			} else {
				if (knode.children.length > 0) {
					this.setStartBefore(knode.first.get());
					this.setEndAfter(knode.last.get());
				} else {
					this.setStart(node, 0);
					this.setEnd(node, 0);
				}
			}
			return this;
		},
		/**
			@name KindEditor.range#collapse
			@function
			@public
			@param {Boolean} toStart æŠ˜å� æ–¹å�‘ï¼Œtrueæˆ–false
			@returns {KRange}
			@description
			æŠ˜å� KRangeï¼Œå½“toStartä¸ºtrueæ—¶å�‘å‰�æŠ˜å� ï¼Œfalseæ—¶å�‘å�ŽæŠ˜å� ã€‚
		*/
		collapse : function(toStart) {
			if (toStart) this.setEnd(this.startContainer, this.startOffset);
			else this.setStart(this.endContainer, this.endOffset);
			return this;
		},
		/**
			@name KindEditor.range#compareBoundaryPoints
			@function
			@public
			@param {Int} how ä½�ç½®ä¿¡æ�¯ï¼Œå�¯è®¾ç½®K.START_TO_STARTã€�K.START_TO_ENDã€�K.END_TO_ENDã€�K.END_TO_STARTã€‚
			@param {KRange} range ç›®æ ‡range
			@returns {Int} å½“this rangeåœ¨ç›®æ ‡rangeçš„å·¦ä¾§æ—¶è¿”å›ž-1ï¼Œåœ¨ç›®æ ‡rangeçš„å�³ä¾§æ—¶è¿”å›ž1ï¼Œç›¸å�Œæ—¶è¿”å›ž0ã€‚
			@description
			<p>æ ¹æ�®howå�‚æ•°æ¯”è¾ƒ2ä¸ªrangeçš„è¾¹ç•Œã€‚</p>
			<p>howå�‚æ•°çš„æ–¹å�‘è§„åˆ™ï¼š</p>
			<p>K.START_TO_STARTï¼šæ¯”è¾ƒç›®æ ‡rangeçš„å¼€å§‹ä½�ç½®å’Œthis rangeçš„å¼€å§‹ä½�ç½®ã€‚</p>
			<p>K.START_TO_ENDï¼šæ¯”è¾ƒç›®æ ‡rangeçš„å¼€å§‹ä½�ç½®å’Œthis rangeçš„ç»“æ�Ÿä½�ç½®ã€‚</p>
			<p>K.END_TO_ENDï¼šæ¯”è¾ƒç›®æ ‡rangeçš„ç»“æ�Ÿä½�ç½®å’Œthis rangeçš„ç»“æ�Ÿä½�ç½®ã€‚</p>
			<p>K.END_TO_STARTï¼šæ¯”è¾ƒç›®æ ‡rangeçš„ç»“æ�Ÿä½�ç½®å’Œthis rangeçš„å¼€å§‹ä½�ç½®ã€‚</p>
		*/
		compareBoundaryPoints : function(how, range) {
			var rangeA = this.get(),
				rangeB = range.get();
			if (_IE) {
				var arr = {};
				arr[_START_TO_START] = 'StartToStart';
				arr[_START_TO_END] = 'EndToStart';
				arr[_END_TO_END] = 'EndToEnd';
				arr[_END_TO_START] = 'StartToEnd';
				var cmp = rangeA.compareEndPoints(arr[how], rangeB);
				if (cmp !== 0) return cmp;
				var nodeA, nodeB, posA, posB;
				if (how === _START_TO_START || how === _END_TO_START) {
					nodeA = this.startContainer;
					posA = this.startOffset;
				}
				if (how === _START_TO_END || how === _END_TO_END) {
					nodeA = this.endContainer;
					posA = nodeA.nodeType == 1 ? this.endOffset - 1 : this.endOffset;
				}
				if (how === _START_TO_START || how === _START_TO_END) {
					nodeB = range.startContainer;
					posB = range.startOffset;
				}
				if (how === _END_TO_END || how === _END_TO_START) {
					nodeB = range.endContainer;
					posB = nodeB.nodeType == 1 ? range.endOffset - 1 : range.endOffset;
				}
				if (nodeA === nodeB) return 0;
				var childA = nodeA,
					childB = nodeB;
				if (nodeA.nodeType === 1) {
					childA = nodeA.childNodes[posA];
					if (childA === nodeB) {
						if (how === _START_TO_START || how === _END_TO_START) return -1;
						if (how === _END_TO_END || how === _START_TO_END) return 1;
					}
				}
				if (nodeB.nodeType === 1) {
					childB = nodeB.childNodes[posB];
					if (childB === nodeA) {
						if (how === _START_TO_START || how === _END_TO_START) return 1;
						if (how === _END_TO_END || how === _START_TO_END) return -1;
					}
				}
				if (childA && childB === childA.nextSibling) return -1;
				if (childB && childA === childB.nextSibling) return 1;
				var bool = _node(childB).isAncestor(childA);
				if (how === _START_TO_START || how === _END_TO_START) return bool ? -1 : 1;
				if (how === _END_TO_END || how === _START_TO_END) return bool ? 1 : -1;
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
			å¤�åˆ¶KRangeã€‚
		*/
		cloneRange : function() {
			var range = _range(doc);
			range.setStart(this.startContainer, this.startOffset);
			range.setEnd(this.endContainer, this.endOffset);
			return range;
		},
		/**
			@name KindEditor.range#toString
			@function
			@public
			@returns {String}
			@description
			è¿”å›žKRangeçš„æ–‡æœ¬å†…å®¹ã€‚
		*/
		toString : function() {
			//TODO
			var rng = this.get(),
				str = _IE ? rng.text : rng.toString();
			return str.replace(/\r\n|\n|\r/g, '');
		},
		/**
			@name KindEditor.range#cloneContents
			@function
			@public
			@returns {documentFragment}
			@description
			å¤�åˆ¶å¹¶è¿”å›žKRangeçš„å†…å®¹ã€‚
		*/
		cloneContents : function() {
			return _copyAndDelete.call(this, doc, true, false);
		},
		/**
			@name KindEditor.range#deleteContents
			@function
			@public
			@returns {KRange}
			@description
			åˆ é™¤KRangeçš„å†…å®¹ã€‚
		*/
		deleteContents : function() {
			return _copyAndDelete.call(this, doc, false, true);
		},
		/**
			@name KindEditor.range#extractContents
			@function
			@public
			@returns {documentFragment}
			@description
			åˆ é™¤å¹¶è¿”å›žKRangeçš„å†…å®¹ã€‚
		*/
		extractContents : function() {
			return _copyAndDelete.call(this, doc, true, true);
		},
		/**
			@name KindEditor.range#insertNode
			@function
			@public
			@param {Node} node
			@returns {KRange}
			@description
			å°†æŒ‡å®šNodeæ�’å…¥åˆ°KRangeçš„å¼€å§‹ä½�ç½®ã€‚
		*/
		insertNode : function(node) {
			var startContainer = this.startContainer,
				startOffset = this.startOffset,
				endContainer = this.endContainer,
				endOffset = this.endOffset,
				afterNode,
				parentNode,
				endNode,
				endTextNode,
				endTextPos,
				eq = startContainer == endContainer,
				isFrag = node.nodeName.toLowerCase() === '#document-fragment';
			if (endContainer.nodeType == 1 && endOffset > 0) {
				endNode = endContainer.childNodes[endOffset - 1];
				if (endNode.nodeType == 3) {
					eq = startContainer == endNode;
					if (eq) endTextPos = endNode.nodeValue.length;
				}
			}
			if (startContainer.nodeType == 1) {
				if (startContainer.childNodes.length > 0) {
					afterNode = startContainer.childNodes[startOffset];
				} else {
					parentNode = startContainer;
				}
			} else {
				if (startOffset == 0) {
					afterNode = startContainer;
				} else if (startOffset < startContainer.length) {
					afterNode = startContainer.splitText(startOffset);
					if (eq) {
						endTextNode = afterNode;
						endTextPos = endTextPos ? endTextPos - startOffset : this.endOffset - startOffset;
						this.setEnd(endTextNode, endTextPos);
					}
				} else {
					if (startContainer.nextSibling) {
						afterNode = startContainer.nextSibling;
					} else {
						parentNode = startContainer.parentNode;
					}
				}
			}
			if (afterNode) afterNode.parentNode.insertBefore(node, afterNode);
			if (parentNode) parentNode.appendChild(node);
			if (isFrag) {
				if (node.firstChild) this.setStartBefore(node.firstChild);
				if (this.collapsed) {
					if (afterNode) endNode = afterNode.previousSibling;
					if (parentNode) endNode = parentNode.lastChild;
				}
			} else {
				this.setStartBefore(node);
				if (this.collapsed) endNode = node;
			}
			if (endNode) this.setEndAfter(endNode);
			return this;
		},
		/**
			@name KindEditor.range#surroundContents
			@function
			@public
			@param {Node} node
			@returns {KRange}
			@description
			ç”¨æŒ‡å®šNodeå›´ä½�KRangeçš„å†…å®¹ã€‚
		*/
		surroundContents : function(node) {
			node.appendChild(this.extractContents());
			return this.insertNode(node);
		},
		/**
			@name KindEditor.range#get
			@function
			@public
			@returns {Range}
			@description
			å°†KRangeè½¬æ�¢æˆ�åŽŸç”ŸRangeå¹¶è¿”å›žã€‚
		*/
		get : function() {
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
				range.setEndPoint('StartToStart', _getEndRange(startContainer, startOffset));
				range.setEndPoint('EndToStart', _getEndRange(endContainer, endOffset));
			} else {
				range.setStart(startContainer, startOffset);
				range.setEnd(endContainer, endOffset);
			}
			return range;
		},
		/**
			@name KindEditor.range#html
			@function
			@public
			@returns {String}
			@description
			è¿”å›žKRangeå†…å®¹çš„HTMLã€‚
		*/
		html : function() {
			//TODO
			return _node(this.cloneContents()).outer().toLowerCase();
		}
	};
}
//æ›´æ–°collapsed
function _updateCollapsed() {
	this.collapsed = (this.startContainer === this.endContainer && this.startOffset === this.endOffset);
}
//æ›´æ–°commonAncestorContainer
function _updateCommonAncestor(doc) {
	var sp = this.startContainer;
	while(sp){
		if(_node(sp).contain(this.endContainer) || sp === this.endContainer){
			break;
		}
		sp = sp.parentNode
	}
	this.commonAncestorContainer = sp;
}
//æ£€æŸ¥å¼€å§‹èŠ‚ç‚¹å’Œç»“æ�ŸèŠ‚ç‚¹çš„ä½�ç½®ï¼Œæ ¡æ­£é”™è¯¯è®¾ç½®
function _compareAndUpdate(doc) {
	var rangeA = _range(doc),
		rangeB = _range(doc);
	rangeA.startContainer = rangeA.endContainer = this.startContainer;
	rangeA.startOffset = rangeA.endOffset = this.startOffset;
	rangeB.startContainer = rangeB.endContainer = this.endContainer;
	rangeB.startOffset = rangeB.endOffset = this.endOffset;
	if (rangeA.compareBoundaryPoints(_START_TO_START, rangeB) == 1) {
		this.startContainer = this.endContainer;
		this.startOffset = this.endOffset;
	}
}

/*
	æ ¹æ�®å�‚æ•°å¤�åˆ¶æˆ–åˆ é™¤KRangeçš„å†…å®¹ã€‚
	cloneContents: copyAndDelete(true, false)
	extractContents: copyAndDelete(true, true)
	deleteContents: copyAndDelete(false, true)
*/
function _copyAndDelete(doc, isCopy, isDelete) {
	var self = this,
		startContainer = self.startContainer,
		startOffset = self.startOffset,
		endContainer = self.endContainer,
		endOffset = self.endOffset,
		nodeList = [],
		selfRange = self;
	if (isDelete) {
		selfRange = self.cloneRange();
		self.collapse(true);
		if (startContainer.nodeType == 3 && startOffset == 0) {
			self.setStart(startContainer.parentNode, 0);
			self.setEnd(startContainer.parentNode, 0);
		}
	}
	function splitTextNode(node, startOffset, endOffset) {
		var length = node.nodeValue.length,
			centerNode;
		if (isCopy) {
			var cloneNode = node.cloneNode(true),
			centerNode = cloneNode.splitText(startOffset);
			centerNode.splitText(endOffset - startOffset);
		}
		if (isDelete) {
			var center = node;
			if (startOffset > 0) center = node.splitText(startOffset);
			if (endOffset < length) center.splitText(endOffset - startOffset);
			nodeList.push(center);
		}
		return centerNode;
	}
	function getTextNode(node) {
		if (node == startContainer && node == endContainer) {
			return splitTextNode(node, startOffset, endOffset);
		} else if (node == startContainer) {
			return splitTextNode(node, startOffset, node.nodeValue.length);
		} else if (node == endContainer) {
			return splitTextNode(node, 0, endOffset);
		} else {
			return splitTextNode(node, 0, node.nodeValue.length);
		}
	}
	function extractNodes(parent, frag) {
		var node = parent.firstChild;
		while (node) {
			var range = _range(doc);
			range.selectNode(node);
			if (range.compareBoundaryPoints(_END_TO_START, selfRange) >= 0) return false;
			var nextNode = node.nextSibling;
			if (range.compareBoundaryPoints(_START_TO_END, selfRange) > 0) {
				var type = node.nodeType;
				if (type == 1) {
					if (range.compareBoundaryPoints(_START_TO_START, selfRange) >= 0) {
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
						if (!extractNodes(node, childFlag)) return false;
					}
				} else if (type == 3) {
					var textNode = getTextNode(node);
					if (textNode) frag.appendChild(textNode);
				}
			}
			node = nextNode;
		}
		return true;
	}
	var frag = doc.createDocumentFragment(),
		ancestor = selfRange.commonAncestorContainer;
	if (ancestor.nodeType == 3) {
		var textNode = getTextNode(ancestor);
		if (textNode) frag.appendChild(textNode);
	} else {
		extractNodes(ancestor, frag);
	}
	for (var i = 0, len = nodeList.length; i < len; i++) {
		var node = nodeList[i];
		node.parentNode.removeChild(node);
	}
	return isCopy ? frag : self;
}
//æ ¹æ�®åŽŸç”ŸRangeï¼Œå�–å¾—å¼€å§‹èŠ‚ç‚¹å’Œç»“æ�ŸèŠ‚ç‚¹çš„ä½�ç½®ã€‚IEä¸“ç”¨
function _getStartEnd(rng, isStart) {
	var doc = rng.parentElement().ownerDocument;
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
//å°†åŽŸç”ŸRangeè½¬æ�¢æˆ�KRange
function _toRange(rng) {
	if (_IE) {
		var doc = rng.parentElement().ownerDocument;
		if (rng.item) {
			var range = _range(doc);
			range.selectNode(rng.item(0));
			return range;
		}
		var start = _getStartEnd(rng, true),
			end = _getStartEnd(rng, false),
			range = _range(doc);
		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);
		return range;
	} else {
		var startContainer = rng.startContainer,
			doc = startContainer.ownerDocument || startContainer,
			range = _range(doc);
		range.setStart(startContainer, rng.startOffset);
		range.setEnd(rng.endContainer, rng.endOffset);
		return range;
	}
}
//å�–å¾—çˆ¶èŠ‚ç‚¹é‡Œçš„è¯¥èŠ‚ç‚¹å‰�çš„çº¯æ–‡æœ¬é•¿åº¦ã€‚IEä¸“ç”¨
function _getBeforeLength(node) {
	var doc = node.ownerDocument,
		len = 0,
		sibling = node.previousSibling;
	while (sibling) {
		if (sibling.nodeType == 1) {
			if (!_node(sibling).isSingle()) {
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
//æ ¹æ�®Nodeå’Œoffsetï¼Œå�–å¾—è¡¨ç¤ºè¯¥ä½�ç½®çš„åŽŸç”ŸRangeã€‚IEä¸“ç”¨
function _getEndRange(node, offset) {
	var doc = node.ownerDocument || node,
		range = doc.body.createTextRange();
	if (doc == node) {
		range.collapse(true);
		return range;
	}
	if (node.nodeType == 1) {
		var children = node.childNodes,
			isStart,
			child,
			isTemp = false;
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
			var len = _getBeforeLength(child);
			len = isStart ? len : len + child.nodeValue.length;
			range.moveStart('character', len);
		}
	} else if (node.nodeType == 3) {
		range.moveToElementText(node.parentNode);
		range.moveStart('character', offset + _getBeforeLength(node));
	}
	return range;
}

K.range = _range;
K.START_TO_START = _START_TO_START;
K.START_TO_END = _START_TO_END;
K.END_TO_END = _END_TO_END;
K.END_TO_START = _END_TO_START;

})(KindEditor);
