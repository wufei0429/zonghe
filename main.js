import Vue from 'vue'
import App from './App'
import { Base64 } from 'js-base64';


Vue.config.productionTip = false
//Vue.prototype.apiServer = 'http://47.103.15.190:8080/api'
//Vue.prototype.apiServer = 'http://47.102.201.109:8080/api'
// Vue.prototype.apiServer = 'http://127.0.0.1:8080/api'
//192.168.42.89   localhost
 Vue.prototype.apiServer = 'http://192.168.31.10:8080/api'
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
