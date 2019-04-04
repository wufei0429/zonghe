import Vue from 'vue'
import App from './App'
import { Base64 } from 'js-base64';

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
