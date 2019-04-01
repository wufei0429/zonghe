<template>
	<view class="container">
		<view class="top">
			<view class="avatar-box">
				<image
					src="../../static/default.png"
					mode="scaleToFill"
					class="avatar"
					v-if="!storageData.login">
					</image>
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
			</view>
		</view>
		<view>
			<navigator url="../setting/setting">
				<button type="primary" @tap="signOut">设置</button>
			</navigator>
		</view>
	</view>
</template>

<script>
var loginRes, _self;
export default {
	data() {
		return {
			storageData: {}
		};
	},
	onLoad: function() {},
	onShow: function() {
		const loginKey = uni.getStorageSync('login_key');
		console.log("come");
		if (loginKey) {
			console.log(loginKey);
			this.storageData = {
				login: loginKey.login,
				nickname: loginKey.nickname,
				avatar: loginKey.avatar
			};
		}else{
			this.storageData ={
				login: false
			}
		}
	},
	methods: {
		
	}
};
</script>

<style scoped>
.top {
	display: flex;
	height: 70px;
	margin-top: 5px;
}
.avatar-box{
	flex: 1 1 30%;
}
.info-box{
	flex: 1 1 70%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}
</style>