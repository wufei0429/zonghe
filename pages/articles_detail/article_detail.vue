<template>
	<view class="container">
		<text class="article-title">{{article.title}}</text>
		<view class="article-info">
			<image :src="article.avatar" class="avatar small"></image>
			<text>{{article.nickname}}</text>
			<!-- <text class="info-text">{{handleTime(article.createTime)}}</text> -->
		</view>
		
		<view class="grace-text">
			<rich-text :nodes="article.content" bindtap="tap"></rich-text>
		</view>
		<text class="info-text">评论{{comments.length}}</text>
		<view class="comment-item" v-for="(comment,index) in comments" :key="index">
			<view class="left"><image :src="comment.avatar" class="avatar small"></image></view>
			<view class="right">
				<text>{{comment.nickname}}</text>
				<text>{{comment.content}}</text>
				<view>
					<text style="margin-right: 10px;">{{comments.length-index}}楼</text>
					<!-- <text>{{handleTime(comment.commentTime)}}</text> -->
				</view>
			</view>
		</view>
		<input class="uni-input comment-box" type="text" placeholder="写下你的评论" v-model="comment" required="required" />
		<button class="green-btn" >提交</button>
	</view>
</template>
<script>
	export default{
		data() {
			return {
				article: {
					aId: 0,
					title: '',
					content: '',
					avatar: '',
					nickname: '',
					createTime: ''
				},
				comments: [],
				imgs: [],
				comment: ''
			};
		},
		onLoad:function(option){
			console.log(option.aId);
			this.aId = option.aId;
		},
		onShow:function(){
			this.getArticle();
		},
		onPullDownRefresh:function(){
			this.getArticle();
		},
		methods: {
			getArticle:function(){
				var _this = this;
				uni.request({
					url:this.apiServer + '/article/' + this.aId,
					method: 'GET',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					success: res => {
						console.log(res.data.data.article.title+'======');
						_this.article.title = res.data.data.article.title;
						_this.article.content = res.data.data.article.content;
						_this.article.nickname = res.data.data.article.nickname;
						_this.article.avatar = res.data.data.article.avatar;
						_this.article.createTime = res.data.data.article.createTime;
						_this.comments = res.data.data.comments;
						_this.imgs = res.data.data.imgs;
					},
					complete: function(){
						uni.uni.stopPullDownRefresh();
					}
				});
			},
		}
	}
</script>

<style>
</style>