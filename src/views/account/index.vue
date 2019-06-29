<template>
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>账户设置</span>
  </div>
<div>
    <el-col :span="10">
      <el-form :model="form" ref="ruleForm">
          <el-form-item prop="name" label="媒体名称">
            <el-input v-model="form.name" placeholder="媒体名称"></el-input>
          </el-form-item>
          <el-form-item prop="intro" label="媒体介绍">
              <el-input v-model="form.intro" placeholder="媒体介绍"></el-input>
          </el-form-item>
          <el-form-item prop="id" label="头条号ID">
            <el-input :value="form.id+''" placeholder="头条号ID" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="绑定手机">
            <el-input :value="form.mobile" placeholder="绑定手机" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="form.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加 class，会作用到它的根元素 -->
            <el-button class="btn-login" type="primary" @click="sendaccount" >保存更新</el-button>
          </el-form-item>
        </el-form>
    </el-col>
    <el-col :span="4" :offset="2">
      <!-- <el-upload
        class="avatar-uploader"
        action="/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :http-request="handsend"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload> -->
      <el-upload
  class="avatar-uploader"
  action="/"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :http-request="handsend"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
    </el-col>
  </div>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        mobile: '',
        email: '',
        intro: '',
        id: ''
      },
      imageUrl: ''
    }
  },
  created () {
    this.catchuserdata()
  },
  methods: {
    sendaccount () {
      this.$http({
        method: 'PATCH',
        url: '/user/profile',
        data: this.form
      }).then(data => {
        // console.log(data)
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('修改失败')
      })
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handsend (a) {
      // console.log(a)
      const formData = new FormData()
      formData.append('photo', a.file)
      this.$http({
        method: 'PATCH',
        url: '/user/photo',
        data: formData
      }).then(data => {
        this.imageUrl = data.photo
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('上传失败')
      })
    },
    catchuserdata () {
      this.$http({
        method: 'GET',
        url: '/user/profile'
      }).then(data => {
        this.form = data
        this.imageUrl = data.photo
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
