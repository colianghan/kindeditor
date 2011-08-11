添加自定义插件
========================================================

1. 添加"hello"插件
--------------------------------------------------------

1) 定义语言。

.. sourcecode:: js

	KindEditor.lang({
		hello : '你好'
	});

2) 编写插件主体。

.. sourcecode:: js

	KindEditor.plugin('hello', function(K) {
		var editor = this, name = 'hello';
		// 点击图标时执行
		editor.clickToolbar(name, function() {
			editor.insertHtml('你好');
		});
	});

3) 在页面里添加CSS。

.. sourcecode:: css

	.ke-icon-hello {
		background-image: url(../skins/default/default.gif);
		background-position: 0px -672px;
		width: 16px;
		height: 16px;
	}

4) 最后调用编辑器时items数组里添加hello。

.. sourcecode:: js

	K.create('#id', {
		items : ['hello']
	});
