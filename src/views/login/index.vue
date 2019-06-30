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
              <el-button @click="handleClickCode" :disabled="clickcode||loadCode"> <span v-if ="timeend === 60">点击获取验证码</span><span v-else> {{timeend}}秒后重新发送</span> </el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></el-checkbox>
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
        code: '',
        agree: ''
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
        ],
        agree: [
          { required: true, message: '未同意协议', trigger: 'change' },
          { pattern: /true/, message: '未同意协议', trigger: 'change' }
        ]
      },
      loginLoading: false, // 登录按钮的 loading 状态
      loadCode: false,
      oldMobil: ''
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
        url: '/authorizations',
        data: this.form
      }).then(data => { // >= 200 && < 400 的状态码都会进入这里
        // Element 提供的 Message 消息提示组件，这也是组件调用的一种形式
        window.localStorage.setItem('user_info', JSON.stringify(data))
        this.$store.commit('storageLogin', data)
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
        } else if (err.response.status === 403) {
          this.$message.error('登录失败，手机号未注册')
        }
      })
    },

    handleClickCode () {
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        if (this.captchaObj) {
          if (this.form.mobile !== this.oldMobil) {
            document.body.removeChild(document.querySelector('.geetest_panel'))
            // 重新初始化
            this.handleSendCode()
          } else {
            // 一致，直接 verify
            this.captchaObj.verify()
          }
        } else {
          this.handleSendCode()
        }
      })
    },

    handleSendCode () {
      this.loadCode = true
      axios({
        method: 'GET',
        url: `/captchas/${this.form.mobile}`
      }).then(data => {
        window.initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          // offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏，直接弹出式
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(() => {
            // 只有 ready 了才能显示验证码
            this.oldMobil = this.form.mobile
            this.loadCode = false
            captchaObj.verify()
          }).onSuccess(() => {
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
            captchaObj.getValidate()

            // 调用 获取短信验证码 (极验 API2）接口，发送短信
            axios({
              method: 'GET',
              url: `/sms/codes/${this.form.mobile}`,
              params: { // 专门用来传递 query 查询字符串参数
                challenge,
                seccode,
                validate
              }
            }).then(res => {
              this.clickcode = true
              let flag = window.setInterval(() => {
                this.timeend--
                if (this.timeend <= 0) {
                  this.timeend = 60
                  this.clickcode = false
                  window.clearInterval(flag)
                }
              }, 1000)
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
  background: url('./login_bg.jpg');
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
