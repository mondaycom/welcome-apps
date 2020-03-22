<template>
  <div id="app">
    <div>Hello {{ user.name }}</div>
    <div>Your context: {{ JSON.stringify(context) }}</div>
    <div>Your settings: {{ JSON.stringify(settings) }}</div>
  </div>
</template>

<script>
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export default {
  name: "app",
  data() {
    return {
      settings: "",
      context: "",
      user: ""
    };
  },

  created() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
    this.fetchUserName();
  },

  methods: {
    beforeCreate() {
      this.fetchUserName();
    },

    getSettings: function(res) {
      this.$set(this, "settings", res.data);
    },

    getContext: function(res) {
      this.$set(this, "context", res.data);
    },

    fetchUserName: function() {
      monday.api(`query { me { name } }`).then(res => {
        this.$set(this, "user", res.data.me);
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  text-align: center;
  margin-top: 60px;
}
</style>
