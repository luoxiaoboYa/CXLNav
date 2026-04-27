import type { InjectionKey, Ref } from 'vue'

export type ThemeMode = 'dark' | 'light'

export type ThemeContext = {
  mode: Ref<ThemeMode>
  toggleTheme: () => void
}

export const themeKey: InjectionKey<ThemeContext> = Symbol('theme')
