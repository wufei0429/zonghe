<template>
	<view class="container"><view class="article" v-for="(article, index) in "></view></view>
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
	onShow:function(){},
	onPullDownRefresh:function() {
		this.getArticles();
	},
	methods: {
		getArticles:function(){
			var _this = this;
			uni.request({
				url:this.apiServer+'/article/list',
				method:'GET',
				header:{
					'content-type': 'application/x-www-form-urlencoded'
				},
				success:res=>{
					_this.articles = res.data.data;
				},
				complete:function(){
					uni.stopPullDownRefresh();
				}
			});
		},
		gotoDetail:function(aId){
			uni.navigateTo({
				url:'../articles_detail/article_detail'
			})
		},
		handleTime:function(data){

		},
		handleContent:function(msg){

		}
	}
};
</script>

<style>
.content {
	text-align: center;
	height: 400upx;
}
.logo {
	height: 200upx;
	width: 200upx;
	margin-top: 200upx;
}
.title {
	font-size: 36upx;
	color: #8f8f94;
}
</style>
