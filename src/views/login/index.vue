<template>
  <div class="login-warp">
    <van-nav-bar
      title="登录"
    />
    <form >
      <van-cell-group>
        <van-field
          v-model="userForm.mobile"
          required
          clearable
          label-width="60"
          :error-message="verification"
          label="手机号"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="userForm.code"
          type="password"
          label-width="60"
          :error-message="messageCode"
          label="验证码"
          placeholder="请输入验证码"
          required
        >
          <van-button slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
      </van-cell-group>
      <div class="loginBtn">
        <van-button type="info" size="large" @click.prevent="handelLogin">主要按钮</van-button>
      </div>
    </form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'AppLogin',
  data () {
    return {
      userForm: {
        mobile: '',
        code: ''
      },
      verification: '',
      messageCode: ''
    }
  },
  methods: {
    async handelLogin () {
      try {
        if (!(/^1[3456789]\d{9}$/.test(this.userForm.mobile))) {
          this.verification = '手机号码有误，请重填'
          return
        } else {
          this.verification = ''
        }
        if (!this.userForm.code) {
          this.messageCode = '验证码不能为空'
          return
        } else {
          this.verification = ''
        }
        const data = await login(this.userForm)
        this.$store.commit('setUser', data)
        this.$router.push({ name: 'home' })
      } catch (error) {
        this.$toast.fail('登录失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #3296fa;
  .van-nav-bar__title {
    color: #fff;
  }
}
form {
  margin-top: 15px;
}
.van-button--primary {
  background-color: #ededed;
  border: 1px solid #ededed;
  color: #666;
  border-radius: 50px
}
.loginBtn {
  margin: 53px 32px;
  .van-button--large {
    border-radius: 15px;
  }
  .van-button--info {
    background-color:#6db4fb;
    border: 1px solid #6db4fb;
  }
}
</style>
