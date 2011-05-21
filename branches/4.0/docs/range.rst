范围相关函数
========================================================

.. contents::
	:depth: 2

.. index:: K.range, KRange

.. _KRange:

K.range(mixed)
--------------------------------------------------------
创建或选取KRange对象，KRange是原生range的封装，包含W3C Range所有接口，此外还有包含KRange和原生Range之间的转换功能。

* 参数:
	* document|range mixed: document或原生range
	* element root: DOM根元素，在root范围内选择DOM元素
* 返回: KNode对象。

示例:

.. sourcecode:: js

	var krange = K.range(document); //新建KRange对象
	krange = K.range(originalRange); //将原生Range转换成KRange

.. note::

	DOM Level 2 Range Reference: http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html

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


