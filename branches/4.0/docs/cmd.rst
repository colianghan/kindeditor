Command API
========================================================

.. contents::
	:depth: 2

.. index:: cmd

.. _K.cmd:

K.cmd(doc)
--------------------------------------------------------
创建KCmd对象，KCmd用于操作可视化编辑区域的DOM。

* 参数:
	* document doc: document或KRange( :ref:`K.range` )
* 返回: KCmd

示例:

.. sourcecode:: js

	var cmd = K.cmd(document);
	cmd.bold();
	cmd.wrap('<span style="color:red;"></span>');
	cmd.remove({
		span : '*',
		div : 'class,border'
	});

.. index:: doc

.. _KCmd.doc:

doc
--------------------------------------------------------
document对象。

.. index:: win

.. _KCmd.win:

win
--------------------------------------------------------
window对象。

.. index:: sel

.. _KCmd.sel:

sel
--------------------------------------------------------
原生selection对象。

.. index:: range

.. _KCmd.range:

range
--------------------------------------------------------
KRange对象( :ref:`K.range` )

.. index:: select

.. _KCmd.select:

select()
--------------------------------------------------------
选中range。

* 参数: 无
* 返回: KCmd

示例:

.. sourcecode:: js

	cmd.select();

.. index:: wrap

.. _KCmd.wrap:

wrap(val)
--------------------------------------------------------
用指定element围住range。

* 参数:
	* string|node val: DOM元素、HTML代码
* 返回: KCmd

示例:

.. sourcecode:: js

	cmd.wrap('<strong></strong>');

.. index:: split

.. _KCmd.split:

split(isStart , map)
--------------------------------------------------------
根据map规则分割range的开始位置或结束位置。

* 参数:
	* boolean isStart: true或false
	* object map: 规则
* 返回: KCmd

示例:

.. sourcecode:: js

	cmd.split(true, {
		span : '*',
		div : 'class,border'
	});

.. index:: remove

.. _KCmd.remove:

remove(map)
--------------------------------------------------------
根据map规则删除range中的element或attribute。

* 参数:
	* object map: 规则
* 返回: KCmd

示例:

.. sourcecode:: js

	cmd.remove(true, {
		span : '*',
		div : 'class,border'
	});

.. index:: commonNode

.. _KCmd.commonNode:

commonNode(map)
--------------------------------------------------------
根据规则取得range的共通祖先。

* 参数:
	* object map: 规则
* 返回: KNode( :ref:`K` )

示例:

.. sourcecode:: js

	var node = cmd.commonNode({
		'*' : '.font-weight',
		'strong,b' : '*'
	});
