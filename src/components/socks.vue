<template>
  <div>socks is loading ...</div>
</template>

<script>
import { MQ_SERVICE, MQ_USERNAME, MQ_PASSWORD } from "@/apis/stomps";
import Stomp from "stompjs";
export default {
  name: "sock",
  data() {
    return {
      client: Stomp.client(MQ_SERVICE),
    };
  },
  methods: {
    onConnected(frame) {
      console.log("Connected: " + frame);
      const queue = "active.queue";
      this.client.subscribe(queue, this.responseCallback, this.onFailed);

      const topic = "active.topic.name.model";
      this.client.subscribe(topic, this.responseCallback, this.onFailed);
    },
    onFailed(frame) {
      console.log("Failed: " + frame);
    },
    responseCallback(frame) {
      console.log("responseCallback msg=>" + frame.body);
      console.log("------");
    },
    connect() {
      const headers = {
        login: MQ_USERNAME,
        passcode: MQ_PASSWORD,
      };
      this.client.connect(headers, this.onConnected, this.onFailed);
    },
  },
  created() {
    this.connect();
  },
};
</script>

<style>
</style>