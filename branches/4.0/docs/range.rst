范围API
========================================================

.. contents::
	:depth: 2

.. index:: K.range, KRange

.. _KRange:

K.range(mixed)
--------------------------------------------------------
创建或选取KRange对象，KRange是原生Range的封装，包含大部分W3C Range接口，此外还有包含KRange和原生Range之间的转换功能。

* 参数:
	* document|range mixed: document或原生range
	* element root: DOM根元素，在root范围内选择DOM元素
* 返回: KRange对象

示例:

.. sourcecode:: js

	range = K.range(document);
	range = K.range(originalRange);

.. note::

	DOM Level 2 Range Reference: http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html

.. index:: START_TO_START

.. _START_TO_START:

K.START_TO_START
--------------------------------------------------------
调用 :ref:`KRange.compareBoundaryPoints` 时使用。

.. index:: START_TO_END

.. _START_TO_END:

K.START_TO_END
--------------------------------------------------------
调用 :ref:`KRange.compareBoundaryPoints` 时使用。

.. index:: END_TO_END

.. _END_TO_END:

K.END_TO_END
--------------------------------------------------------
调用 :ref:`KRange.compareBoundaryPoints` 时使用。

.. index:: END_TO_START

.. _END_TO_START:

K.END_TO_START
--------------------------------------------------------
调用 :ref:`KRange.compareBoundaryPoints` 时使用。

.. index:: KRange.startContainer, startContainer

.. _KRange.startContainer:

KRange.startContainer
--------------------------------------------------------
range的开始节点。

.. index:: KRange.startOffset, startOffset

.. _KRange.startOffset:

KRange.startOffset
--------------------------------------------------------
range的开始节点位置。

.. index:: KRange.endContainer, endContainer

.. _KRange.endContainer:

KRange.endContainer
--------------------------------------------------------
range的结束节点。

.. index:: KRange.endOffset, endOffset

.. _KRange.endOffset:

KRange.endOffset
--------------------------------------------------------
range的结束节点的位置。

.. index:: KRange.collapsed, collapsed

.. _KRange.collapsed:

KRange.collapsed
--------------------------------------------------------
range的折叠状态，当range处于折叠状态时true，否则false。。

.. index:: KRange.commonAncestor, commonAncestor

.. _KRange.commonAncestor:

KRange.commonAncestor()
--------------------------------------------------------
取得KRange的共同祖先。

* 参数: 无
* 返回: Element

示例:

.. sourcecode:: js

	var range = K.range(document);
	var element = range.commonAncestor();

.. index:: KRange.setStart, setStart

.. _KRange.setStart:

KRange.setStart(node , offset)
--------------------------------------------------------
设置KRange的开始节点和位置。

* 参数:
	* Node node: 任意节点
	* Int offset: 位置
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setStart(document.body, 1);

.. index:: KRange.setEnd, setEnd

.. _KRange.setEnd:

KRange.setEnd(node , offset)
--------------------------------------------------------
设置KRange的结束节点和位置。

* 参数:
	* Node node: 任意节点
	* Int offset: 位置
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setEnd(document.body, 2);

.. index:: KRange.setStartBefore, setStartBefore

.. _KRange.setStartBefore:

KRange.setStartBefore(node)
--------------------------------------------------------
将Node的开始位置设置成Range的开始位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setStartBefore(K('div#id')[0]);

.. index:: KRange.setStartAfter, setStartAfter

.. _KRange.setStartAfter:

KRange.setStartAfter(node)
--------------------------------------------------------
将Node的结束位置设置成Range的开始位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setStartAfter(K('div#id')[0]);

.. index:: KRange.setEndBefore, setEndBefore

.. _KRange.setEndBefore:

KRange.setEndBefore(node)
--------------------------------------------------------
将Node的开始位置设置成Range的结束位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setEndBefore(K('div#id')[0]);

.. index:: KRange.setEndAfter, setEndAfter

.. _KRange.setEndAfter:

KRange.setEndAfter(node)
--------------------------------------------------------
将Node的结束位置设置成Range的结束位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setEndAfter(K('div#id')[0]);

.. index:: KRange.selectNode, selectNode

.. _KRange.selectNode:

KRange.selectNode(node)
--------------------------------------------------------
将Node的开始位置和结束位置分别设置成Range的开始位置和结束位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNode(K('div#id')[0]);

.. index:: KRange.selectNodeContents, selectNodeContents

.. _KRange.selectNodeContents:

KRange.selectNodeContents(node)
--------------------------------------------------------
将Node的子节点的开始位置和结束位置分别设置成Range的开始位置和结束位置。对于文本节点和无结束符的元素，相当于使用selectNode。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);

.. index:: KRange.collapse, collapse

.. _KRange.collapse:

KRange.collapse(toStart)
--------------------------------------------------------
折叠KRange，当toStart为true时向前折叠，false时向后折叠。

* 参数:
	* Boolean toStart: 折叠方向
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	range.collapse(true);

.. index:: KRange.compareBoundaryPoints, compareBoundaryPoints

.. _KRange.compareBoundaryPoints:

KRange.compareBoundaryPoints(how , range)
--------------------------------------------------------
根据how参数比较2个range的边界。

* 参数:
	* Int how: 位置信息，可设置K.START_TO_START、K.START_TO_END、K.END_TO_END、K.END_TO_START。
	* Range range: 目标Range
* 返回: 当this range在目标range的左侧时返回-1，在目标range的右侧时返回1，相同时返回0。

how参数的方向规则：

* K.START_TO_START：比较目标range的开始位置和this range的开始位置。
* K.START_TO_END：比较目标range的开始位置和this range的结束位置。
* K.END_TO_END：比较目标range的结束位置和this range的结束位置。
* K.END_TO_START：比较目标range的结束位置和this range的开始位置。

示例:

.. sourcecode:: js

	var range1 = K.range(document);
	range1.selectNode(K('div#id')[0]);
	var range2 = K.range(document);
	range2.selectNode(K('div#id p')[0]);
	var cmp = range1.compareBoundaryPoints(K.START_TO_START, range2.get());

.. index:: KRange.cloneRange, cloneRange

.. _KRange.cloneRange:

KRange.cloneRange()
--------------------------------------------------------
复制KRange。

* 参数: 无
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	var newRange = range.cloneRange();

.. index:: KRange.toString, toString

.. _KRange.toString:

KRange.toString()
--------------------------------------------------------
返回KRange的文本内容。

* 参数: 无
* 返回: String

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	var text = range.toString();

.. index:: KRange.cloneContents, cloneContents

.. _KRange.cloneContents:

KRange.cloneContents()
--------------------------------------------------------
复制并返回KRange的内容。

* 参数: 无
* 返回: documentFragment

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	var fragment = range.cloneContents();

.. index:: KRange.deleteContents, deleteContents

.. _KRange.deleteContents:

KRange.deleteContents()
--------------------------------------------------------
删除KRange的内容。

* 参数: 无
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	range.deleteContents();

.. index:: KRange.extractContents, extractContents

.. _KRange.extractContents:

KRange.extractContents()
--------------------------------------------------------
删除并返回KRange的内容。

* 参数: 无
* 返回: documentFragment

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	var fragment = range.extractContents();

.. index:: KRange.insertNode, insertNode

.. _KRange.insertNode:

KRange.insertNode(node)
--------------------------------------------------------
将指定Node插入到KRange的开始位置。

* 参数:
	* Node node: 任意Node或documentFragment
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('#id1')[0]);
	range.insertNode(K('#id2')[0]);

.. index:: KRange.surroundContents, surroundContents

.. _KRange.surroundContents:

KRange.surroundContents(node)
--------------------------------------------------------
用指定Node围住KRange的内容。

* 参数:
	* Element node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('#id1')[0]);
	range.surroundContents(K('#id2')[0]);

.. index:: KRange.isControl, isControl

.. _KRange.isControl:

KRange.isControl()
--------------------------------------------------------
判断当前KRange是否可选择的Contral Range。

* 参数: 无
* 返回: Boolean

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('#id1')[0]);
	var bool = range.isControl();

.. index:: KRange.get, get

.. _KRange.get:

KRange.get([hasControlRange])
--------------------------------------------------------
将KRange转换成原生Range并返回。

* 参数:
	* Boolean hasControlRange: 是否包含Contral Range
* 返回: Range

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('#id1')[0]);
	var originalRange = range.get();

.. index:: KRange.html, html

.. _KRange.html:

KRange.html()
--------------------------------------------------------
返回KRange内容的HTML。

* 参数: 无
* 返回: HTML string

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('#id1')[0]);
	var html = range.html();

