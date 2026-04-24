<template>
  <section class="page">
    <header class="page-header">
      <h1>登录与注册</h1>
      <p>支持账号体系登录、邮箱注册，以及第三方快速授权登录。</p>
    </header>

    <section class="notice-panel">
      <div>
        <strong>初始账号</strong>
        <p>原型预设 `cxsearch_demo` 账号，可在后续个人中心中修改账号信息。</p>
      </div>
      <span class="notice-tag">可修改</span>
    </section>

    <div class="auth-layout">
      <section class="panel">
        <h2>登录</h2>
        <label>
          <span>账号 / 邮箱</span>
          <input type="text" placeholder="cxsearch_demo 或 name@example.com" />
        </label>
        <label>
          <span>密码</span>
          <input type="password" placeholder="输入密码" />
        </label>
        <a class="text-link" href="#">忘记密码</a>
        <button type="button">继续登录</button>

        <div class="divider">或使用快捷授权</div>

        <div class="social-actions">
          <button type="button" class="secondary">使用谷歌登录</button>
          <button type="button" class="secondary">使用 Git 登录</button>
        </div>
      </section>

      <section class="panel">
        <h2>注册</h2>
        <label>
          <span>昵称</span>
          <input type="text" placeholder="你的称呼" />
        </label>
        <label>
          <span>邮箱</span>
          <input type="email" placeholder="name@example.com" />
        </label>
        <label>
          <span>设置密码</span>
          <input type="password" placeholder="至少 8 位密码" />
        </label>
        <label>
          <span>确认密码</span>
          <input type="password" placeholder="再次输入密码" />
        </label>
        <button type="button">创建账号</button>
      </section>
    </div>
  </section>
</template>

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
