/**
 * Created by lupn on 2017/12/12.  前端公共配置
 */

var CONSTANT = window.CONSTANT || {};

//工程根地址

//手机端
CONSTANT.baseUrl = 'http://172.17.20.42:8080/olife-mobile-web/';
//pc端
//CONSTANT.baseUrl = 'http://localhost/olife-mobile-web/';

var stateData = [{
	value: '',
	text: '请选择'
}, {
	value: '0',
	text: '未开始'
}, {
	value: '1',
	text: '进行中'
}, {
	value: '2',
	text: '已完成'
}];
// 获取用户信息接口
function getUserInfo() {
	var info;
	mui.ajax(CONSTANT.baseUrl + 'mobile/user/getUserModel', {
		type: "GET",
		async: false,
		dataType: 'json',
		success: function(data) {
			if(data.success) {
				info = data;
			} else {
				mui.toast("获取用户信息失败！")
			}
		}
	})
	return info;
}

//地址栏参数匹配
function findParamFromUrl(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); // 匹配目标参数
	if(r != null)
		return unescape(r[2]);
	return null; // 返回参数值
}