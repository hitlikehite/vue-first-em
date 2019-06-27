<template>
  <el-row>
    <el-col>
      <div class="grid-content bg-purple">江苏传智播客教育科技股份有限公司</div>
    </el-col>
    <el-col class="gridright">
        <img :src="userInfo.photo" alt="">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">个人信息</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">git地址</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus-outline">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  }
}
</script>

<style lang="less" scoped>
.el-row {
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  .gridright {
    text-align: right;
    img {
      width: 40px;
      height: 40px;
      vertical-align:middle;
    }
  }
}
</style>
