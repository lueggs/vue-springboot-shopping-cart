import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/',
    name: 'Product',
    component: () => import('../components/ShopList.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/components/Order.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
