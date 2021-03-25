import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faShoppingCart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueCookies from 'vue-cookies'


library.add(faUserSecret, faShoppingCart, faPlus, faMinus)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueCookies)

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   // const tokenExp = localStorage.getItem('tokenExp') as unknown as number
//   // const timestamp = new Date().getTime as unknown as number
//   if (!token && to.path !== "/login" && to.path !== "regist") {
//     next("/login")
//   } else {
//     next()
//   }
// })


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
