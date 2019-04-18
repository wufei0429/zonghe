	<template>
	
	<view class="container">
		<view class="search-box">
			<view class="search-text">
				<input type="text" class="search" placeholder="搜索文章/专题/用户/文集" v-model="searchstr" />
			</view>
			<view class="search-icon" >
				<image src="../../static/search-grey.png"  @tap="search()" ></image>
			</view>
		</view>
		
		
		<view class="article" v-for="(article, index) in articles" :key="index" >
			<view class="article-box">
				<text class="article-title" @tap="gotoDetail(article.id)">{{ article.title }}</text>
			</view>
			
			
		</view>	
		
		
		<!-- <view class="main" v-for="(meg,index) in msgs" :key=index v-show="showall" >
			<view class="main-box">
				<view class="box-id">
					{{meg.id}}
				</view>
				<view class="box-title">
					<view class="main-title">
						{{meg.title}}
					</view>
					<view class="main-read">
						<text>阅读</text>
						{{meg.reading}}
					</view>
					
				</view>
				
			</view>
		</view> -->
	</view>
</template>

<script>
	export default{
		data() {
			return {
				showall:true,
				searchstr: '',
				article: {
					
					aId: 0,
					title: '',
					content: '',
					nickname: '',
					createTime: ''
					},
				articles: [],
				
			};
		},
		onLoad: function() {
			this.getArticles();
		},
		onShow: function() {},
		onPullDownRefresh: function() {
			this.getArticles();
		},
		
		computed: {
			filterArticles: function() {
				var filterArray = this.msgs;
				var searchString = this.searchstr;
				//若搜索关键字为空则返回原始数据
				if (!searchString) {
					return filterArray;
				} else {
					//去除无用字符转换成小写
					searchString = searchString.trim().toLowerCase();
					//过滤数组内容
					filterArray = filterArray.filter(function(item) {
						//找到了标题含有searchString
						if (item.title.toLowerCase().indexOf(searchString) != -1) {
							return item;
						}
					})
					//最终的过滤数组
					return filterArray;
				}
			}
		},
		
		methods: {
			
			
			getArticles: function() {
				var _this = this;
				uni.request({
					url: this.apiServer + '/article/list',
					method: 'GET',
					header: { 'content-type': 'application/x-www-form-urlencoded' },
					success: res => {
						_this.articles = res.data.data;
						for (var i = 0; i < _this.articles.length; i++) {
								_this.articles[i].createTime = this.handleTime(_this.articles[i].createTime);
								_this.articles[i].content = this.handleContent(_this.articles[i].content);
							}
					},
					complete: function() {
						uni.stopPullDownRefresh();
					}
				});
			},
			
			gotoDetail: function(aId) {
				uni.navigateTo({
					url: '../article_detail/article_detail?aId=' + aId
				})
			},
			
			handleTime: function(date) {
					var d = new Date(date);
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
					var hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
					var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
					var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
					return year + '-' + month + '-' + day + ' ' + hour + ":" + minutes + ':' + seconds
				},
			
			handleContent: function(msg) {
					let description = msg;
					description = description.replace(/(\n)/g, "");
					description = description.replace(/(\t)/g, "");
					description = description.replace(/(\r)/g, "");
					description = description.replace(/<\/?[^>]*>/g, "");
					description = description.replace(/\s*/g, "");
					return msg.substring(0, 50);;
				}
		},
		
		
	}
</script>

<style>
.search-box{
	display: flex;
	justify-content:space-between;
	/* border: 1px solid #00B26A; */
}
.search-text{
	border-radius: 10px;
	width:300px;
	align-content: center;
	border: 1px solid #aaaaaa;
}
.search-icon{
	width:35px ;
	height: 35px;
}
.search-icon image{
	width: 100%;
	height: 100%;
}


.article{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
}
.article-box{
	font-size: 13pt;
}



</style>
