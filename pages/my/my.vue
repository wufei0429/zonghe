<template>
	<view class="container">
		<!-- 顶部头像和昵称区域，纵向排列 -->
		<view class="top">
			<view class="avatar-box">
				<image
					src="../../static/default.png"
					mode="scaleToFill"
					class="avatar"
					v-if="!storageData.login"
				></image>
				<image
					:src="storageData.avatar"
					mode="scaleToFill"
					class="avatar"
					v-if="storageData.login"
				></image>
			</view>
			<view class="info-box">
				<navigator url="../signin/signin" v-if="!storageData.login">点击登录</navigator>
				<text v-if="storageData.login">{{ storageData.nickname }}</text>
				<navigator url="../setting/setting" v-if="storageData.login">
					<text class="setting-txt">个人设置</text>
				</navigator>
			</view>
		</view>
		<scroll-view class="c1" scroll-x="true">
			<view class="c1-1"><image src="../../static/1.jpg" style="width: 100%;"></image></view>
			<view class="c1-1"><image src="../../static/4.jpg" mode=""></image></view>
			<view class="c1-1"><image src="../../static/2.jpg" mode=""></image></view>
			<view class="c1-1"><image src="../../static/3.jpg" mode=""></image></view>
		</scroll-view>
		<!-- 中间文章数量、好友数量、消息数量等统计区域，横向排列 -->
		<view v-if="login">
			<scroll-view class="grace-tab-title grace-center" scroll-x="true" id="grace-tab-title">
				<view
					v-for="(cate, index) in categories"
					:key="index"
					:data-cateid="cate.cateid"
					:data-index="index"
					:class="[cateCurrentIndex == index ? 'grace-tab-current' : '']"
					@tap="tabChange"
				>
					{{ cate.name }}
				</view>
			</scroll-view>

			<view class="demo-content">
				<!-- 文章部分 -->
				<view class="content" v-if="cateCurrentIndex == 0">
					您发表了 {{ articles.length }} 篇文章
					<view class="list">
						<view class="list-item" v-for="(article, index) in articles" :key="index">
							<text @tap="gotoDetail(article.id)">
								{{ index + 1 }} . {{ article.title }}
							</text>
						</view>
					</view>
				</view>

				<!-- 关注部分 -->
				<view class="content" v-if="cateCurrentIndex == 1">
					<view class="list">
						您关注了 {{ follows.length }} 个人
						<view class="list-item" v-for="(follow, index) in follows" :key="index">
							<image :src="follow.avatar" class="avatar small"></image>
							<text style="margin-left: 20px;">{{ follow.nickname }}</text>
						</view>
					</view>
				</view>

				<!-- 收藏部分 -->
				<view class="content" v-if="cateCurrentIndex == 2">
					<text>收藏 : {{ collection }}</text>
				</view>

				<!-- 积分部分 -->
				<view class="content" v-if="cateCurrentIndex == 3">
					<text>积分 : {{ jifen }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
var loginRes, _self;
export default {
	data() {
		return {
			storageData: {
				userId: 0,
				nickname: '',
				avatar: '',
				login: false
			},
			//分类信息
			categories: [
				{ cateid: 0, name: '文章' },
				{ cateid: 1, name: '关注' },
				{ cateid: 2, name: '收藏' },
				{ cateid: 3, name: '积分' }
			],
			// 当前选择的分类
			cateCurrentIndex: 0,
			articles: [],
			follows: [],
			jifen: 100,
			collection: 8
		};
	},
	onLoad: function() {},
	onShow: function() {
		var _this = this;
		uni.request({
			// url: 'http://localhost:8080/api/user/' + uni.getStorageSync('login_key').userId,
			url: this.apiServer + '/user/getUserByMobile',
			method: 'GET',
			data: {
				mobile: _this.mobile
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: res => {
				if (res.data.code === 0) {
					// console.log(res.data.data.avatar + '————————————');
					_this.avatar = res.data.data.avatar;
					_this.nickname = res.data.data.nickname1;
				}
			}
		});
		const loginKey = uni.getStorageSync('login_key');
		if (loginKey) {
			this.login = true;
			// console.log('shihoudengnkw:' + this.login);
			this.storageData = {
				login: loginKey.login,
				nickname: loginKey.nickname,
				avatar: loginKey.avatar,
				userId: loginKey.userId
			};
			// 			uni.request({
			// 				// 获取用户的文章数量
			// 				url: this.apiServer + '/article/getArticleByUID',
			// 				method: 'GET',
			// 				header: { 'content-type': 'application/x-www-form-urlencoded' },
			// 				data: {
			// 					userId: this.storageData.userId
			// 				},
			// 				success: res => {
			// 					_this.articleCount = res.data.data.length;
			// 					console.log('文章数量' + _this.articleCount);
			// 				}
			// 			});
			uni.request({
				// 根据用户id获取所有发表的文章
				url: this.apiServer + '/article/getArticleByUID',
				method: 'GET',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					uId: this.storageData.userId
				},
				success: res => {
					_this.articles = res.data.data;
				}
			});
			uni.request({
				// 	根据userId查询所有关注的用户
				url: this.apiServer + '/follow/getFollowsByUId',
				method: 'GET',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					fromUId: this.storageData.userId
				},
				success: res => {
					_this.follows = res.data.data;
				}
			});
		} else {
			this.storageData = {
				login: false
			};
		}
	},
	methods: {
		tabChange: function(e) {
			// 选中的索引
			var index = e.currentTarget.dataset.index;
			// 具体的分类id
			var cateid = e.currentTarget.dataset.cateid;
			this.cateCurrentIndex = index;
			// 动态替换内容
			this.content = this.categories[index].name;
		},
		gotoDetail: function(aId) {
			uni.navigateTo({
				url:
					'../articles_detail/article_detail?aId=' +
					aId +
					'&userId=' +
					this.storageData.userId
			});
		}
	}
};
</script>

<style scoped>
.top {
	display: flex;
	flex-direction: column;
	text-align: center;
	height: 100px;
	margin-top: 20px;
}
.avatar-box {
	flex: 1 1 30%;
}
.avatar {
	width: 60px;
	height: 60px;
}
.info-box {
	flex: 1 1 70%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.setting-txt {
	color: #00b26a;
	margin-left: 15px;
}
.center {
	display: flex;
	justify-content: center;
	margin-top: 30px;
}
.content {
	margin-top: 20px;
	flex: 1 1 25%;
}
.list-item {
	margin-top: 20px;
}
.c1 {
	margin-top: 25px;
	margin-bottom: 10px;
	white-space: nowrap;
	display: flex;
	margin-bottom: 10px;
}
.c1-1 {
	width: 100%;
	height: 130px;
	display: inline-block;
}
.c1-1 image {
	width: 100%;
	height: 100%;
}
</style>
