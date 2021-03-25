<template class="container">
  <div>
    <b-container class="my-5">
      <b-row cols="8" class="justify-content-md-center">
        <b-col>
          <b-form-select
            @change="brandOnChange"
            size="sm"
            v-model="selectBrand"
            :options="optionBrand"
          >
          </b-form-select>
        </b-col>
        <!-- <b-col>
          <b-form-select v-model="selectModel" :options="optionModel">
          </b-form-select>
        </b-col> -->
        <b-col>
          <b-input size="sm" placeholder="請輸入品牌或型號">查詢</b-input>
        </b-col>
        <b-button size="sm" variant="outline-success">查詢</b-button>
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
          :title="pro.brand.name"
          :sub-title="pro.name"
          class="m-5"
        >
          <b-card-text>
            {{ pro.description }}
          </b-card-text>
          <b-button variant="outline-info" @click="cartHandler(pro)">
            加入購物車
          </b-button>
        </b-card>
      </b-col>
    </b-row>
    <!-- </div> -->
  </div>
</template>

<script>
import product from "@/apis/products/product";
export default {
  data() {
    return {
      product: [],
      paginateItem: [],
      cartItems: [],
      perPage: 6,
      currentPage: 1,
      rows: 1,
      selectBrand: null,
      optionBrand: [{ value: null, text: "品牌" }],
      selectModel: null,
      optionModel: [{ value: null, text: "型號" }],
    };
  },
  created() {
    product
      .getAllGracard()
      .then((res) => {
        this.product = res.data;
        this.rows = this.product.length;
      })
      .then(() => {
        this.paginate(this.perPage, 0);
      });
    product.getAllBrand().then((res) => {
      const brands = res.data;
      brands.forEach((brand) => {
        this.optionBrand.push(brand.name);
      });
    });
  },

  methods: {
    paginate(perPage, currentPage) {
      this.paginateItem = this.product.slice(
        perPage * currentPage,
        perPage * (currentPage + 1)
      );
    },
    onPagination(page) {
      this.paginate(this.perPage, page - 1);
    },
    brandOnChange() {
      const query = this.selectBrand;
      this.paginateItem = this.product.filter((val) => val.brand.name == query);
      this.rows = this.paginateItem.length;
    },
    cartHandler(product) {
      // const state = this.$store.state;

      Array.from(this.state.cart).forEach((obj, i, arr) => {
        if (obj.name == product.name && obj.brand.name == product.brand.name) {
          this.state.itemAmount[this.state.cart.indexOf(obj)] += 1;
          arr.splice(i, arr.length - i);
        } else {
          this.cartItems.push(product);
          this.$store.dispatch("addCart", product);
          this.$store.dispatch("addItemAmount", 1);
          arr.splice(i, arr.length - i);
        }
      });
      // state.cart.filter((obj) => {
      //   if (obj.name == product.name && obj.brand.name == product.brand.name) {
      //     console.log(state.itemAmount[state.cart.indexOf(obj)]);
      //     state.itemAmount[state.cart.indexOf(obj)] += 1;
      //   } else {
      //     query = true;
      //     // this.cartItems.push(product);
      //     // this.$store.dispatch("addCart", product);
      //     // this.$store.dispatch("addItemAmount", 1);
      //   }
      // });
      // if (query) {
      //   console.log(state.cart);
      //   this.cartItems.push(product);
      //   this.$store.dispatch("addCart", product);
      //   this.$store.dispatch("addItemAmount", 1);
      // }
      // this.$store.dispatch('addCart',this.cartItems)
    },
  },
  computed: {
    state() {
      return this.$store.state;
    },
  },
};
</script>

<style>
</style>