<template class="container">
  <b-form class="card w-25 m-auto border border-info">
    <p class="h4 text-center mb-4 my-3">Sign in</p>
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
      <b-button variant="outline-primary" @click="login">Login</b-button>
      <b-button class="mx-2" variant="outline-success" @click="userLogin"
        >userLogin</b-button
      >
      <b-button variant="outline-warning" @click="mgrLogin">mgrLogin</b-button>
    </div>
  </b-form>
</template>

<script>
import req from "@/apis/https";
import cartService from "@/apis/carts/cart";
import product from "@/apis/products/product";

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
    getCart() {
      // const username = this.$store.state.username;
      // cartService
      //   .getCartByUserName(username)
      
      // console.log(JSON.parse(this.$cookies.get('cart')))
      const resolve =Promise.resolve(this.$cookies.get('cart'))
        .then(
          (res) => {
            console.log(res)
            this.cartId = res.id;
            const data = [];
            data.push(res);
            // this.$store.dispatch("resetCart");
            // data.forEach((obj) => {
            //   // console.log(obj)
            //   if (!obj.graId.length == 0) {
            //     this.$store.dispatch("initCart", obj.graId);
            //   }
            // });
            this.$store.dispatch("initCart", res.graId);
            this.$store.dispatch("initItemAmount", res.graAmount);
            this.$store.dispatch("setCartId", res.id);
          },
          (err) => {
            console.log(err);
          }
        )
        .then(() => {
          const cart = this.$store.state.cart;
          console.log(cart);
          const length = cart.length;

          cart.forEach((item) => {
            product.getOneGracard(item).then((res) => {
              cart.push(res.data);
            });
          });
          cart.splice(0, length);
          this.$store.dispatch("initCart", cart);
          // console.log("cart")
          // console.log(cart)
          // this.cart = this.$store.state.cart;
          // console.log(this.cart)
        });
    },
    login() {
      req("post", LOGIN_API_URL, this.loginInput).then((res) => {
        this.$store.dispatch("setAuth", res.data);
      });
    },
    userLogin() {
      req("post", LOGIN_API_URL, { username: "aaa@gmail.com", password: "aaa" })
        .then((res) => {
          this.$store.dispatch("setAuth", res.data);
          location.reload;
        })
        .then(() => {
          this.$router.push("/");
        })
        .then(() => {
          this.getCart();
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
      this.$store.dispatch("resetState");
      localStorage.clear();
      sessionStorage.clear();
    },
  },
};
</script>

<style>
</style>