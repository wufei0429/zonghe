<template>
	<view class="uni-flex uni-column container">
		<view class="list">
			<view class="list-nick">
				<navigator class="list-item" url="user-nickname">修改昵称</navigator>
				<view>{{ nickname }}</view>
			</view>

			<view class="list-avatar">
				<navigator @tap="showActionSheet">修改图像</navigator>
				<image :src="avatar" class="avatar" @tap="showActionSheet"></image>
			</view>

			<view class="list-nick">
				<navigator class="list-item" url="user-password">修改密码</navigator>
			</view>
		</view>

		<button @tap="logout" class="green-btn">退出当前账号</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nickname: uni.getStorageSync('login_key').nickname,
			avatar: uni.getStorageSync('login_key').avatar,
			userId: uni.getStorageSync('login_key').userId
		};
	},
	onLoad() {},
	methods: {
		logout: function() {
			console.log('log out');
			uni.removeStorageSync('login_key');
			uni.showToast({
				title: '已经退出当前账号'
			});
			uni.navigateBack();
		},
		showActionSheet: function() {
			console.log('show');
			var _this = this;
			uni.showActionSheet({
				itemList: ['拍照', '从相册选择'],
				success: function(res) {
					console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					//选择的是拍照功能
					if (res.tapIndex == 0) {
						uni.chooseImage({
							count: 1,
							sourceType: ['camera'],
							success: function(res) {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePaths[0],
									success: function() {
										console.log('save success');
										uni.uploadFile({
											url: 'http://47.102.201.109:8080/api/user/avatar',
											filePath: res.tempFilePaths[0],
											name: 'file',
											formData: {
												userId: _this.userId
											},
											success: uploadFileRes => {
												console.log(uploadFileRes.data);
												_this.avatar = uploadFileRes.data;
											}
										}).then(function() {
											alert('修改图像成功');
											_this.courses.splice(index, 1); //修改id为index的1条数据
										});
									}
								});
							}
						});
					}
					//从相册选择
					if (res.tapIndex == 1) {
						uni.chooseImage({
							count: 1, //默认9
							sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都
							sourceType: ['album'], //从相册选择
							success: function(res) {
								console.log(JSON.stringify(res.tempFilePaths));
								uni.uploadFile({
									url: 'http://47.102.201.109:8080/api/user/avatar',
									filePath: res.tempFilePaths[0],
									name: 'file',
									formData: {
										userId: _this.userId
									},
									success: uploadFileRes => {
										console.log(uploadFileRes.data);
										_this.avatar = uploadFileRes.data;
									}
								});
							}
						});
					}
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});
		}
	},
	// ,
// 	bindLogin(e) {
// 		try {
// 			uni.setStorageSync('login_key', {
// 				userId: this.userId,
// 				nickname: this.nickname,
// 				avatar: this.avatar,
// 				token: this.token,
// 				login: true
// 			});
// 		} catch (e) {
// 			// error
// 		}
// 		uni.navigateBack();
// 	}
};
</script>

<style>
.green-btn {
	background-color: #00b26a;
}

.list-avatar {
	display: flex;
	align-items: center;
	height: 100px;
	justify-content: space-between;
	/* border: 1px solid #8F8F94; */
}

.list-nick {
	display: flex;
	height: 70px;
	align-items: center;
	justify-content: space-between;
	/* border: 1px solid #8F8F94; */
}
.avatar {
	border-radius: 50%;
	align-items: center;
	height: 80px;
	width: 80px;
}
</style>
