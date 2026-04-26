<template>
  <section class="page">
    <header class="page-header">
      <h1>登录与注册</h1>
      <p>MVP 支持邮箱 + 密码登录注册；第三方授权仅保留二期占位。</p>
    </header>

    <section class="notice-panel">
      <div>
        <strong>初始账号</strong>
        <p v-if="auth.state.user">当前已登录：{{ auth.state.user.nickname }}（{{ auth.state.user.email }}）</p>
        <p v-else>注册或登录后，管理中心会使用真实后端数据。</p>
      </div>
      <button v-if="auth.state.user" class="notice-tag button-tag" type="button" @click="handleLogout">退出登录</button>
      <span v-else class="notice-tag">Bearer Token</span>
    </section>

    <p v-if="message" class="status-message">{{ message }}</p>
    <p v-if="auth.state.error" class="error-message">{{ auth.state.error }}</p>

    <div class="auth-layout">
      <form class="panel" @submit.prevent="handleLogin">
        <h2>登录</h2>
        <label>
          <span>账号 / 邮箱</span>
          <input v-model="loginEmail" type="email" placeholder="name@example.com" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="loginPassword" type="password" placeholder="输入密码" />
        </label>
        <a class="text-link" href="#">忘记密码</a>
        <button type="submit" :disabled="auth.state.loading">{{ auth.state.loading ? '处理中…' : '继续登录' }}</button>

        <div class="divider">二期快捷授权占位</div>

        <div class="social-actions">
          <button type="button" class="secondary" disabled>Google OAuth（二期）</button>
          <button type="button" class="secondary" disabled>GitHub OAuth（二期）</button>
        </div>
      </form>

      <form class="panel" @submit.prevent="handleRegister">
        <h2>注册</h2>
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
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useAuth } from '../services/auth'

const auth = useAuth()

const loginEmail = ref('')
const loginPassword = ref('')
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
  await auth.login(loginEmail.value, loginPassword.value)
  message.value = '登录成功，管理中心已可读取真实后端数据。'
}

const handleRegister = async () => {
  message.value = ''
  if (registerPassword.value !== confirmPassword.value) {
    message.value = '两次输入的密码不一致。'
    return
  }

  await auth.register(registerEmail.value, registerPassword.value, registerNickname.value)
  message.value = '注册成功，已自动登录。'
}

const handleLogout = async () => {
  await auth.logout()
  message.value = '已退出登录。'
}
</script>

<style scoped>
.page,
.auth-layout {
  display: grid;
  gap: 20px;
}

.auth-layout {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.page-header h1,
.panel h2,
.panel label,
.panel p {
  margin: 0;
}

.page-header p {
  margin-top: 8px;
  color: #61685f;
}

.notice-panel,
.panel {
  display: grid;
  gap: 14px;
  padding: 20px;
  border: 1px solid #d7d2c6;
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.96);
}

.notice-panel {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
}

.notice-panel p {
  margin: 8px 0 0;
  color: #61685f;
}

.notice-tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: #edf3ef;
  color: #1b6a52;
  font-size: 0.85rem;
  font-weight: 600;
}

.button-tag {
  border: 1px solid #b8c9be;
  font: inherit;
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
  padding: 10px 12px;
  font: inherit;
}

button.secondary,
.text-link {
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

.text-link {
  justify-self: start;
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  padding: 10px 12px;
  text-decoration: none;
}

.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8a907f;
  font-size: 0.9rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #d7d2c6;
}

.social-actions {
  display: grid;
  gap: 10px;
}

@media (max-width: 960px) {
  .notice-panel,
  .auth-layout {
    grid-template-columns: 1fr;
  }
}
</style>
