import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import iView from 'iview'
import axios from 'axios'
import 'iview/dist/styles/iview.css'
import './permission'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(iView)
// 全局使用echarts组件
Vue.prototype.$echarts = echarts


// 设置基础URL
axios.defaults.baseURL = ''
// 设置请求超时时间
axios.defaults.timeout = 5000

Vue.prototype.$axios = axios

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})