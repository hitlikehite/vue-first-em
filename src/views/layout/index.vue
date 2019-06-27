<template>
  <el-container>
    <el-aside width="200px">
      <AppAside></AppAside>
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader/>
      </el-header>
      <el-main>
        <!-- 路由出口 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/AppSide'
import AppHeader from './components/AppHeader'
export default {
  data () {
    return {
    }
  },
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="less" scoped>
#app {
  height: 100%;
  display: flex;
  .el-container {
    background-color: #999;
    height: 100%;
    .el-aside {
      height: 100%;
    }
    .el-header {
      background-color: #FFF;
    }
  }
}
</style>
