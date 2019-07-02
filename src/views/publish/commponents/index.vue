<template>
  <div>
    <div class="imgupb" @click="handleadd">
      <p>点击添加图片</p>
      <i class="el-icon-picture-outline fontsi" v-if="!value"></i>
      <img :src="value" v-else width="100%" height="160px" >
    </div>
    <el-dialog :visible.sync="dialogTableVisible">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="素材库" name="first">文件1</el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-upload class="avatar-uploader" action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="{ Authorization: `Bearer ${$store.state.userInfo.token}` }" name="image"
            :on-success="handleAvatarSuccess" :show-file-list="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'uploadImg',
  props: ['value'],
  data () {
    return {
      dialogTableVisible: false,
      activeName: 'second',
      imageUrl: ''
    }
  },
  methods: {
    handleadd () {
      this.dialogTableVisible = true
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = res.data.url
    },
    handleOk () {
      this.$emit('input', this.imageUrl)
      this.dialogTableVisible = false
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style lang="less" scoped>
.imgupb {
  width: 200px;
  height: 200px;
  border: 1px solid #666;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fontsi {
  font-size: 50px;
}
</style>
