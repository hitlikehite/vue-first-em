<template>
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>图片管理</span>
  </div>
  <div>
    <div class="imagecontrol">
    <el-radio-group v-model="radio1">
      <el-radio-button label="false" @click.native="catchImage(false)">全部</el-radio-button>
      <el-radio-button label="true" @click.native="catchImage(true)">收藏</el-radio-button>
    </el-radio-group>
    <el-upload
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="{ Authorization: `Bearer ${$store.state.userInfo.token}` }"
        name="image"
        :show-file-list="false"
        :on-progress="sendchange"
        :on-error="errorchange"
        :on-success="handleChange">
        <el-button type="primary" :disabled="isloading">{{isloading?"图片正在上传":"点击上传图片"}}</el-button>
      </el-upload>
    </div>
    <el-row :gutter="20">
      <el-col :span="5" v-for="item in data.results" :key="item.id" class="image">
        <img :src="item.url" width="100%" height="150px">
        <div class="iconicon">
          <i :class="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" @click="stateChange(item.id, item)">
          </i><i class="el-icon-delete" @click="delectImage(item.id)"></i></div>
      </el-col>
    </el-row>
  </div>
  <el-pagination
    background
    layout="prev, pager, next"
    @current-change="changePage"
    :current-page="page"
    :page-size="per_page"
    :total="data.total_count">
  </el-pagination>
</el-card>
</template>

<script>
export default {
  name: 'imageHave',
  data () {
    return {
      radio1: 'false',
      data: [],
      fileList: [],
      isloading: false,
      page: 1,
      per_page: 10
    }
  },
  created () {
    this.catchImage(false)
  },
  methods: {
    sendchange () {
      this.isloading = true
    },
    handleChange () {
      this.$message({
        type: 'success',
        message: '图片上传成功'
      })
      this.isloading = false
      this.catchImage(this.radio1)
    },
    errorchange () {
      this.message.error('图片过大请选择小图片')
    },
    // 加载图片
    catchImage (a = this.radio1, page = 1) {
      // if(page === 1){
      //   this.page = 1
      // }
      this.page = page
      this.$http({
        method: 'GET',
        url: '/user/images',
        params: {
          collect: a,
          page,
          per_page: 10
        }
      }).then(data => {
        this.data = data
        this.per_page = data.per_page
      })
    },
    // 点击更改状态
    stateChange (id, item) {
      this.$http({
        method: 'PUT',
        url: `/user/images/${id}`,
        data: { collect: !item.is_collected }
      }).then(data => {
        item.is_collected = data.collect
        // console.log(this.data.results.length)
        if (this.radio1 === 'true' && this.data.results.length === 1) {
          console.log(11111)
          this.catchImage(true, this.page - 1)
          return
        }
        this.catchImage(this.radio1, this.page)
      }).catch(err => {
        console.log(err)
      })
    },
    delectImage (id) {
      this.$http({
        method: 'DELETE',
        url: `/user/images/${id}`
      }).then(() => {
        this.catchImage()
      })
    },
    // 页码改变时加载
    changePage (page) {
      this.page = page
      this.catchImage(this.radio1, page)
    }
  }
}
</script>

<style lang="less" scoped>
  .imagecontrol {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .iconicon {
    text-align: center;
    font-size: 30px;
  }
  .el-icon-delete {
    margin-left: 40px;
  }
</style>
