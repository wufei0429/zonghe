<template>
	<view class="uni-flex uni-column container">
		<input class="uni-input" type="number" placeholder="手机号" v-model="userDTO.mobile" required="required" />
		<input class="uni-input" password type="text" placeholder="密码" v-model="userDTO.password" required="required" />
		<input class="uni-input" password type="text" placeholder="确认密码" v-model="userDTO.passwordAgain" required="required" />
		<button class="green-btn" @tap="register(userDTO)">注册</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userDTO: {
					mobile: '',
					password: '',
				},
				remmberPsw: true
			};
		},
		onLoad() {
			// 		uni.setNavigationBarTitle({
			// 			title: '登录'
			// 		});
		},
		methods: {
			register: function(userDTO) {
				var _this = this;
				// console.log(userDTO.mobile + ',' + userDTO.password);
				if (_this.userDTO.password != _this.userDTO.passwordAgain) {
					uni.showToast({
						title: '两次密码输入不一致',
						duration: 1000,
						mask: true
					})
				} else {
					uni.request({
						url: 'http://47.102.201.109:8080/api/user/insertDto',
						// url: 'http://172.20.10.4:8080/api/user/sign_in',
						method: 'POST',
						data: {
							mobile: userDTO.mobile,
							password: userDTO.password,
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success: res => {
							console.log(res.data.code);
							if (res.data.code == 0) {
								uni.showModal({
									title: '注册成功',
									success: function(res) {
										if (res.confirm) {
											uni.navigateBack({
												delta: 2
											})
										} else if (res.cancel) {
											uni.navigateBack({
												delta: 2
											})
										}
									}
								});
							}
							//登录失败，弹出各种原因
							else {
								uni.showModal({
									title: '注册失败',
									content: res.data.msg
								});
							}
						}
					});
				}

			},
		}
	};
</script>

<style scoped>
	input {
		height: 50px;
		border-bottom: 1px solid #eee;
		margin-bottom: 5px;
	}

	.green-btn {
		background-color: #00B26A;
		margin-top: 10px;
	}

	.reg {
		display: flex;
		flex-flow: row nowrap;
	}
</style>
