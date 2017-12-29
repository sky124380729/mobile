/**
 * Created by lupn on 2017/12/20.  前端工具类库
 */

/*========================指令集========================*/

/* 扩展vue的事件类型，提供更丰富的功能
   @author:未知
         使用方法：v-longtap="{fn:vuetouch,name:'长按'}" //如果有参数以对象形式传，fn 为函数名
   link:http://blog.csdn.net/qq_17757973/article/details/78112976
 * */

function vueTouch(el, binding, type) {
	var _this = this;
	this.obj = el;
	this.binding = binding;
	this.touchType = type;
	this.vueTouches = {
		x: 0,
		y: 0
	};
	this.vueMoves = true;
	this.vueLeave = true;
	this.longTouch = true;
	this.vueCallBack = typeof(binding.value) == "object" ? binding.value.fn : binding.value;
	this.obj.addEventListener("touchstart", function(e) {
		_this.start(e);
	}, false);
	this.obj.addEventListener("touchend", function(e) {
		_this.end(e);
	}, false);
	this.obj.addEventListener("touchmove", function(e) {
		_this.move(e);
	}, false);
};
vueTouch.prototype = {
	start: function(e) {
		this.vueMoves = true;
		this.vueLeave = true;
		this.longTouch = true;
		this.vueTouches = {
			x: e.changedTouches[0].pageX,
			y: e.changedTouches[0].pageY
		};
		this.time = setTimeout(function() {
			if(this.vueLeave && this.vueMoves) {
				this.touchType == "longtap" && this.vueCallBack(this.binding.value, e);
				this.longTouch = false;
			};
		}.bind(this), 1000);
	},
	end: function(e) {
		var disX = e.changedTouches[0].pageX - this.vueTouches.x;
		var disY = e.changedTouches[0].pageY - this.vueTouches.y;
		clearTimeout(this.time);
		if(Math.abs(disX) > 10 || Math.abs(disY) > 100) {
			this.touchType == "swipe" && this.vueCallBack(this.binding.value, e);
			if(Math.abs(disX) > Math.abs(disY)) {
				if(disX > 10) {
					this.touchType == "swiperight" && this.vueCallBack(this.binding.value, e);
				};
				if(disX < -10) {
					this.touchType == "swipeleft" && this.vueCallBack(this.binding.value, e);
				};
			} else {
				if(disY > 10) {
					this.touchType == "swipedown" && this.vueCallBack(this.binding.value, e);
				};
				if(disY < -10) {
					this.touchType == "swipeup" && this.vueCallBack(this.binding.value, e);
				};
			};
		} else {
			if(this.longTouch && this.vueMoves) {
				this.touchType == "tap" && this.vueCallBack(this.binding.value, e);
				this.vueLeave = false
			};
		};
	},
	move: function(e) {
		this.vueMoves = false;
	}
};

Vue.directive("swipe", {
	bind: function(el, binding) {
		new vueTouch(el, binding, "swipe");
	}
});
Vue.directive("swipeleft", {
	bind: function(el, binding) {
		new vueTouch(el, binding, "swipeleft");
	}
});
Vue.directive("swiperight", {
	bind: function(el, binding) {
		new vueTouch(el, binding, "swiperight");
	}
});
Vue.directive("swipedown", {
	bind: function(el, binding) {
		new vueTouch(el, binding, "swipedown");
	}
});
Vue.directive("swipeup", {
	bind: function(el, binding) {
		new vueTouch(el, binding, "swipeup");
	}
});
Vue.directive("longtap", {
	bind: function(el, binding) {
		new vueTouch(el, binding, "longtap");
	}
});

/* 常用的校验指令(失去焦点验证)   (暂时弃用)
 * @author:pink_bin
 * 用法：v-validate:v1.req="'phone'"  :v1是唯一标识  'phone'是规则类型  .req是是否必须
   tips ==>
   key:校验名称
   value.reg:校验的正则表达式
   value.txt:提示信息
 * */
Vue.directive('validate', {
	bind(el, binding, vnode) {

		/* 每个验证指令在绑定之后给上下文对象的validation对象添加属性，为了整体校验
		      如果req参数存在的话，则是必须校验，否则校验不是必须的	
		 * */
		vnode.context.$set(vnode.context._data.validation, binding.arg, binding.modifiers.req ? false : true);

		/*如果是密码的话，需要给上下文的validation对象添加_password属性保存密码值，
		为了确认密码的时候进行校验 */
		if(binding.value === 'password') {
			el.addEventListener('blur', function() {
				vnode.context.$set(vnode.context._data.validation, '_password', el.value);
			})
		}

		/* 验证的主体逻辑 */
		var tips = {
			//手机号
			'phone': {
				reg: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/,
				txt: '请输入正确的手机号'
			},
			//密码
			'password': {
				reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
				txt: '请输入正确的密码'
			},
			//确认密码
			'confirmPassword': 'confirmPassword',
			//手机验证码
			'smsCode': {
				reg: /^\d{6}$/,
				txt: '请输入正确的验证码'
			}

		}[binding.value] || {
			reg: /\S+/,
			txt: '不能为空'
		}

		el.addEventListener('blur', function() {
			//确认密码的逻辑
			if(tips === 'confirmPassword' && el.value !== vnode.context._data.validation._password) {
				vnode.context._data.validation[binding.arg] = false;
				mui.toast('两次输入的密码不一致');
			} else if(tips === 'confirmPassword' && el.value === vnode.context._data.validation._password) {
				vnode.context._data.validation[binding.arg] = true;

				//主要逻辑
			} else if(!tips.reg.test(el.value)) {
				vnode.context._data.validation[binding.arg] = false;
				mui.toast(tips.txt);
			} else if(!tips.reg.test(el.value) && !binding.modifiers.req && el.value !== '') {
				vnode.context._data.validation[binding.arg] = true;
			} else if(tips.reg.test(el.value)) {
				vnode.context._data.validation[binding.arg] = true;
			}
		})
	}
})

/* 解决mui在使用的输入框添加快速删除事件类(mui-input-clear)的时候无效的问题
 * @author:pink_bin
 * 方法:将原先的mui-input-clear类替换成v-clear指令
 * */
Vue.directive('clear', {
	bind(el, binding, vnode) {
		!el.classList.contains('mui-input-clear') &&
			el.classList.add('mui-input-clear')

	},
	inserted(el, binding, vnode) {
		setTimeout(() => {
			Array.prototype.indexOf.call(el.nextElementSibling.classList, 'mui-icon-clear') !== -1 &&
				el.nextElementSibling.addEventListener('tap', function() {
					vnode.data.directives.forEach(function(item, index) {
						if(item.name === "model") {
							vnode.context[item.expression] = ''
						}
					})
				})
		}, 20)
	}
})

/* 移动端拖拽删除特效(测试可行性阶段)
 * 使用方法：元素可拖拽注册v-drag指令，需要删除操作则加del参数，即v-drag.del
 * @author:pink_bin
 * 
 * */
Vue.directive('drag', {
	inserted(el, binding) {
		//如果有删除参数
		if(binding.modifiers.del) {
			//判断页面里面是否有删除的元素
			if(document.getElementById('del-container')) return;
			let dom = document.createElement('div');
			dom.id = 'del-container';
			let css = {
				display: 'none',
				position: 'fixed',
				bottom: '0px',
				zIndex: 9999,
				width: '100%',
				height: '60px',
				background: 'orange',
				opacity: 0.3
			}
			for(var atr in css) {
				dom.style[atr] = css[atr];
			}
			document.body.appendChild(dom);
		}

		let ele = el;
		ele.style.transition = 'scale .2s';
		ele.ontouchstart = (ex) => {
			ele.style.position = 'fixed';
			ele.style.zIndex = '9999';
			ele.style.transform = 'scale(2)';
			let e = ex.targetTouches[0];
			let originX = ele.offsetLeft;
			let originY = ele.offsetTop;
			let x = e.clientX - ele.offsetLeft;
			let y = e.clientY - ele.offsetTop;
			let l;
			let t;
			document.ontouchmove = (ex) => {
				document.getElementById('del-container').style.display = 'block';
				let e = ex.targetTouches[0];
				l = e.clientX - x;
				t = e.clientY - y;
				ele.style.left = l + 'px';
				ele.style.top = t + 'px';
				//判断落点
				if(t + 60 >= document.body.clientHeight) {
					document.getElementById('del-container').style.opacity = '0.6';
				} else {
					document.getElementById('del-container').style.opacity = '0.3'
				}
			}
			document.ontouchend = (ex) => {
				document.ontouchmove = null;
				document.ontouchend = null;
				if(t + 60 >= document.body.clientHeight) {
					mui.toast('确认删除吗？');
					//执行逻辑...
				}
				document.getElementById('del-container').style.display = 'none';
				//返回到原始位置
				ele.style.position = 'static';
				ele.style.left = originX + 'px';
				ele.style.top = originY + 'px';
				ele.style.transform = 'scale(1)';
			}
		}
	}
})

/*========================mixins========================*/

/* 表单验证通过的按钮必须引入此项 ,此处作为一个示例来引用
 * author:pink_bin
 * */
var isCompleted = {
	computed: {
		isCompleted() {
			var flag = true;
			for(var i in this.$root.validation) {
				if(!this.$root.validation[i]) {
					flag = false;
				}
			}
			return flag;
		}
	}
}

/*========================普通功能函数========================*/

/* 控制返回键退出应用  */
function backControl() {
	mui.plusReady(function() {
		var backButtonPress = 0;
		mui.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
	})
}

/* 选择时间 */
function chooseTime(obj) {
	obj = obj || {};
	obj.min_date = obj.min_date || '1900-01-01';
	obj.max_date = obj.max_date || '';
	obj.fmt = obj.fmt || 'yyyy-MM-dd';
	if(!obj.time) {
		obj.time = false;
	} else {
		obj.fmt = 'yyyy-MM-dd hh:mm';
	}

	var dDate = new Date(); //当前日期
	var minDate = new Date(obj.min_date);
	var maxDate = new Date(obj.max_date);
	var choosedDate;
	mui.plusReady(function() {
		plus.nativeUI.pickDate(function(e) {
			var d = e.date;
			var year = d.getFullYear();
			var month = d.getMonth() + 1;
			var day = d.getDate();
			if(typeof(obj.confirmFun) == 'function') {
				if(obj.time) {
					plus.nativeUI.pickTime(function(e) {
						var t = e.date;
						var o = {
							"M+": month,
							"d+": day,
							"h+": t.getHours(),
							"m+": t.getMinutes(),
							"s+": t.getSeconds(),
							"q+": Math.floor((t.getMonth() + 3) / 3),
							"S": t.getMilliseconds()
						};
						if(/(y+)/.test(obj.fmt)) obj.fmt = obj.fmt.replace(RegExp.$1, (year + "").substr(4 - RegExp.$1.length));
						for(var k in o)
							if(new RegExp("(" + k + ")").test(obj.fmt)) obj.fmt = obj.fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
						obj.confirmFun(obj.fmt);
					}, function(e) {

					}, {
						title: "请选择时间",
						is24Hour: true,
						time: dDate
					})
				} else {
					var o = {
						"M+": month,
						"d+": day
					};
					if(/(y+)/.test(obj.fmt)) obj.fmt = obj.fmt.replace(RegExp.$1, (year + "").substr(4 - RegExp.$1.length));
					for(var k in o)
						if(new RegExp("(" + k + ")").test(obj.fmt)) obj.fmt = obj.fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
					obj.confirmFun(obj.fmt);
				}
			} else {
				console.error("type error");
			}
		}, function(e) {

		}, {
			title: "请选择日期",
			date: dDate,
			minDate: minDate,
			maxDate: maxDate
		});

	});
}

/**
 * 获取本周、本季度、本月、上月的开端日期、停止日期
 */
function DateUtils() {
	var now = new Date(); //当前日期
	var nowDayOfWeek = now.getDay(); //今天本周的第几天
	var nowDay = now.getDate(); //当前日
	var nowMonth = now.getMonth(); //当前月
	var nowYear = now.getYear(); //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //

	var lastMonthDate = new Date(); //上月日期
	lastMonthDate.setDate(1);
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
	var lastYear = lastMonthDate.getYear();
	var lastMonth = lastMonthDate.getMonth();
	//获得某月的天数
	function getMonthDays(myMonth) {
		var monthStartDate = new Date(nowYear, myMonth, 1);
		var monthEndDate = new Date(nowYear, myMonth + 1, 1);
		var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
		return days;
	}

	//获得本季度的开端月份
	this.getQuarterStartMonth = function() {
		var quarterStartMonth = 0;
		if(nowMonth < 3) {
			quarterStartMonth = 0;
		}
		if(2 < nowMonth && nowMonth < 6) {
			quarterStartMonth = 3;
		}
		if(5 < nowMonth && nowMonth < 9) {
			quarterStartMonth = 6;
		}
		if(nowMonth > 8) {
			quarterStartMonth = 9;
		}
		return quarterStartMonth;
	}

	//获得本周的开端日期
	this.getWeekStartDate = function() {
		var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
		return formatDate(weekStartDate);
	}

	//获得本周的停止日期
	this.getWeekEndDate = function() {
		var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
		return formatDate(weekEndDate);
	}

	//获得本月的开端日期
	this.getMonthStartDate = function() {
		var monthStartDate = new Date(nowYear, nowMonth, 1);
		return formatDate(monthStartDate);
	}

	//获得本月的停止日期
	this.getMonthEndDate = function() {
		var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
		return formatDate(monthEndDate);
	}

	//获得上月开端时候
	this.getLastMonthStartDate = function() {
		var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
		return formatDate(lastMonthStartDate);
	}

	//获得上月停止时候
	this.getLastMonthEndDate = function() {
		var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
		return formatDate(lastMonthEndDate);
	}

	//获得本季度的开端日期
	this.getQuarterStartDate = function() {

		var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
		return formatDate(quarterStartDate);
	}

	//或的本季度的停止日期
	this.getQuarterEndDate = function() {
		var quarterEndMonth = getQuarterStartMonth() + 2;
		var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
		return formatDate(quarterStartDate);
	}

}

//格局化日期：yyyy-MM-dd
function formatDate(date) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var myweekday = date.getDate();

	if(mymonth < 10) {
		mymonth = "0" + mymonth;
	}
	if(myweekday < 10) {
		myweekday = "0" + myweekday;
	}
	return(myyear + "-" + mymonth + "-" + myweekday);
}

/* 从url中获取参数 */
function findParamFromUrl(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); // 匹配目标参数
	if(r != null)
		return decodeURI(r[2]);
	return null; // 返回参数值
}

/* 解决mui框架ajax的问题
 * @author:pink_bin
 * 
 * */

mui.extend({
	myAjax: function(opt) {
		var api;
		if(opt.type.toUpperCase() === 'GET') {
			api = toUrl(opt.url, opt.data || {});
		} else {
			api = opt.url;
		}
		mui.ajax(api, {
			dataType: 'json', //服务器返回json格式数据
			type: opt.type, //HTTP请求类型
			data: opt.type.toUpperCase() === 'GET' ? '' : opt.data,
			async: opt.async || true,
			timeout: opt.timeout || 10000, //超时时间设置为10秒；
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				if(typeof opt.success === 'function') {
					opt.success.call('', data)
				}
			},
			error: function(xhr, type, errorThrown) {
				if(typeof opt.error === 'function') {
					opt.error.call('', xhr, type, errorThrown)
				} else {
					mui.toast('soory,您的请求失败了')
				}
			}
		})
	}
})

//地址栏拼接参数
function toUrl(url, params) {
	var paramsArr = [];
	if(Object.keys(params).length !== 0) {
		Object.keys(params).forEach(item => {
			paramsArr.push(item + '=' + params[item]);
		})
		if(url.search(/\?/) === -1) {
			url += '?' + paramsArr.join('&');
		} else {
			url += '&' + paramsArr.join('&');
		}

	}
	return url;
}