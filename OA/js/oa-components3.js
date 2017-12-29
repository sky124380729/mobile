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

/* 搜索筛选组件 */
Vue.component('oa-searchbar', {
	props: {

	},
	template: `
		<div>
			<div class="mask"  v-if="searchContent"></div>
			<div class="search-bar mui-text-center mui-clearfix">
				<!--搜索操作-->
				<template v-if="searchContent">
					<form class="search-box">
						<input @keyup.13.prevent="search" type="search" placeholder="搜索标题/正文内容" />
						<!--防止提交的解决方案-->
						<input type="text" style="display: none;" />
						<a @tap="searchContent = false;canScroll()" href="javascript:void(0);" class="cancel">取消</a>
					</form>
					
				</template>
				
				<template v-else>
					<div @tap="searchContent = true;noScroll()" class="search-bar-item">
						<i class="iconfont icon-sousuo"></i> 搜索
					</div>
					<div @tap="filter = true;noScroll();" class="search-bar-item"><i class="iconfont icon-shaixuan"></i> 筛选</div>
				</template>

				<!-- 筛选操作 -->
				<div class="mui-backdrop" @tap.self="filter = false;canScroll()" v-if="filter">
					<div class="filter-panel">
						<div class="row-head">
							工作类型
						</div>
						<div class="row-body">
							<ul>
								<li class="filter-item" v-for="(item,index) in workType.lists" :class="{active:index===workType.index}" @tap="workType.index = index">{{item}}</li>
							</ul>
						</div>
						<div class="row-head">
							工作状态
						</div>
						<div class="row-body">
							<ul>
								<li class="filter-item" v-for="(item,index) in workState.lists" :class="{active:index===workState.index}" @tap="workState.index = index">{{item}}</li>
							</ul>
						</div>
						<div class="row-head">
							开始时间
						</div>
						<div class="row-body">
							<div ref="startTime" data-options='{}' class="filter-item filter-block filter-date" @tap="chooseTime">请选择</div>
						</div>
						<div class="row-foot">
							<div class="foot-btn reset" @tap="reset">重置</div>
							<div class="foot-btn finish" @tap="finish">完成</div>
						</div>
					</div>
				</div>
			</div>
		</div>`,
	data: function() {
		return {
			searchContent: false,
			filter: false,

			//工作类型
			workType: {
				index: -1,
				lists: ['工作计划', '工作任务', '日常工作']
			},
			//工作状态
			workState: {
				index: -1,
				lists: ['未开始', '进行中', '已完成']
			}
		}
	},
	methods: {
		//阻止滚动
		noScroll() {
			document.documentElement.classList.add('noscroll');
			document.body.classList.add('noscroll');
		},
		//解除阻止滚动
		canScroll() {
			document.documentElement.classList.remove('noscroll');
			document.body.classList.remove('noscroll');
		},
		//重置
		reset() {
			this.workType.index = -1;
			this.workState.index = -1;
			this.$refs.startTime.innerText = '请选择';
		},
		//完成
		finish() {
			mui.toast('完成了');
			this.filter = false;
		},
		//执行搜索
		search(e) {
			mui.toast('搜索了');
			this.searchContent = false;
		},
		//选择时间
		chooseTime(el) {
			var _self = el.target;
			console.log(_self)
			var optionsJson = _self.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = _self.getAttribute('id');
			/*
			 * 首次显示时实例化组件
			 * 示例为了简洁，将 options 放在了按钮的 dom 上
			 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			 */
			_self.picker = new mui.DtPicker(options);
			_self.picker.show(function(rs) {
				/*
				 * rs.value 拼合后的 value
				 * rs.text 拼合后的 text
				 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				 * rs.m 月，用法同年
				 * rs.d 日，用法同年
				 * rs.h 时，用法同年
				 * rs.i 分（minutes 的第二个字母），用法同年
				 */

				/* 
				 * 返回 false 可以阻止选择框的关闭
				 * return false;
				 */
				/*
				 * 释放组件资源，释放后将将不能再操作组件
				 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				 */
				_self.innerText = rs.value;
				_self.picker.dispose();
				_self.picker = null;
			});
		}
	}
})

/* 下拉刷新，上拉加载组件
 * @author:pink_bin
 * 使用方法：通常和自定义list组件配合使用
 * */
Vue.component("oa-list", {
	props: {
		//存放api的tab数据(需传入api对象)
		items: {
			required: true,
		},
		//存放数据的站位空间(用来父子组件通信)
		info: {
			required: true
		}
	},
	template: ` <div class="mui-content mui-scroll-wrapper">
	                <div ref="scroll" class="mui-scroll">
	                    <slot></slot>
	                </div>
            	</div>`,
	data: function() {
		return {
			page: 1
		}
	},
	created: function() {
		var _this = this;
		_this.getList(1);
	},
	mounted: function() {
		var _this = this;
		mui(_this.$el).scroll({ //不显示滚动条
			indicators: false
		});
		_this.$nextTick(function() {
			mui(_this.$refs.scroll).pullToRefresh({
				down: {
					callback: function() {
						var _self = this;
						_this.getList(1);
						_this.page = 1;
						//重置控件，防止不能上拉加载
						_self.refresh(true);
						setTimeout(function() {
							_self.endPullDownToRefresh();
						}, 800);
						console.log(_this.page)
					}
				},
				up: {
					callback: function() {
						var _self = this;
						_this.page++;
						if(_this.page > _this.totalPage) {
							setTimeout(function() {
								_self.endPullUpToRefresh(true);
							}, 200);
							return;
						} else {
							_this.getList(_this.page);
							setTimeout(function() {
								_self.endPullUpToRefresh(false);
							}, 1000);
						}
						console.log(_this.page)
					}
				}
			});
		})
	},
	methods: {
		getList: function(page) {
			var _this = this;
			var _api = _this.items.api;
			mui.myAjax({
				url: _api.url,
				type: _api.type,
				data: Object.assign({}, _api.data, {
					page: page || 1
				}),
				success: function(data) {
					if(data.success) {
						_this.totalPage = data.data.page.totalPage;
						if(page === 1) {
							_this.$emit("update:info", data.data.records);
						} else {
							_this.$emit("update:info", _this.info.concat(data.data.records))
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
			<li class="list-item" @tap="modalIndex=-1" v-longtap="{fn:showModal,index:index}" v-for="(item,index) in items.list" :key="item.id">
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
	props: ['items'],
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
			type: Array
		},
		//导航条是否可以滚动
		scroll: {
			type: Boolean,
			default: false
		}
	},
	template: `
		<div id="slider" class="mui-slider mui-fullscreen">
			<div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted" id="segmented">
				<div :class="scroll?'mui-scroll':'tab-nav-item'">
					<a v-for="(item,index) in nav" class="mui-control-item" :class="{'mui-active':index===0}" :href="'#tab'+index">
						{{item}}
					</a>
				</div>
			</div>
			
			<slot name="bar"></slot>
			
			<div class="mui-slider-group" ref="sliderGroup"> 
				<div v-for="(item,index) in nav" :id="'tab'+index" class="mui-slider-item mui-control-content">
					<slot :name="index"></slot>
					<slot>
						<div class="noData mui-text-center">
							暂无数据
						</div>	
					</slot>
				</div>
			</div>
		</div>
		
	`,
	mounted: function() {
		if(this.$slots.bar) {
			this.$refs.sliderGroup.style.top = '82px'
		}
	}
})