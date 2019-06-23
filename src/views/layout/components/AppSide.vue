<template>
  <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
    background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
    <el-menu-item index="/">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>内容管理</span>
      </template>
      <el-menu-item index="/publish">发布文章</el-menu-item>
      <el-menu-item index="2-2">内容列表</el-menu-item>
      <el-menu-item index="2-3">评论列表</el-menu-item>
      <el-menu-item index="2-4">素材管理</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>粉丝管理</span>
      </template>
      <el-menu-item index="3-1">图文数据</el-menu-item>
      <el-menu-item index="3-2">粉丝概况</el-menu-item>
      <el-menu-item index="3-3">粉丝画像</el-menu-item>
      <el-menu-item index="3-4">粉丝列表</el-menu-item>
    </el-submenu>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <span slot="title">导航四</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  height: 100%;
}
</style>
