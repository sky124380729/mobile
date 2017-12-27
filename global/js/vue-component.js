/* 验证码倒计时控件 
 * @author:pink_bin
   props ==>
   seconds:倒计时的时间
 */

const oaTimer = Vue.component('oa-timer', {
	template: `
		<button @click="send" class="btn-code" :disabled="sendMsgDisabled">
			<span v-if="sendMsgDisabled">{{time+'秒后重发'}}</span>
			<span v-else>获取验证码</span>
		</button>
	`,
	props: {
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
			let me = this;
			me.sendMsgDisabled = true;
			let interval = window.setInterval(function() {
				if((me.time--) <= 0) {
					me.time = this.seconds;
					me.sendMsgDisabled = false;
					window.clearInterval(interval);
				}
			}, 1000);
		}
	}
})

/* 跳转新页面 
 * @author:pink_bin
   props ==>
   url:跳转的地址
   extras:传的参数对象
   animation:跳转的动画,参见 http://www.dcloud.io/docs/api/zh_cn/webview.html#plus.webview.AnimationTypeShow
   tag:默认普通的a标签，可以传入为button标签
 * */
Vue.component('oa-a', {
	template: `
		<div>
			<a v-if="this.tag=='a'" href="javascript:void(0)" @tap="goTo" class="oa-a">
				<slot></slot>
			</a>
			<button v-if="this.tag=='button'" type="button" :disabled="!isCompleted" class="mui-btn mui-btn-green mui-btn-block" @tap="goTo">
				<slot></slot>
			</button>
		</div>
	`,
	props: {
		url: {
			type: String,
			required: true
		},
		tag: {
			type: String,
			default: 'a'
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
	},
	mixins: [isCompleted]
})