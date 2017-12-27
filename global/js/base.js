/**
 * Created by lupn on 2017/12/12.  前端公共
 */

/*========================指令集========================*/

/* 常用的校验指令(失去焦点验证)
 * @author:pink_bin
   tips ==>
   key:校验名称
   value.reg:校验的正则表达式
   value.txt:提示信息
 * */
Vue.directive('validate', {
	bind(el, binding, vnode) {

		vnode.context.$set(vnode.context._data.validation, binding.arg, false);

		var tips = {

			'phone': {
				reg: /^(0|86|17951)?(13[0-9]|15[012356789]|17[10678]|18[0-9]|14[57])[0-9]{8}$/,
				txt: '请输入正确的手机号'
			},
			'password': {
				reg: /^[a-zA-Z0-9_-]{8,16}$/,
				txt: '请输入正确的密码'
			}

		}[binding.expression] || {
			reg: /\S+/,
			txt: '不能为空'
		}

		el.addEventListener('blur', function() {

			if(!tips.reg.test(el.value)) {
				vnode.context._data.validation[binding.arg] = false;
				mui.toast(tips.txt);
			} else {
				vnode.context._data.validation[binding.arg] = true;
			}
		})
	}
})

Vue.directive('drag', {
	bind(el, bindind, vnode) {
		//如果有删除参数
		if(bindind.modifiers.del) {
			//判断页面里面是否有删除的元素
			let delElement = document.createElement('div');
			delElement.id = "drag_del";
			delElement.style.position = 'fixed';
			delElement.style.bottom = '0';
			delElement.style.width = "100%";
			delElement.style.height = "60px";
			delElement.style.backgroundColor = "red";
			delElement.style.opacity = ".3";
			document.body.appendChild(delElement)
		}
	},
	inserted(el, binding) {
		let ele = el;
		ele.style.transition = 'scale .2s';
		ele.ontouchstart = (ex) => {
			ele.style.position = 'absolute';
			ele.style.zIndex = '9999';
			ele.style.transform = 'scale(2)';
			let e = ex.targetTouches[0];
			let originX = ele.offsetLeft;
			let originY = ele.offsetTop;
			let x = e.clientX - ele.offsetLeft;
			let y = e.clientY - ele.offsetTop;
			document.ontouchmove = (ex) => {
				let e = ex.targetTouches[0];
				let l = e.clientX - x;
				let t = e.clientY - y;
				
				ele.style.left = l + 'px';
				ele.style.top = t + 'px';
				
//				console.log(t)
				//判断落点
				if(t + 60 >= document.body.height) {
					document.getElementById('drag_del').style.opacity = '1'
				}
				console.log(t + 60 >= document.body.clientHeight)
			}
			document.ontouchend = (ex) => {
				document.ontouchmove = null;
				document.ontouchend = null;
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
function chooseTime(min_date, max_date, confirmFun, cancelFun) {
	var dDate = new Date(); //当前日期
	var minDate = new Date(min_date || '1900-01-01');
	var maxDate = new Date(max_date || dDate);
	mui.plusReady(function() {
		plus.nativeUI.pickDate(function(e) {
			var d = e.date;
			choosedDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			confirmFun(choosedDate, e);
		}, function(e) {
			if(typeof(cancelFun) != 'function') {
				choosedDate = "";
			} else {
				cancelFun(e);
			}
		}, {
			title: "请选择日期",
			date: dDate,
			minDate: minDate,
			maxDate: maxDate
		});
	});
}