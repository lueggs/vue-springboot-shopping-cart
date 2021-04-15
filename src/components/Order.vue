<template>
  <b-container>
    <b-jumbotron
      v-if="status"
      header="您的訂單"
      lead="訂單成立！感謝您的訂購"
      text-variant=""
      ><b-table
        table-class="mt-5 rounded"
        :items="newOrder"
        :fields="fields"
        foot-row-variant="light"
        head-row-variant="light"
        selected-variant="active"
        tbody-tr-class="bg-light my-4 border border-top-0 border-right-0 border-left-0"
        thead-tr-class="border-0"
      >
        <template #cell(items)="data">
          <div v-if="data.item.items.length == 1">
            {{ orderName(data.item.items) }}
          </div>
          <div v-else v-for="(item, i) in orderName(data.item.items)" :key="i">
            {{ item }}
          </div>
        </template>
        <template #cell(itemsAmount)="data">
          <div v-if="data.item.items.length == 1">
            {{ amount(data.item.items) }}
          </div>
          <div v-else v-for="(item, i) in amount(data.item.items)" :key="i">
            {{ item }}
          </div>
        </template>
      </b-table>
      <b-button @click="allOrders" class="mt-3" variant="info"
        >查看所有訂單</b-button
      >
    </b-jumbotron>
    <b-jumbotron v-else header="我的訂單" text-variant="">
      <b-table
        table-class="mt-5 rounded"
        :items="orders"
        :fields="fields"
        foot-row-variant="light"
        head-row-variant="light"
        selected-variant="active"
        tbody-tr-class="bg-light my-4 border border-top-0 border-right-0 border-left-0"
        thead-tr-class="border-0"
      >
        <template #cell(items)="data">
          <div v-if="data.item.items.length == 1">
            {{ orderName(data.item.items) }}
          </div>
          <div v-else v-for="(item, i) in orderName(data.item.items)" :key="i">
            {{ item }}
          </div>
        </template>
        <template #cell(itemsAmount)="data">
          <div v-if="data.item.items.length == 1">
            {{ amount(data.item.items) }}
          </div>
          <div v-else v-for="(item, i) in amount(data.item.items)" :key="i">
            {{ item }}
          </div>
        </template>
      </b-table>
    </b-jumbotron>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        { key: "id", label: "訂單編號" },
        { key: "items", label: "訂單商品" },
        { key: "itemsAmount", label: "商品數量" },
        { key: "totalPrice", label: "總金額" },
        { key: "createTime", label: "訂單時間" },
      ],
    };
  },
  computed: {
    orders() {
      return this.$store.state.order;
    },
    status() {
      
      return this.$store.state.newOrder;
    },
  },
  methods: {
    allOrders() {
      this.$store.dispatch("statusOrder", false);
    },
    newOrder() {
      // 新訂單成立跳轉本頁先只顯示該筆訂單
      const length = this.orders.length - 1;
      return new Array(this.orders[length]);
    },
    orderName(data) {
      // 處理訂單項目名稱 品牌+品項名
      if (data.length == 1) {
        return data[0].brand + " " + data[0].name;
      } else {
        const fullname = [];
        data.forEach((e) => {
          fullname.push(e.brand + " " + e.name);
        });
        return fullname;
      }
    },
    amount(data) {
      // 訂單數量
      if (data.length == 1) {
        return data[0].amount;
      } else {
        const amount = [];
        data.forEach((e) => {
          amount.push(e.amount);
        });
        return amount;
      }
    },
  },
};
</script>

<style>
</style>