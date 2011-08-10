编辑器初始化参数
========================================================

.. contents::
	:depth: 2

.. index:: width

.. _width:

width
--------------------------------------------------------
编辑器的宽度，可以设置px或%，比textarea输入框样式表宽度优先度高。

* 数据类型: String
* 默认值: textarea输入框的宽度

.. index:: height

.. _height:

height
--------------------------------------------------------
编辑器的高度，只能设置px，比textarea输入框样式表高度优先度高。

* 数据类型: String
* 默认值: textarea输入框的高度

.. index:: minWidth

.. _minWidth:

minWidth
--------------------------------------------------------
指定编辑器最小宽度，单位为px。

* 数据类型: Int
* 默认值: 650

.. index:: minHeight

.. _minHeight:

minHeight
--------------------------------------------------------
指定编辑器最小高度，单位为px。

* 数据类型: Int
* 默认值: 100

.. index:: items

.. _items:

items
--------------------------------------------------------
配置编辑器的工具栏，其中"/"表示换行，"|"表示分隔符。

* 数据类型: Array
* 默认值:

.. sourcecode:: js

	[
		'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'cut', 'copy', 'paste',
		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image',
		'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'map', 'code', 'pagebreak',
		'link', 'unlink', '|', 'about'
	]