<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <title>File Manager</title>
        <style type="text/css" rel="stylesheet">
            body {
                font-size:12px;
                margin: 0px;
                background-color:#F0F0EE;
                overflow: hidden;
            }
            div.file-view {
                overflow: scroll;
                width: 500px;
                height: 400px;
            }
            div.area {
                float:left;
                font-size:12px;
                border: 1px solid #888888;
                margin: 5px;
            }
            div.area #photo {
                border: 1px solid #888888;
                margin: 3px;
            }
            div.area #name {
                margin: 2px;
                text-align: center;
            }
        </style>
        <script type="text/javascript">
        </script>
    </head>
    <body>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    <button id="">上一级目录</button>
                    显示方式：<select id="type" name="type">
                        <option value="1" selected="selected">缩略图</option>
                        <option value="2">详细信息</option>
                    </select>
                    排序方式：<select id="type" name="type">
                        <option value="1" selected="selected">名称</option>
                        <option value="2">大小</option>
                        <option value="3">类型</option>
                    </select>
                    <button id="">上传文件</button>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="file-view">
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                        <div class="area">
                            <div id="photo"><img src="./../attached/1.gif" width="100" height="100" /></div>
                            <div id="name">xxxxx.gif</div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </body>
</html>
