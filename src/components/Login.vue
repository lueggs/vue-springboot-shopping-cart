<template class="container">
  <b-form class="rounded w-25 m-auto border border-info">
    <p class="h4 text-center mb-4 my-3">登入頁面</p>
    <div class="grey-text">
      <b-form-input
        v-model.trim="loginInput.username"
        class="w-75 m-auto"
        placeholder="Email"
        type="email"
      />
      <br />
      <b-form-input
        class="w-75 m-auto"
        placeholder="Password"
        type="password"
        v-model.trim="loginInput.password"
      />
    </div>
    <div class="text-center my-4">
      <b-button variant="outline-primary" @click="login">登入</b-button>
      <b-button class="mx-2" variant="outline-success" @click="userLogin"
        >使用者</b-button
      >
      <b-button variant="outline-warning" @click="mgrLogin">管理者</b-button>
    </div>
  </b-form>
</template>

<script>
import req from "@/apis/https";
import product from "@/apis/products/product";
import orderService from "@/apis/carts/order";

const LOGIN_API_URL = "signin";

export default {
  data() {
    return {
      loginInput: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    initWebSockets(username) {
      const webSocket = new WebSocket(
        `ws://localhost:9090/websocket/${username}`
      );
      webSocket.onopen = () => {
        console.log("websocket connected");
      };
      webSocket.onmessage = (res) => {
        console.log(res.data);
        this.$emit("msg" + res.data);
      };
    },
    getCart() {
      Promise.resolve(this.$cookies.get("cart"))
        .then(
          (res) => {
            this.cartId = res.id;
            this.$store.dispatch("initCart", res.graId);
            this.$store.dispatch("initItemAmount", res.graAmount);
          },
          (err) => {
            console.log(err);
          }
        )
        .then(() => {
          const cart = this.$store.state.cart;
          const length = cart.length;

          cart.forEach((item) => {
            product.getOneGracard(item).then((res) => {
              cart.push(res.data);
            });
          });
          cart.splice(0, length);
          this.$store.dispatch("initCart", cart);
        });
    },
    getOrder() {
      orderService
        .getOrdersByUserName(this.$store.state.username)
        .then((res) => {
          this.$store.dispatch("setOrder", res.data);
        });
    },
    login() {
      req("post", LOGIN_API_URL, this.loginInput).then((res) => {
        this.$store.dispatch("setAuth", res.data);
      });
    },
    userLogin() {
      req("post", LOGIN_API_URL, { username: "aaa@gmail.com", password: "aaa" })
        .then(
          (res) => {
            this.$store.dispatch("setAuth", res.data);
            location.reload;
          },
          (err) => {
            alert(err);
          }
        )
        .then(() => {
          this.$router.push("/");
        })
        .then(() => {
          this.initWebSockets("aaa@gmail.com");
          // 登入後取得使用者購物車內容
          this.getCart();
          // 取得訂單內容
          this.getOrder();
        });
    },
    mgrLogin() {
      req("post", LOGIN_API_URL, { username: "bbb@gmail.com", password: "bbb" })
        .then((res) => {
          this.$store.dispatch("setAuth", res.data);
          location.reload;
        })
        .then(() => {
          this.$router.push("/");
        });
    },
    logout() {
      // 登出清除store.localStorage.sessionStorage
      this.$store.dispatch("resetState");
      localStorage.clear();
      sessionStorage.clear();
    },
  },
};
</script>

<style>
</style>