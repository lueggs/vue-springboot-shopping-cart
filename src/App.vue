<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <!-- <b-navbar-brand class="mx-3">
        <router-link class="text-dark" to="/">
          <b-button variant="light">首頁</b-button>
        </router-link>
      </b-navbar-brand> -->
      <b-navbar-brand class="mx-2" left>
        <router-link class="text-dark" to="/">
          <b-button variant="light">產品</b-button>
        </router-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item class="mr-2" v-if="isLogin" right>
            <b-button variant="primary" @click="showCart = !showCart">
              <font-awesome-icon icon="shopping-cart"></font-awesome-icon>
            </b-button>
          </b-nav-item>
          <b-nav-item v-if="!isLogin" right>
            <router-link class="text-dark" to="/login">
              <b-button variant="light">登入</b-button>
            </router-link>
          </b-nav-item>
          <b-nav-item-dropdown class="btn" v-else right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em class="text-white">{{ username }}</em>
            </template>
            <b-dropdown-item href="#">個人資料</b-dropdown-item>
            <b-dropdown-item href="/order">我的訂單</b-dropdown-item>
            <b-dropdown-item @click="logout">登出</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal v-model="showCart" :body-bg-variant="'light'" v-if="isLogin">
      <template #modal-header>
        <div class="w-100 text-center">
          <h3 class="text-primary">您的購物車</h3>
        </div>
      </template>
      <b-container class="p-0">
        <b-row>
          <b-col cols="2" class="text-left">品牌</b-col>
          <b-col cols="2" class="text-center">商品</b-col>
          <b-col cols="4" class="text-center ml-4">數量</b-col>
          <b-col cols="2" class="text-center">價錢</b-col>
          <b-col cols="2" class="text-right"></b-col>
        </b-row>
      </b-container>
      <b-container class="my-4" v-if="cart == null || cart.length == 0">
        <p class="h5 text-secondary text-center">購物車裡沒有商品喔</p>
      </b-container>
      <b-container class="mx-0 p-0 my-4" v-for="(item, i) in cart" :key="i">
        <b-row>
          <b-col cols="2" class="my-2 text-left">{{ item.brand.name }}</b-col>
          <b-col cols="2" class="my-2 text-center">{{ item.name }}</b-col>
          <b-col cols="4" class="my-2 text-right"
            ><b-button
              class="mr-2"
              variant="outline-info"
              pill
              size="sm"
              @click="plusHandler(i)"
              ><font-awesome-icon icon="plus"></font-awesome-icon
            ></b-button>
            <span class="mx-1 p-0">{{ itemAmount[i] }}</span>
            <b-button
              class="ml-2"
              variant="outline-info"
              pill
              size="sm"
              @click="minusHandler(i)"
              ><font-awesome-icon icon="minus"></font-awesome-icon
            ></b-button>
          </b-col>
          <b-col cols="2" class="my-2 text-right">
            <b-button
              v-if="totlePrice(i, item.price) == 0"
              size="sm"
              class="text-right"
              pill
              variant="outline-danger"
              @click="removeHandler(i)"
              >移除</b-button
            >
            <span v-else class="ml-4 text-right"
              >${{ totlePrice(i, item.price) }}
            </span>
          </b-col>
          <b-col cols="2" class="my-2 text-right">
            <b-button size="sm" variant="light" @click="removeHandler(i)">
              <font-awesome-icon
                class="text-warning"
                icon="trash"
              ></font-awesome-icon
            ></b-button>
          </b-col>
        </b-row>
      </b-container>
      <template #modal-footer>
        <div class="w-100">
          <span class="mt-1 float-right">總金額：${{ orderPrice }}</span>
          <b-button
            class="ml-1 float-left"
            variant="outline-secondary"
            @click="showCart = false"
            >返回</b-button
          >
          <b-button
            class="ml-3 float-left"
            variant="outline-success"
            @click="checkoutHandler"
            >結帳</b-button
          >
        </div>
      </template>
    </b-modal>
    <div id="nav">
      <router-view />
    </div>
    <!-- <sock></sock> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
// import sock from "@/components/socks";
import orderService from "@/apis/carts/order";
export default {
  data() {
    return {
      showCart: false,
    };
  },
  methods: {
    logout() {
      // 登出清除store.localStorage.sessionStorage
      this.$store.dispatch("resetState");
      localStorage.clear();
      sessionStorage.clear();
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
    totlePrice(i, price) {
      return this.itemAmount[i] * price;
    },
    minusHandler(i) {
      // 使用$set監聽物件才會重新渲染畫面
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
      // 將cookies存入
      this.$cookies.set("cart", JSON.stringify(req));
    },
    removeHandler(i) {
      this.cart.splice(i, 1);
      this.itemAmount.splice(i, 1);
    },
    checkoutHandler() {
      const items = [];
      this.cart.forEach((obj) => {
        items.push({
          id: obj.id,
          name: obj.name,
          brand: obj.brand.name,
          amount: 0,
        });
      });
      this.itemAmount.forEach((obj, i) => {
        items[i].amount = obj;
      });
      const req = {
        username: this.username,
        items: items,
        totalPrice: this.orderPrice,
      };
      orderService
        .createOrder(req)
        .then((res) => {
          console.log("order checkout:");
          console.log(res);
          // 訂單成立Push新訂單到$store
          this.$store.dispatch("addOrder", res.data);
        })
        .then(() => {
          // 新訂單狀態
          this.$store.dispatch("statusOrder", true);
          this.showCart = false;
          this.$store.dispatch("initCart", []);
          this.$router.push("/order");
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
    orderPrice() {
      let totalPrice = 0;
      this.cart.forEach((c, i) => {
        totalPrice += c.price * this.itemAmount[i];
      });
      return totalPrice;
    },
    ...mapState(["username", "role", "cart", "itemAmount", "cartId"]),
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
  // components: {
  //   sock,
  // },
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
