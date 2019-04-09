<template>
	<view class="container">
		<view class="article" v-for="(article, index) in articles" :key="index">
			<!-- 标题 -->
			<text class="article-title" @tap="gotoDetail(article.id)">{{ article.title }}</text>
			<!-- 大于等于三张图片的显示方式 -->
			<view class="" v-if="article.imgs.length >= 3">
				<view class="thumbnail-box">
					<view class="thumbnail-item" v-for="(item, index) in article.imgs" :key="index">
						<image :src="item.imgs"></image>
					</view>
				</view>
			</view>
			<!-- 小于三张图片的显示方式 -->
			<view class="" v-else-if="article.imgs.length >= 1">
				<view class="text-img-box">
					<view class="left">
						<text>{{ article.title }}</text>
					</view>
					<view class="right">
						<image :src="article.imgs[article.imgs.length - 1].imgs"></image>
					</view>
				</view>
			</view>
			<!-- 没有图片的显示方式 -->
			<view class="text-box" v-else>
				<text>{{ article.title }}</text>
			</view>

			<view class="article-info">
				<image :src="article.avatar" class="avatar small"></image>
				<text class="info-text">{{ article.nickname }}</text>
				<text class="info-text">{{ handleTime(article.createTime) }}</text>
			</view>
			<view class="article-bottom"></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			articles: []
		};
	},
	onLoad: function() {
		this.getArticles();
	},
	onShow: function() {},
	onPullDownRefresh: function() {
		this.getArticles();
	},
	methods: {
		getArticles: function() {
			var _this = this;
			uni.request({
				url: this.apiServer + '/article/list',
				method: 'GET',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				success: res => {
					_this.articles = res.data.data;
				},
				complete: function() {
					uni.stopPullDownRefresh();
				}
			});
		},
		gotoDetail: function(aId) {
			uni.navigateTo({
				url: '../articles_detail/article_detail?aId=' + aId
			});
		},
		handleTime: function(createTime) {
			var date = new Date(createTime);
			var year = date.getFullYear();
			var month =
				date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
			var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
			var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
			var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
			// 拼接
			return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
		},
		handleContent: function(msg) {}
	}
};
</script>

<style>
.container {
	margin-top: 20px;
}

.article-title {
	margin-top: 10px;
}

.text-img-box {
	display: flex;
	height: 150px;
}
.left {
	width: 70%;
}
.right {
	width: 30%;
}

.right image {
	width: 100%;
	height: 100%;
}

.article-bottom {
	height: 10px;
	width: 120%;
	margin-left: -20px;
	background-color: #dddddd;
}

.article-info {
	display: flex;
	/* justify-content:center; */
	align-items: center;
	margin-bottom: 10px;
}

.info-text {
	margin-left: 10px;
}
</style>
