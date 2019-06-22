<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  },
  mounteds: {
  }
}
</script>

<style lang="less" scoped>
  #app {
    height: 100%;
  }
</style>
