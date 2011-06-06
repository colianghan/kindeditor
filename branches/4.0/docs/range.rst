Range API
========================================================

.. contents::
	:depth: 2

.. index:: K.range

.. _K.range:

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

.. index:: startContainer

.. _KRange.startContainer:

startContainer
--------------------------------------------------------
range的开始节点。

.. index:: startOffset

.. _KRange.startOffset:

startOffset
--------------------------------------------------------
range的开始节点位置。

.. index:: endContainer

.. _KRange.endContainer:

endContainer
--------------------------------------------------------
range的结束节点。

.. index:: endOffset

.. _KRange.endOffset:

endOffset
--------------------------------------------------------
range的结束节点的位置。

.. index:: collapsed

.. _KRange.collapsed:

collapsed
--------------------------------------------------------
range的折叠状态，当range处于折叠状态时true，否则false。。

.. index:: commonAncestor

.. _KRange.commonAncestor:

commonAncestor()
--------------------------------------------------------
取得KRange的共同祖先。

* 参数: 无
* 返回: Element

示例:

.. sourcecode:: js

	var range = K.range(document);
	var element = range.commonAncestor();

.. index:: setStart

.. _KRange.setStart:

setStart(node , offset)
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

.. index:: setEnd

.. _KRange.setEnd:

setEnd(node , offset)
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

.. index:: setStartBefore

.. _KRange.setStartBefore:

setStartBefore(node)
--------------------------------------------------------
将Node的开始位置设置成Range的开始位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setStartBefore(K('div#id')[0]);

.. index:: setStartAfter

.. _KRange.setStartAfter:

setStartAfter(node)
--------------------------------------------------------
将Node的结束位置设置成Range的开始位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setStartAfter(K('div#id')[0]);

.. index:: setEndBefore

.. _KRange.setEndBefore:

setEndBefore(node)
--------------------------------------------------------
将Node的开始位置设置成Range的结束位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setEndBefore(K('div#id')[0]);

.. index:: setEndAfter

.. _KRange.setEndAfter:

setEndAfter(node)
--------------------------------------------------------
将Node的结束位置设置成Range的结束位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.setEndAfter(K('div#id')[0]);

.. index:: selectNode

.. _KRange.selectNode:

selectNode(node)
--------------------------------------------------------
将Node的开始位置和结束位置分别设置成Range的开始位置和结束位置。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNode(K('div#id')[0]);

.. index:: selectNodeContents

.. _KRange.selectNodeContents:

selectNodeContents(node)
--------------------------------------------------------
将Node的子节点的开始位置和结束位置分别设置成Range的开始位置和结束位置。对于文本节点和无结束符的元素，相当于使用selectNode。

* 参数:
	* Node node: 任意节点
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);

.. index:: collapse

.. _KRange.collapse:

collapse(toStart)
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

.. index:: compareBoundaryPoints

.. _KRange.compareBoundaryPoints:

compareBoundaryPoints(how , range)
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

.. index:: cloneRange

.. _KRange.cloneRange:

cloneRange()
--------------------------------------------------------
复制KRange。

* 参数: 无
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	var newRange = range.cloneRange();

.. index:: toString

.. _KRange.toString:

toString()
--------------------------------------------------------
返回KRange的文本内容。

* 参数: 无
* 返回: String

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	var text = range.toString();

.. index:: cloneContents

.. _KRange.cloneContents:

cloneContents()
--------------------------------------------------------
复制并返回KRange的内容。

* 参数: 无
* 返回: documentFragment

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	var fragment = range.cloneContents();

.. index:: deleteContents

.. _KRange.deleteContents:

deleteContents()
--------------------------------------------------------
删除KRange的内容。

* 参数: 无
* 返回: KRange

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	range.deleteContents();

.. index:: extractContents

.. _KRange.extractContents:

extractContents()
--------------------------------------------------------
删除并返回KRange的内容。

* 参数: 无
* 返回: documentFragment

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('div#id')[0]);
	var fragment = range.extractContents();

.. index:: insertNode

.. _KRange.insertNode:

insertNode(node)
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

.. index:: surroundContents

.. _KRange.surroundContents:

surroundContents(node)
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

.. index:: isControl

.. _KRange.isControl:

isControl()
--------------------------------------------------------
判断当前KRange是否可选择的Contral Range。

* 参数: 无
* 返回: Boolean

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('#id1')[0]);
	var bool = range.isControl();

.. index:: get

.. _KRange.get:

get([hasControlRange])
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

.. index:: html

.. _KRange.html:

html()
--------------------------------------------------------
返回KRange内容的HTML。

* 参数: 无
* 返回: HTML string

示例:

.. sourcecode:: js

	var range = K.range(document);
	range.selectNodeContents(K('#id1')[0]);
	var html = range.html();

