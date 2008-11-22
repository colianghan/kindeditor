#######################################################################
# 
# KindEditor 3.x 自述文件
#
#######################################################################

一 简单使用方法

1. 把所有文件上传到程序所在目录下，例如：http://你的域名/editor/。

2. 在此目录下创建attached文件夹，并把权限改成777。

3. 要添加编辑器的地方加入以下代码。
   这里[]里的内容要根据你的实际情况修改。
-----------------------------------------------------------------------
<script type="text/javascript" charset="utf-8" src="[JS路径]/kindeditor.js"></script>
<script type="text/javascript">
    KE.show({
        id : 'kindeditor',
        cssPath : './index.css'
    });
</script>
<textarea id="kindeditor" name="content" style="width:700px;height:300px;visibility:hidden;"></textarea>
<!-- 注意: 原来有TEXTAREA的话属性里只加id,width,height即可。 -->
-----------------------------------------------------------------------

* 要了解详情，请参考examples里的演示，或访问 http://www.kindsoft.net/。

-----------------------------------------------------------------------

二 属性介绍
-----------------------------------------------------------------------
1. wyswygMode
true或false，可视化模式或代码模式
默认值：true

2. autoOnsubmitMode
true或false，true时form的onsubmit里自动添加setData事件
默认值：true

3. skinType
风格类型，default或fck或tinymce
默认值：default

4. cssPath
指定编辑器的CSS
默认值：空
