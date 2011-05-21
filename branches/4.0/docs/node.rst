节点相关函数
========================================================

.. contents::
	:depth: 2

.. index:: K, KNode

.. _K:

K(expr , root)
--------------------------------------------------------
创建或选取KNode对象，KNode是原生node的封装，KNode对象拥有以下属性和方法。

* 参数:
	* string|node expr: DOM元素、选择器字符串、HTML
	* element root: DOM根元素，在root范围内选择DOM元素
* 返回: KNode对象。

示例:

.. sourcecode:: js

	knode = K('&lt;div&gt;&lt;/div&gt;'); //根据HTML创建KNode对象
	knode = K('#id div'); //选择匹配的DIV NodeList
	knode = K(document.getElementById('id')); //选择原生Node

.. index:: KNode.doc, doc

.. _KNode.doc:

KNode.doc
--------------------------------------------------------
第一个node的document对象。

.. sourcecode:: js

	var doc = K('#id div').doc;

.. index:: KNode.name, name

.. _KNode.name:

KNode.name
--------------------------------------------------------
第一个node的nodeName。



