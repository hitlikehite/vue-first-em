<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- 支持栅格布局，一共是24列 -->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="handleSendCode" :disabled="clickcode"> <span v-if ="timeend === 60">点击获取验证码</span><span v-else> {{timeend}}秒后重新发送</span> </el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加 class，会作用到它的根元素 -->
            <el-button class="btn-login" type="primary" @click="handleLogin" :loading="loginLoading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt.js'
export default {
  data () {
    return {
      clickcode: false,
      timeend: 60,
      form: {
        mobile: '15120013810',
        code: ''
      },
      captchaObj: null,
      rules: { // 表单验证规则
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度必须为11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度必须为6个字符', trigger: 'blur' }
        ]
      },
      loginLoading: false // 登录按钮的 loading 状态
    }
  },
  methods: {
    handleLogin () {
      // 表单组件有一个方法 validate 可以用于获取当前表单的验证状态
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录
        this.submitLogin()
      })
    },

    submitLogin () {
      this.loginLoading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => { // >= 200 && < 400 的状态码都会进入这里
        // Element 提供的 Message 消息提示组件，这也是组件调用的一种形式
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.loginLoading = false
        // 建议路由跳转都使用 name 去跳转，路由传参非常方便
        this.$router.push({
          name: 'home'
        })
      }).catch(err => { // >= 400 的 HTTP 状态码都会进入 catch 中
        if (err.response.status === 400) {
          this.$message.error('登录失败，手机号或验证码错误')
        }
        this.loginLoading = false
      })
    },
    handleSendCode () {
      let mobile = this.form.mobile
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        let data = res.data.data
        window.initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏，直接弹出式
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(function () {
            // 只有 ready 了才能显示验证码
            captchaObj.verify()
          }).onSuccess(() => {
            let flag = window.setInterval(() => {
              this.clickcode = true
              this.timeend--
              if (this.timeend <= 0) {
                this.timeend = 60
                this.clickcode = false
                window.clearInterval(flag)
              }
            }, 1000)
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
            captchaObj.getValidate()

            // 调用 获取短信验证码 (极验 API2）接口，发送短信
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: { // 专门用来传递 query 查询字符串参数
                challenge,
                seccode,
                validate
              }
            }).then(res => {
              console.log(res.data)
            })
          })
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .login-form-wrap {
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
