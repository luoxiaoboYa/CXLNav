<template>
  <button type="button" aria-label="主题切换" @click="theme?.toggleTheme">
    {{ theme?.mode.value === 'dark' ? '暗黑主题' : '明亮主题' }}
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue'

import { themeKey } from '../services/theme'

const theme = inject(themeKey)
</script>
