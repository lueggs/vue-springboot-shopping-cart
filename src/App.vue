<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand class="mx-3">
        <router-link class="text-dark" to="/">
          <b-button variant="light">首頁</b-button>
        </router-link>
      </b-navbar-brand>
      <b-navbar-brand class="mx-2" left>
        <router-link class="text-dark" to="/product">
          <b-button variant="light">產品</b-button>
        </router-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="isLogin" right>
            <b-button variant="secondary" @click="showCart = !showCart">
              <font-awesome-icon icon="shopping-cart"></font-awesome-icon>
            </b-button>
          </b-nav-item>
          <b-nav-item v-if="!isLogin" right>
            <router-link class="text-dark" to="/login">
              <b-button variant="light">登入</b-button>
            </router-link>
          </b-nav-item>
          <b-nav-item-dropdown class="" v-else right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em class="text-white">{{ username }}</em>
            </template>
            <b-dropdown-item href="#">個人資料</b-dropdown-item>
            <b-dropdown-item @click="logout">登出</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal v-model="showCart" v-if="isLogin">
      <b-container>
        <b-row>
          <b-col>品牌</b-col>
          <b-col>商品</b-col>
          <b-col class="text-center">數量</b-col>
          <b-col class="text-right">價錢</b-col>
        </b-row>
      </b-container>
      <b-container class="my-4" v-for="(item, i) in cart" :key="i">
        <b-row>
          <b-col class="my-2">{{ item.brand.name }}</b-col>
          <b-col class="my-2">{{ item.name }}</b-col>
          <b-col class="my-2 text-right"
            ><b-button size="sm" @click="plusHandler(i)"
              ><font-awesome-icon icon="plus"></font-awesome-icon
            ></b-button>
            <span class="mx-2">{{ itemAmount[i] }}</span>
            <b-button size="sm" @click="minusHandler(i)"
              ><font-awesome-icon icon="minus"></font-awesome-icon></b-button
          ></b-col>
          <b-col class="my-2 text-right">
            <b-button
              v-if="totlePrice(i, item.price) == 0"
              size="sm"
              variant="danger"
              >移除</b-button
            >
            <span v-else class="ml-2 text-right"
              >${{ totlePrice(i, item.price) }}</span
            >
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <div id="nav">
      <router-view />
    </div>
  </div>
</template>
<script>
import cartService from "@/apis/carts/cart";
// import {mapState} from 'vuex'
// import product from "@/apis/products/product";
export default {
  data() {
    return {
      showCart: false,
      // cart:this.$store.state.cart
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("resetState");

      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
    totlePrice(i, price) {
      return this.itemAmount[i] * price;
    },
    // getCart() {
    //   if (this.isLogin) {
    //     const username = this.$store.state.username;
    //     cartService
    //       .getCartByUserName(username)
    //       .then(
    //         (res) => {
    //           this.itemAmount = res.data.graAmount;
    //           this.cartId = res.data.id;
    //           const data = [];
    //           data.push(res.data);
    //           data.forEach((obj) => {
    //             this.$store.state.cart = obj.graId;
    //           });
    //         },
    //         (err) => {
    //           console.log(err);
    //         }
    //       )
    //       .then(() => {
    //         const cart = this.$store.state.cart;
    //         const length = cart.length;
    //         cart.forEach((item) => {
    //           product.getOneGracard(item).then((res) => {
    //             cart.push(res.data);
    //           });
    //         });
    //         cart.splice(0, length);
    //         this.$store.state.cart = cart;
    //         this.cart = this.$store.state.cart;
    //       })
    //       .then(() => {
    //         setTimeout(() => {
    //           this.showCart = !this.showCart;
    //         }, 0);
    //       });
    //   } else {
    //     this.showCart = !this.showCart;
    //   }
    // },
    minusHandler(i) {
      const count = this.itemAmount[i];
      if (count > 0) {
        this.$set(this.itemAmount, i, this.itemAmount[i] - 1);
      } else {
        this.$set(this.itemAmount, i, 0);
      }
    },
    plusHandler(i) {
      this.$set(this.itemAmount, i, this.itemAmount[i] + 1);
    },
    saveCart() {
      const cart = this.cart;
      const graId = [];
      cart.forEach((obj) => {
        graId.push(obj.id);
      });
     
      const req = {
        graId: graId,
        userName: this.username,
        graAmount: this.itemAmount,
        createTime: null,
        _id: this.cartId,
      };
      
      cartService.updateCart(this.cartId, req).then((res) => {
        console.log(res);
      });
    },
  },
  watch: {
    showCart(val) {
      if (!val) {
        this.saveCart();
      }
    },
  },
  computed: {
    isLogin() {
      return this.$store.state.token ? true : false;
    },
    username() {
      return this.$store.state.username;
    },
    role() {
      return this.$store.state.role;
    },
    cart() {
      return this.$store.state.cart;
    },
    itemAmount() {
      return this.$store.state.itemAmount;
    },
    cartId() {
      return this.$store.state.cartId;
    },
  },
  created() {
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }

    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
      localStorage.setItem("cart", JSON.stringify(this.$store.state.cart));

      this.saveCart();
    });
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}
</style>
