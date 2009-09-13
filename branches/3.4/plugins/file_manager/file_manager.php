<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <title>File Manager</title>
        <style type="text/css" rel="stylesheet">
            body {
                font-size:12px;
                margin: 0px;
                background-color:#FFFFFF;
                overflow: hidden;
            }
            td {
                font-size:12px;
            }
            .top {
                background-color:#F0F0EE;
            }
            div.file-view {
                overflow: scroll;
                width: 500px;
                height: 400px;
            }
            div.area {
                float:left;
                border: 1px solid #FFFFFF;
                margin: 5px;
            }
            div.area .photo {
                width: 100px;
                height: 100px;
                border: 1px solid #DDDDDD;
                margin: 3px;
            }
            div.area .name {
                margin: 2px;
                text-align: center;
                overflow: hidden;
            }
            .file-list th {
                font-size:12px;
                font-weight:normal;
                background-color: #DDDDDD;
                border-top: 1px solid #F0F0EE;
                border-left: 1px solid #F0F0EE;
                border-bottom: 1px solid #F0F0EE;
            }
            .file-list th.last {
                border: 1px solid #F0F0EE;
            }
        </style>
        <script type="text/javascript">
        </script>
    </head>
    <body>
        <table class="top" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td>
                    <a href="#"><img src="./images/go-up.gif" width="16" height="16" border="0" alt="上一级目录" align="absmiddle" /></a>
                    <a href="#">移到上一级目录</a>
                </td>
                <td align="center">
                    显示方式：<select id="type" name="type">
                        <option value="1" selected="selected">缩略图</option>
                        <option value="2">详细信息</option>
                    </select>
                    排序方式：<select id="type" name="type">
                        <option value="1" selected="selected">名称</option>
                        <option value="2">大小</option>
                        <option value="3">类型</option>
                    </select>
                </td>
                <td align="right">
                    <button id="upload-btn">上传文件</button>
                </td>
            </tr>
            <tr>
                <td height="5"></td>
                <td height="5"></td>
            </tr>
        </table>
        <table class="file-list" border="0" cellpadding="2" cellspacing="0" width="100%">
            <tr>
                <th width="60%">名称</th>
                <th width="10%">大小</th>
                <th width="10%">类型</th>
                <th width="20%" class="last">修改时间</th>
            </tr>
            <tr>
                <td><img src="./images/folder-16.gif" width="16" height="16" border="0" align="absmiddle" /> abcd</td>
                <td>-</td>
                <td>文件夹</td>
                <td align="center">2009-08-01 12:20</td>
            </tr>
            <tr>
                <td><img src="./images/file-16.gif" width="16" height="16" border="0" align="absmiddle" /> abcd.gif</td>
                <td>12KB</td>
                <td>文件</td>
                <td align="center">2009-08-01 12:20</td>
            </tr>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" style="display:none;">
            <tr>
                <td>
                    <div class="file-view">
                        <div class="area">
                            <table class="photo" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="middle" align="center"><img src="./images/folder-64.gif" width="64" height="64" /></div></td>
                                </tr>
                            </table>
                            <div class="name">abcde</div>
                        </div>
                        <div class="area">
                            <table class="photo" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="middle" align="center"><img src="./images/folder-64.gif" width="64" height="64" /></div></td>
                                </tr>
                            </table>
                            <div class="name">abcde</div>
                        </div>
                        <div class="area">
                            <table class="photo" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="middle" align="center"><img src="./images/folder-64.gif" width="64" height="64" /></div></td>
                                </tr>
                            </table>
                            <div class="name">abcde</div>
                        </div>
                        <div class="area">
                            <table class="photo" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="middle" align="center"><img src="./images/folder-64.gif" width="64" height="64" /></div></td>
                                </tr>
                            </table>
                            <div class="name">abcde</div>
                        </div>
                        <div class="area">
                            <table class="photo" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="middle" align="center"><img src="./images/file-64.gif" width="64" height="64" /></div></td>
                                </tr>
                            </table>
                            <div class="name">abcde</div>
                        </div>
                        <div class="area">
                            <table class="photo" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="middle" align="center"><img src="./../../attached/1.gif" width="90" height="90" /></div></td>
                                </tr>
                            </table>
                            <div class="name">abcde</div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </body>
</html>
