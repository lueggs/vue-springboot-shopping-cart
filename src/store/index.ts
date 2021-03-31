import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)



const getDefaultState = () => {
  return {
    token: '',
    username: '',
    // tokenExp: 0,
    role: '',
    cart: [] as any,
    itemAmount: [0],
    // cartId: 0,
    product: [],
    order: [] as any,
    newOrder: false
  }
}

export default new Vuex.Store({
  state: getDefaultState()
  ,
  mutations: {
    SET_AUTH(state, options) {
      state.token = options.token
      state.username = options.username
      // state.tokenExp = options.tokenExp
      state.role = options.role
    },
    RESET_STATE(state) {
      Object.assign(state, getDefaultState())
    },
    RESET_CART(state) {
      state.cart.splice(0, 1)
    },
    ADD_CART(state, options: {}) {
      state.cart.push(options)
    },
    INIT_CART(state, options) {
      state.cart = options
    },
    INIT_ITEMAMOUNT(state, options) {
      state.itemAmount = options
    },
    ADD_ITEMAMOUNT(state, options: number) {
      state.itemAmount.push(options)
    },

    INIT_PRODUCT(state, options) {
      state.product = options
    },
    SET_ORDER(state, options) {
      state.order = options
    },
    ADD_ORDER(state, options) {
      state.order.push(options)
    },
    STATUS_ORDER(state, options) {
      state.newOrder = options
    }


  },
  actions: {
    setAuth(context, options) {
      context.commit('SET_AUTH', {
        token: options.token,
        username: options.username,
        tokenExp: options.tokenExp,
        role: options.roles[0]
      })
    },
    resetState({ commit }) {
      commit('RESET_STATE')
    },
    addCart(context, options) {
      context.commit('ADD_CART', options)
    },
    resetCart(context, options) {
      context.commit('RESET_CART', options)
    },
    initItemAmount(context, options) {
      context.commit('INIT_ITEMAMOUNT', options)
    },
    addItemAmount(context, options) {
      context.commit('ADD_ITEMAMOUNT', options)
    },

    initCart(context, options) {
      context.commit('INIT_CART', options)
    },
    initProduct(context, options) {
      context.commit('INIT_PRODUCT', options)
    },
    setOrder(context, options) {
      context.commit('SET_ORDER', options)
    },
    addOrder(context, options) {
      context.commit('ADD_ORDER', options)
    },
    statusOrder(context, options) {
      context.commit('STATUS_ORDER', options)
    }
  },
  modules: {
  }
})
