<template>
  <section class="page">
    <p v-if="message" class="status-message">{{ message }}</p>
    <p v-if="auth.state.error" class="error-message">{{ auth.state.error }}</p>

    <div class="auth-layout wide-auth">
      <form v-if="authMode === 'login'" class="panel auth-panel" @submit.prevent="handleLogin">
        <div class="panel-header">
          <h2>账号登录</h2>
        </div>
        <label>
          <span>账号 / 邮箱</span>
          <input v-model="loginIdentifier" type="text" placeholder="账号名或 name@example.com" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="loginPassword" type="password" placeholder="输入密码" />
        </label>
        <button type="submit" :disabled="auth.state.loading">{{ auth.state.loading ? '处理中…' : '继续登录' }}</button>

        <div class="switch-line">
          <span>还没有账号？</span>
          <button class="link-button" type="button" @click="switchToRegister">创建账号</button>
        </div>
      </form>

      <form v-else class="panel auth-panel" @submit.prevent="handleRegister">
        <div class="panel-header">
          <h2>填写注册信息</h2>
        </div>
        <label>
          <span>账号</span>
          <input v-model="registerUsername" type="text" placeholder="3-32 位字母、数字、下划线或短横线" />
        </label>
        <label>
          <span>昵称</span>
          <input v-model="registerNickname" type="text" placeholder="你的称呼" />
        </label>
        <label>
          <span>邮箱</span>
          <input v-model="registerEmail" type="email" placeholder="name@example.com" />
        </label>
        <label>
          <span>设置密码</span>
          <input v-model="registerPassword" type="password" placeholder="至少 6 位密码" />
        </label>
        <label>
          <span>确认密码</span>
          <input v-model="confirmPassword" type="password" placeholder="再次输入密码" />
        </label>
        <button type="submit" :disabled="auth.state.loading">{{ auth.state.loading ? '处理中…' : '创建账号' }}</button>

        <div class="switch-line">
          <span>已经有账号？</span>
          <button class="link-button" type="button" @click="switchToLogin">返回登录</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useAuth } from '../services/auth'

const auth = useAuth()

const authMode = ref<'login' | 'register'>('login')
const loginIdentifier = ref('')
const loginPassword = ref('')
const registerUsername = ref('')
const registerNickname = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const confirmPassword = ref('')
const message = ref('')

onMounted(() => {
  void auth.loadMe()
})

const handleLogin = async () => {
  message.value = ''
  await auth.login(loginIdentifier.value, loginPassword.value)
  message.value = '登录成功，管理中心已可读取真实后端数据。'
}

const switchToRegister = () => {
  message.value = ''
  auth.state.error = ''
  authMode.value = 'register'
}

const switchToLogin = () => {
  message.value = ''
  auth.state.error = ''
  authMode.value = 'login'
}

const handleRegister = async () => {
  message.value = ''
  if (registerPassword.value !== confirmPassword.value) {
    message.value = '两次输入的密码不一致。'
    return
  }

  await auth.register(registerUsername.value, registerEmail.value, registerPassword.value, registerNickname.value)
  message.value = '注册成功，已自动登录。'
  authMode.value = 'login'
}

</script>

<style scoped>
.page,
.auth-layout {
  display: grid;
  gap: 20px;
}

.page {
  align-content: center;
  min-height: calc(100vh - 160px);
}

.auth-layout {
  justify-items: stretch;
  max-width: 520px;
  width: min(520px, calc(100vw - 48px));
  margin: 0 auto;
}

.panel h2,
.panel label {
  margin: 0;
}


.panel {
  display: grid;
  gap: 18px;
  padding: 32px;
  border: 1px solid #d7d2c6;
  border-radius: 16px;
  background: rgba(255, 253, 248, 0.96);
}

.auth-panel {
  gap: 18px;
  width: 100%;
  min-width: 0;
}

.panel-header {
  display: grid;
  gap: 0;
}


.status-message,
.error-message {
  margin: 0;
  padding: 12px 14px;
  border-radius: 16px;
  background: #f5fbf8;
  color: #1b6a52;
  font-weight: 700;
}

.error-message {
  background: #fff2dc;
  color: #7b4a17;
}

label {
  display: grid;
  gap: 8px;
}

input,
button {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #ffffff;
  color: #1f251f;
  padding: 12px 14px;
  font: inherit;
}

.link-button {
  background: #ffffff;
  color: #1f251f;
}

button {
  background: #1b6a52;
  border-color: #1b6a52;
  color: #ffffff;
}

button:disabled {
  opacity: 0.68;
}

.switch-line {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #61685f;
}

.link-button {
  border: 0;
  padding: 0;
  color: #1b6a52;
  font-weight: 700;
}

@media (max-width: 960px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }
}
</style>
