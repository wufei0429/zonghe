<template>
	<view class="container">
		
		
		<!-- 文章标题输入框，和title变量绑定 -->
		<input type="text" v-model="title" placeholder="请输入标题" />
		
		<!-- 文章内容输入的多行文本域，绑定content变量 -->
		<textarea placeholder="输入内容" v-model="content" class="content" />
		<!-- 选择图片的按钮，点击触发chooseImg方法 -->
		<button class="add-btn" @tap="chooseImg">+图片</button>
		<text>预览</text>
		<!-- 使用graceUI的富文本解析功能，来预览文章内容 -->
		<view class="grace-text">
				<rich-text :nodes="content" bindtap="tap"></rich-text>
		</view>
		<view class="green-a">
			<!-- <text class="">写作</text> -->
			<button class="green-btn" @tap="postArticle">
			<text>发布</text>
			</button>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			content: '',
			userId: uni.getStorageSync('login_key').userId,
			imgs: []
		};
	},
	onLoad() {
	},
	methods: {
		chooseImg: function() {
			var _this = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album'],
				success: function(res) {
					console.log(JSON.stringify(res.tempFilePaths));
					uni.uploadFile({
						url: _this.apiServer + '/avatar/upload',
						filePath: res.tempFilePaths[0],
						name: 'file',
						success: uploadFileRes => {
							//图片上传成功，回显图片地址
							console.log(uploadFileRes.data);
							//将图片地址加入imgs数组
							_this.imgs.push(uploadFileRes.data);
							//将图片地址拼接HTML标签，加入文章内容
							_this.content += '<img src="' + uploadFileRes.data + '" width = "100%"/>';
						}
					});
				}
			});
		},
		postArticle: function() {
			var _this = this;
			uni.request({
				url: this.apiServer + '/article/add',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					uId: this.userId,
					title: this.title,
					content: '<div>' + this.content + '</div>'
				},
				success: res => {
					if (res.data.code === 0) {
						//获得发布文章成功返回的文章id
						var aId = res.data.data;
						console.log(aId);
						uni.showToast({
							title: '发布成功'
						});
						//将文章id和文章对应的图片地址数组传到后台，存入数据库
						uni.request({
							url: this.apiServer + '/img/add',
							method: 'POST',
							header: { 'content-type': 'application/x-www-form-urlencoded' },
							data: {
								aId: aId,
								imgs: JSON.stringify(_this.imgs)  //序列化imgs数组
							},
							success: res => {
								if (res.data.code === 0) {
									console.log('文章图片地址已写入数据库');
								}
							}
						});
						uni.switchTab({
							url: '../index/index'
						});
					}
				}
			});
		}
	}
};
</script>

<style>
	.container{
		margin-bottom: 10px;
		margin-top: 10px;
	}
	.content {
		margin-bottom: 10px;
		margin-top: 10px;
		padding: 5px;
		border-bottom: 1px solid #eee;
	}
    .grace-text{
		margin-bottom: 10px;
		margin-top: 10px;
		padding: 5px;
	}
	
	/* .green-a{
		display: flex;
		justify-content: space-between;
	} */
	
	
	.green-btn {
		
		background-color: #00B26A;
		margin-top: 10px;
		/* width: 80px;
		padding-left: 10px;
		height: 45px; *//* 
		border-radius: 10px; */
	}
	
</style>