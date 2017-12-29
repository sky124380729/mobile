'use strict';
/* *
 * 头部组件 
 * 
 * */
Vue.component('oa-header', {
	props: {
		title: {
			type: String,
			required: true
		},
		url: {
			type: String
		}
	},
	template: `
			<header class="mui-bar mui-bar-nav">
				<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"><span class="back-text">返回</span></a>
				<h1 class="mui-title green">{{title}}</h1>
				<i class="iconfont icon-xinzeng green mui-pull-right" @tap="toAdd"></i>
			</header>
			`,
	methods: {
		toAdd: function() {
			var _this = this;
			mui.openWindow({
				url: _this.url,
				createNew: true,
				show: {
					aniShow: 'slide-in-right'
				}
			});
		}
	}
})

/* tab切换组件 
 * @author:pink_bin
 * 使用方法：
 * 列表内容的slot插槽和nav数组的下标一一对应
 */
Vue.component('oa-tab', {
	props: {
		//导航菜单数组
		nav: {
			required: true,
			type: Object
		},
		//导航条是否可以滚动
		scroll: {
			type: Boolean,
			default: false
		},
		//中央数据总线
		data: {
			required: true
		}
	},
	template: `
		<div id="slider" class="mui-slider mui-fullscreen">
			<div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
				<div :class="scroll?'mui-scroll':'tab-nav-item'">
					<a @tap="changeTab(index)" v-for="(item,index) in nav.tabs" class="mui-control-item" :class="{'mui-active':index===nav.index}">
						<i v-if="item.icon" class="iconfont" :class="item.icon"></i>{{item.txt}}
					</a>
				</div>
			</div>
			<slot></slot>
		</div>
	`,
	created() {
		//请求一次默认数据
		var _this = this;
		var _index = _this.nav.index;
		var _api = _this.nav.tabs[_index].api;
		mui.myAjax({
			url: _api.url,
			type: _api.type,
			data: {},
			success: function(data) {
				//更新根部数据
				_this.$emit('update:data', data.data.records);
				//修改中央api
				_this.$root.c.api = _this.nav.tabs[_index].api;
			}
		})

	},
	methods: {
		//点击导航请求数据，并修改中央api
		changeTab(index) {
			var _this = this;
			var _index = index;
			var _api = _this.nav.tabs[_index].api;
			mui.myAjax({
				url: _api.url,
				type: _api.type,
				data: _api.data || {},
				success: function(data) {
					//更新根部数据
					_this.$emit('update:data', data.data.records);
					//修改中央api
					_this.$root.c.api = _this.nav.tabs[_index].api;
					//修改中央总页码
					_this.$root.c.totalPage = data.data.page.totalPage;
					//修改页面
					_this.$root.c.page = 1;
				}
			})

		}

	},
	mounted: function() {

	}
})

/* 下拉刷新，上拉加载组件
 * @author:pink_bin
 * 使用方法：通常和自定义list组件配合使用
 * */
Vue.component("oa-drag", {
	props: {
		//中央数据总线
		data: {
			required: true
		}
	},
	template: ` 
		<div class="mui-content mui-scroll-wrapper">
            <div ref="scroll" class="mui-scroll">
                <slot></slot>
            </div>
    	</div>`,
	data: function() {
		return {
			page: this.$root.c.page
		}
	},
	mounted: function() {
		var _this = this;

		setTimeout(function() {
			mui.init({
				pullToRefresh: {
					container: _this.$el,
					down: {
						style: "circle",
						callback: function() {
							var _self = this;
							_this.getList(1);
							_this.page = 1;
							setTimeout(function() {
								_self.endPullDownToRefresh();
							}, 800);
						}
					},
					up: {
						callback: function() {
							var _self = this;
							_this.page++;
							console.log(_this.page, _this.$root.c.totalPage)
							if(_this.page > _this.$root.c.totalPage) {
								setTimeout(function() {
									_self.endPullUpToRefresh(true);
								}, 200);
							} else {
								_this.getList(_this.page);
								setTimeout(function() {
									_self.endPullUpToRefresh(true);
								}, 1000);
							}
						}
					}
				}
			})
		}, 2000)

	},
	methods: {
		getList: function(page) {
			var _this = this;
			var _api = _this.$root.c.api;
			mui.myAjax({
				url: _api.url,
				data: Object.assign(_api.data, {
					page: page || 1
				}),
				type: _api.type,
				success: function(data) {
					if(data.success) {
						_this.$root.c.totalPage = data.data.page.totalPage;

						if(page === 1) {
							//更新数据
							_this.$emit("update:data", data.data.records);
						} else {
							//新增数据
							_this.$emit("update:data", _this.data.concat(data.data.records))
						}
					} else {
						mui.toast(data.message)
					}
				}
			})

		}
	}
});

/* 列表组件(这里按需自己copy，没做封装)
 * @author:pink_pin
 * */
Vue.component('my-list', {
	template: `
		<ul class="oa-list mui-table-view">
			<li class="list-item" @tap="modalIndex=-1" v-longtap="{fn:showModal,index:index}" v-for="(item,index) in data" :key="item.id">
				<div class="mui-card-header mui-card-media">
					<div v-if="item.gzlx == 0" class="circle bg-yellow">计划</div>
					<div v-if="item.gzlx == 1" class="circle bg-blue">任务</div>
					<div v-if="item.gzlx == 2" class="circle bg-green">日常</div>					
					<div class="mui-media-body">
						<h4>
	                	郑泉
	                	<a v-if="item.gzzt == 0" class="list-item-sign">未开始</a>
	                	<a v-if="item.gzzt == 1" class="list-item-sign red">进行中</a>
	                	<a v-if="item.gzzt == 2" class="list-item-sign green">已完成</a>
	                </h4>
						<h6>未知</h6>
					</div>
				</div>
				<div class="mui-card-content">
					<h4>{{item.gzmc}}</h4>
					<p><label>开始时间：</label><span>{{item.kssj}}</span></p>
					<p><label>结束时间：</label><span>{{item.jssj}}</span></p>
				</div>
				<div class="list-modal" v-show="modalIndex === index" @tap="modalIndex=-1">
					<a class="copy-btn" @tap.stop="">复制</a>
				</div>
			</li>
		</ul>
	`,
	props: {
		//中央数据总线
		data: {
			required: true
		}
	},
	data: function() {
		return {
			//modal显示
			modalIndex: -1,
		}
	},
	computed: {

	},
	methods: {
		//显示蒙层
		showModal(obj) {
			this.modalIndex = obj.index;
		}
	},
	mounted: function() {

	}

})