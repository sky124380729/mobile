/* 验证码倒计时控件 
 * @author:pink_bin
   props ==>
   yzmlx:验证码类型  1是忘记密码  2是注册
   seconds:倒计时的时间，默认60秒
   direct:需要验证的input标签的ref属性指向
 */
const oaTimer = Vue.component('oa-timer', {
	template: `
		<button @tap="send" class="btn-code" :disabled="sendMsgDisabled">
			<span v-if="sendMsgDisabled">{{time+'秒后重发'}}</span>
			<span v-else>获取验证码</span>
		</button>
	`,
	props: {
		yzmlx: {
			type: String,
			required: true
		},
		direct: {
			type: String,
			required:true
		},
		seconds: {
			type: Number,
			default: 60
		}
	},
	data() {
		return {
			time: this.seconds, // 发送验证码倒计时
			sendMsgDisabled: false
		}
	},
	methods: {
		send() {
			let _this = this;
			let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;

			if(_this.direct && !reg.test(_this.$root.$refs[this.direct].value)) {
				mui.toast('请输入正确的手机号');
				return;
			}
			mui.ajax(CONSTANT.baseUrl + 'mobile/user/get/yzm?mobile=' + _this.$root.$refs[this.direct].value + '&yzmlx=' + _this.yzmlx, {
				dataType: 'json', //服务器返回json格式数据
				type: 'GET', //HTTP请求类型
				async: false,
				timeout: 10000, //超时时间设置为10秒；
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(data) {
					if(data.success) {
						_this.sendMsgDisabled = true;
						let interval = window.setInterval(function() {
							if((_this.time--) <= 0) {
								_this.time = _this.seconds;
								_this.sendMsgDisabled = false;
								window.clearInterval(interval);
							}
						}, 1000);
					} else {
						_this.sendMsgDisabled = false;
						mui.toast(data.message);
					}
				},
				error: function(xhr, type, errorThrown) {
					console.log('验证码接口请求失败');
				}
			})

		}
	}
})

/* 跳转新页面(普通带参数跳转)
 * @author:pink_bin
   props ==>
   url:跳转的地址
   extras:传的参数对象
   animation:跳转的动画,参见 http://www.dcloud.io/docs/api/zh_cn/webview.html#plus.webview.AnimationTypeShow
   tag:默认普通的a标签，可以传入为button标签
 * */
const oaA = Vue.component('oa-a', {
	template: `
		<a href="javascript:void(0)" @tap="goTo" class="oa-a">
			<slot></slot>
		</a>
	`,
	props: {
		url: {
			type: String
		},
		extras: {
			type: Object
		},
		animation: {
			type: String,
			default: 'slide-in-right'
		},
		opts: {
			type: Object
		}
	},
	methods: {
		goTo() {
			mui.openWindow(Object.assign({}, {
				url: this.url,
				createNew: true,
				extras: this.extras,
				show: {
					aniShow: this.animation
				}
			}, this.opts));
		}
	}
})

/* 需要验证操作的button按钮
 * @author:pink_bin
 * */
const oaButton = Vue.component('oa-button', {
	template: `
		<button type="button" :disabled="!isCompleted" class="mui-btn mui-btn-green mui-btn-block">
			<slot></slot>
		</button>
	`,
	mixins: [isCompleted]
})