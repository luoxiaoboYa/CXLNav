<template>
  <section class="popup-page">
    <header class="page-header">
      <h1>插件快捷收藏</h1>
      <p>快速保存当前页面或右键链接，不打断浏览流程；插件不直接发起共享。</p>
    </header>

    <section class="panel">
      <div class="site-preview">
        <strong>当前页面</strong>
        <h2>OpenAI API Docs</h2>
        <p>https://platform.openai.com/docs</p>
      </div>

      <label>
        <span>保存到分类</span>
        <select>
          <option>开发文档</option>
          <option>设计资源</option>
          <option>效率工具</option>
        </select>
      </label>

      <label>
        <span>标签</span>
        <input type="text" placeholder="高频, API, 学习" />
      </label>

      <button type="button">保存到我的站点</button>
    </section>

    <section class="panel secondary-panel" aria-label="插件能力边界">
      <h2>插件第一版边界</h2>
      <ul>
        <li>右键收藏链接只保存为私人站点。</li>
        <li>弹窗优先搜索本地缓存，登录后再同步云端。</li>
        <li>离线或同步失败时进入本地待同步队列。</li>
        <li>共享到推荐库必须回到 Web 主站完成。</li>
      </ul>
      <button type="button" class="secondary-action">打开 CXSearch</button>
    </section>
  </section>
</template>

<style scoped>
.popup-page,
.panel {
  display: grid;
  gap: 18px;
  max-width: 420px;
}

.page-header h1,
.page-header p,
.site-preview h2,
.site-preview p {
  margin: 0;
}

.page-header p,
.site-preview p {
  margin-top: 8px;
  color: #61685f;
}

.panel {
  padding: 20px;
  border: 1px solid #d7d2c6;
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.98);
}

.secondary-panel {
  background: #f5fbf8;
}

ul {
  margin: 0;
  padding-left: 18px;
  color: #61685f;
}

label {
  display: grid;
  gap: 8px;
}

input,
select,
button {
  border: 1px solid #d7d2c6;
  border-radius: 12px;
  background: #ffffff;
  color: #1f251f;
  padding: 10px 12px;
  font: inherit;
}

button {
  background: #1b6a52;
  border-color: #1b6a52;
  color: #ffffff;
}

.secondary-action {
  background: #ffffff;
  border-color: #d7d2c6;
  color: #1f251f;
}
</style>
