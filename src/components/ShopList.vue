<template class="container">
  <div>
    <b-container class="my-5">
      <b-row cols="8" class="justify-content-md-center">
        <b-col>
          <b-form-select
            @change="queryHandler"
            size="sm"
            v-model="selectBrand"
            :options="optionBrand"
          >
          </b-form-select>
        </b-col>
        <b-col>
          <b-input
            size="sm"
            v-model="inputQuery"
            @keyup="queryHandler"
            placeholder="請輸入品牌或型號"
          >
          </b-input>
        </b-col>
        <b-button
          v-if="inputQuery !== ''"
          @click="resetQuery"
          size="sm"
          variant="light"
          ><font-awesome-icon
            class="text-secondary"
            icon="times-circle"
          ></font-awesome-icon
        ></b-button>
      </b-row>
    </b-container>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="list"
      @change="onPagination"
      align="center"
      first-text="⏮"
      prev-text="⏪"
      next-text="⏩"
      last-text="⏭"
    >
    </b-pagination>
    <b-row>
      <b-col
        id="list"
        cols="12"
        sm="4"
        class="my-1"
        v-for="(pro, i) in paginateItem"
        :key="i"
      >
        <b-card
          :img-src="require('../assets/brand' + pro.brandid + '.png')"
          img-top
          img-height="300"
          :title="pro.brand.name"
          :sub-title="pro.name"
          class="m-5"
        >
          <small class="my-2 btn btn-sm btn-light float-left text-warning"
            >${{ pro.price }}</small
          >
          <b-button
            class="my-2 float-right"
            pill
            size="sm"
            variant="outline-info"
            @click="cartHandler(pro)"
          >
            加入購物車
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import product from "@/apis/products/product";
export default {
  data() {
    return {
      inputQuery: "",
      // 商品
      product: [],
      // 分頁商品
      paginateItem: [],

      // cartItems: [],
      perPage: 3,
      currentPage: 1,
      rows: 1,
      selectBrand: null,
      optionBrand: [{ value: null, text: "品牌" }],
      selectModel: null,
      optionModel: [{ value: null, text: "型號" }],
    };
  },
  created() {
    this.initProduct();
  },

  methods: {
    resetQuery() {
      this.inputQuery = "";
      this.selectBrand = null;
      this.queryHandler();
    },
    initProduct() {
      // 取得資料庫商品

      product
        .getAllGracard()
        .then((res) => {
          this.product = res.data;
          this.rows = this.product.length;
          this.$store.dispatch("initProduct", res.data);
        })
        .then(() => {
          this.paginate(this.perPage, 0);
        });
      product.getAllBrand().then((res) => {
        const brands = res.data;
        this.optionBrand.push("全部");
        brands.forEach((brand) => {
          this.optionBrand.push(brand.name);
        });
      });
    },
    paginate(perPage, currentPage) {
      this.paginateItem = this.product.slice(
        perPage * currentPage,
        perPage * (currentPage + 1)
      );
    },
    onPagination(page) {
      this.paginate(this.perPage, page - 1);
    },
    queryHandler() {
      // 每次執行查詢先回到初始product值才不會重複查詢
      this.product = this.defaultProduct;
      this.currentPage = 1;

      // 如果有輸入查詢字串
      if (this.inputQuery !== "") {
        // 如果有選擇品牌的交叉查詢
        if (!(this.selectBrand == null || this.selectBrand == "全部")) {
          this.product = this.product.filter(
            (val) =>
              val.brand.name == this.selectBrand &&
              val.name.toLowerCase().includes(this.inputQuery.toLowerCase())
          );
        } else {
          // 無選擇品牌，直接查詢
          this.product = this.product.filter(
            (val) =>
              val.brand.name
                .toLowerCase()
                .includes(this.inputQuery.toLowerCase().trim()) ||
              val.name
                .toLowerCase()
                .includes(this.inputQuery.toLowerCase().trim()) ||
              (val.brand.name + val.name)
                .toLowerCase()
                .trim()
                .includes(this.inputQuery.toLowerCase().trim())
          );
        }
      } else {
        // 只選擇品牌查詢
        if (!(this.selectBrand == null || this.selectBrand == "全部")) {
          this.product = this.product.filter(
            (val) => val.brand.name == this.selectBrand
          );
        }
      }
      // 查詢完重新計算分頁
      this.rows = this.product.length;
      this.paginate(this.perPage, 0);
    },
    checkLogin() {
      if (!this.isLogin) {
        Promise.resolve(
          setTimeout(() => {
            alert("請先登入！");
          }, 0)
        ).then(() => {
          setTimeout(() => {
            this.$router.push("/login");
          }, 1000);
        });
      }
    },
    cartHandler(product) {
      // 加入購物車時判斷是否登入
      this.checkLogin();
      // 如果cart不是空的
      if (!this.state.cart.length == 0) {
        // 複製一份新的cart
        Array.from(this.state.cart).forEach((obj, i, arr) => {
          if (
            // 如果購物車內已有同商品
            obj.name == product.name &&
            obj.brand.name == product.brand.name
          ) {
            // 則將數量+1
            this.state.itemAmount[this.state.cart.indexOf(obj)] += 1;
            // 作用等同於break
            arr.splice(i, arr.length - i);
          } else {
            // 判斷迴圈最後一個元素
            if (i == arr.length - 1) {
              // this.cartItems.push(product);
              this.$store.dispatch("addCart", product);
              this.$store.dispatch("addItemAmount", 1);
              // 作用等同於break
              arr.splice(i, arr.length - i);
            }
          }
        });
      } else {
        // 如果是空的直接加進去
        this.$store.dispatch("addCart", product);
        this.$store.dispatch("initItemAmount", [1]);
      }
    },
  },
  computed: {
    state() {
      return this.$store.state;
    },
    // 原始的商品
    defaultProduct() {
      return this.$store.state.product;
    },
    isLogin() {
      return this.$store.state.token ? true : false;
    },
  },
};
</script>

<style>
</style>