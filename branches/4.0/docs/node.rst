节点API
========================================================

.. contents::
	:depth: 2

.. index:: K, KNode

.. _K:

K(expr , root)
--------------------------------------------------------
创建或选取KNode对象，KNode是原生node的封装，KNode对象拥有以下属性和方法。

* 参数:
	* string|node expr: DOM元素、选择器表达式、HTML代码
	* element root: DOM根元素，在root范围内选择DOM元素
* 返回: KNode对象

示例:

.. sourcecode:: js

	knode = K('&lt;div&gt;&lt;/div&gt;'); //根据HTML创建KNode对象
	knode = K('#id div'); //选择匹配的DIV NodeList
	knode = K(document.getElementById('id')); //选择原生Node
	firstNode = knode[0]; //第一个node

.. index:: KNode.length, length

.. _KNode.length:

KNode.length
--------------------------------------------------------
node数量

.. sourcecode:: js

	var length = K('#id div').length;

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

.. index:: KNode.type, type

.. _KNode.type:

KNode.type
--------------------------------------------------------
第一个node的nodeType。1: Element, 3: textNode


.. index:: KNode.bind, bind

.. _KNode.bind:

KNode.bind(type , fn)
--------------------------------------------------------
将指定函数绑定到所有KNode的指定事件上。

* 参数:
	* string type: 事件类型
	* function fn: 回调函数
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id div').bind('click', function() {
		alert(this.nodeName + ': clicked');
	});
	K('#id div').click(function() {
		alert(this.nodeName + ': clicked');
	});

.. index:: KNode.unbind, unbind

.. _KNode.unbind:

KNode.unbind([type , fn])
--------------------------------------------------------
移除已绑定的事件函数。

* 参数:
	* string type: 事件类型
	* function fn: 回调函数
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id').unbind('click', functionName); //移除指定的事件函数
	K('#id').unbind('click'); //移除所有click事件函数
	K('#id').unbind(); //移除所有事件函数

.. index:: KNode.fire, fire

.. _KNode.fire:

KNode.fire(type)
--------------------------------------------------------
执行绑定在第一个node上的事件函数。

* 参数:
	* string type: 事件类型
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id').fire('click');
	K.click();

.. index:: KNode.hasAttr, hasAttr

.. _KNode.hasAttr:

KNode.hasAttr(key)
--------------------------------------------------------
判断第一个node是否拥有指定属性。

* 参数:
	* string key: 属性名
* 返回: boolean

示例:

.. sourcecode:: js

	var bool = K('#id').hasAttr('border');

.. index:: KNode.attr, attr

.. _KNode.attr:

KNode.attr(key)
--------------------------------------------------------
取得第一个node的指定属性.

* 参数:
	* string key: 属性名
* 返回: string

示例:

.. sourcecode:: js

	var border = K('#id').attr('border');

KNode.attr(key, val)
--------------------------------------------------------
设置所有node的属性。

* 参数:
	* string key: 属性名
	* string val: 属性值
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id img').attr('border', 1);

KNode.attr(obj)
--------------------------------------------------------
设置所有node的多个属性。

* 参数:
	* object obj: key-value数组
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id img').attr({
		'width' => '100px',
		'border' => 1
	});

.. index:: KNode.removeAttr, removeAttr

.. _KNode.removeAttr:

KNode.removeAttr(key)
--------------------------------------------------------
移除所有node的指定属性.

* 参数:
	* string key: 属性名
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id img').removeAttr('border');

.. index:: KNode.get, get

.. _KNode.get:

KNode.get([i])
--------------------------------------------------------
取得原生node，当KNode的length为0时，返回null.

* 参数:
	* int i: offset，默认值为0
* 返回: node

示例:

.. sourcecode:: js

	div1 = K('#id div').get(0);
	div2 = K('#id div').get(1);

.. index:: KNode.hasClass, hasClass

.. _KNode.hasClass:

KNode.hasClass(cls)
--------------------------------------------------------
判断第一个node是否拥有指定class。

* 参数:
	* string cls: className
* 返回: boolean

示例:

.. sourcecode:: js

	var bool = K('#id').hasClass('class-name');

.. index:: KNode.addClass, addClass

.. _KNode.addClass:

KNode.addClass(cls)
--------------------------------------------------------
将指定className添加到所有node。

* 参数:
	* string cls: className
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id').addClass('class-name');

.. index:: KNode.removeClass, removeClass

.. _KNode.removeClass:

KNode.removeClass(cls)
--------------------------------------------------------
移除所有node上的指定className。

* 参数:
	* string cls: className
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id').removeClass('class-name');

.. index:: KNode.html, html

.. _KNode.html:

KNode.html()
--------------------------------------------------------
取得第一个node的innerHTML。

* 参数: 无
* 返回: string

示例:

.. sourcecode:: js

	K('#id').html(val);

KNode.html(val)
--------------------------------------------------------
设置所有node的innerHTML。

* 参数: 
	* string val: HTML字符串
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id').html('<strong>abc</strong>');

.. index:: KNode.hasVal, hasVal

.. _KNode.hasVal:

KNode.hasVal()
--------------------------------------------------------
判断第一个node是否拥有value属性。

* 参数: 无
* 返回: boolean

示例:

.. sourcecode:: js

	bool = K('#textarea').hasVal(); //return true
	bool = K('#div').hasVal(); //return false

.. index:: KNode.val, val

.. _KNode.val:

KNode.val()
--------------------------------------------------------
取得第一个node的value。

* 参数: 无
* 返回: string

示例:

.. sourcecode:: js

	var value = K('#textarea').val();

KNode.val(val)
--------------------------------------------------------
设置所有node的value。

* 参数: 无
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#textarea').val('abc');

.. index:: KNode.css, css

.. _KNode.css:

KNode.css()
--------------------------------------------------------
取得第一个node的所有CSS.

* 参数: 无
* 返回: object

示例:

.. sourcecode:: js

	var cssList = K('#id').css(); //return key-value data

KNode.css(key)
--------------------------------------------------------
取得第一个node的指定CSS.

* 参数:
	* string key: CSS key
* 返回: string

示例:

.. sourcecode:: js

	var padding = K('#id').css('padding');

KNode.css(key, val)
--------------------------------------------------------
设置所有node的CSS。

* 参数:
	* string key: CSS key
	* string val: CSS value
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id div').css('border', '1px solid #000');

KNode.css(obj)
--------------------------------------------------------
设置所有node的多个CSS。

* 参数:
	* object obj: key-value数组
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id div').css({
		'width' => '100px',
		'height' => '50px',
		'padding' => '10px'
	});

.. index:: KNode.width, width

.. _KNode.width:

KNode.width()
--------------------------------------------------------
取得第一个node的宽度(px).

* 参数: 无
* 返回: int

示例:

.. sourcecode:: js

	var width = K('#id').width();

KNode.width(val)
--------------------------------------------------------
设置所有node的宽度。

* 参数:
	* string val: 宽度
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id div').width(200);
	K('#id div').width('200px');
	K('#id div').width('100%');

.. index:: KNode.height, height

.. _KNode.height:

KNode.height()
--------------------------------------------------------
取得第一个node的高度(px).

* 参数: 无
* 返回: int

示例:

.. sourcecode:: js

	var height = K('#id').height();

KNode.height(val)
--------------------------------------------------------
设置所有node的高度。

* 参数:
	* string val: 高度
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id div').height(200);
	K('#id div').height('200px');
	K('#id div').height('100%');

.. index:: KNode.opacity, opacity

.. _KNode.opacity:

KNode.opacity(val)
--------------------------------------------------------
设置所有node的透明度.

* 参数:
	* float val: 透明度，0~1
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id').opacity(0.5);

.. index:: KNode.data, data

.. _KNode.data:

KNode.data(key)
--------------------------------------------------------
取得已绑定的自定义数据。

* 参数:
	* string key: data key
* 返回: string

示例:

.. sourcecode:: js

	var data = K('#id').data('data_id');

KNode.data(key, val)
--------------------------------------------------------
绑定自定义数据。

* 参数:
	* string key: data key
	* string val: data value
* 返回: string

示例:

.. sourcecode:: js

	K('#id').data('abc', 1);

.. index:: KNode.pos, pos

.. _KNode.pos:

KNode.pos()
--------------------------------------------------------
取得第一个node在整个document上的x坐标和y坐标。

* 参数: 无
* 返回: string

示例:

.. sourcecode:: js

	var pos = K('#id').pos();
	var x = pos.x;
	var y = pos.y;

.. index:: KNode.clone, clone

.. _KNode.clone:

KNode.clone(bool)
--------------------------------------------------------
复制一个第一个node，并返回第一个node的KNode。

* 参数: 
	* boolean bool: true时复制所有子节点，false时只复制父节点
* 返回: 新的KNode对象

示例:

.. sourcecode:: js

	var newKNode = K('#id').clone();

.. index:: KNode.append, append

.. _KNode.append:

KNode.append(expr)
--------------------------------------------------------
给所有element添加一个子节点。

* 参数: 
	*  string|node expr: DOM元素、选择器表达式、HTML代码
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id').append(divNode);
	K('#id').append('<div class="abc">def</div>');

.. index:: KNode.before, before

.. _KNode.before:

KNode.before(expr)
--------------------------------------------------------
element的前面添加一个节点。

* 参数: 
	*  string|node expr: DOM元素、选择器表达式、HTML代码
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id').before(divNode);
	K('#id').before('<div class="abc">def</div>');

.. index:: KNode.after, after

.. _KNode.after:

KNode.after(expr)
--------------------------------------------------------
element的后面添加一个节点。

* 参数: 
	*  string|node expr: DOM元素、选择器表达式、HTML代码
* 返回: KNode对象

示例:

.. sourcecode:: js

	K('#id').after(divNode);
	K('#id').after('<div class="abc">def</div>');
