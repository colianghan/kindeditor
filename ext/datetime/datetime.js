/*******************************************************************************
* KindEditor 插入日期、时间
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence LGPL(http://www.opensource.org/licenses/lgpl-license.php)
* @version 1.0
*******************************************************************************/

KE.lang.date = '插入日期';
KE.lang.time = '插入时间';

KE.plugin.date = {
	click : function(id) {
		var date = new Date();
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1).toString();
		month = month.length < 2 ? '0' + month : month;
		var day = date.getDate().toString();
		day = day.length < 2 ? '0' + day : day;
		var value = year + '-' + month + '-' + day;
		KE.util.selection(id);
		KE.util.insertHtml(id, value);
		KE.util.focus(id);
	}
};

KE.plugin.time = {
	click : function(id) {
		var date = new Date();
		var hour = date.getHours().toString();
		hour = hour.length < 2 ? '0' + hour : hour;
		var minute = date.getMinutes().toString();
		minute = minute.length < 2 ? '0' + minute : minute;
		var second = date.getSeconds().toString();
		second = second.length < 2 ? '0' + second : second;
		var value = hour + ':' + minute + ':' + second;
		KE.util.selection(id);
		KE.util.insertHtml(id, value);
		KE.util.focus(id);
	}
};
