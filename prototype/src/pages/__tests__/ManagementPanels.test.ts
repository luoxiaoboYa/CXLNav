import { fireEvent, render, screen } from '@testing-library/vue'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import ManagementPage from '../ManagementPage.vue'

const currentDir = dirname(fileURLToPath(import.meta.url))

describe('management center panels', () => {
  test('switches between focused management panels', async () => {
    render(ManagementPage)

    expect(screen.getByRole('heading', { name: '站点管理' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '待整理中心' }))
    expect(screen.getByRole('heading', { name: '待整理中心' })).toBeInTheDocument()
    expect(screen.getByText('登录后合并原则')).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '分类管理' }))
    expect(screen.getByRole('heading', { name: '分类管理' })).toBeInTheDocument()
    expect(screen.getAllByText('默认导出路径').length).toBeGreaterThan(0)

    await fireEvent.click(screen.getByRole('button', { name: '标签管理' }))
    expect(screen.getByRole('heading', { name: '标签管理' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '合并标签' }).length).toBeGreaterThan(0)

    await fireEvent.click(screen.getByRole('button', { name: '书签路径管理' }))
    expect(screen.getByRole('heading', { name: '书签路径管理' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '批量迁移站点' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '分享 / 推荐管理' }))
    expect(screen.getByRole('heading', { name: '分享 / 推荐管理' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '后台治理能力' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '导入 / 导出' }))
    expect(screen.getByRole('heading', { name: '导入 / 导出' })).toBeInTheDocument()
    expect(screen.getByText('默认按 CXSearch 当前结构导出')).toBeInTheDocument()
    expect(screen.getByLabelText('导入预览清单')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '确认导入' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '个人中心' }))
    expect(screen.getByRole('heading', { name: '个人中心' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '账号安全' }))
    expect(screen.getByRole('heading', { name: '账号安全' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '插件管理' }))
    expect(screen.getByRole('heading', { name: '插件管理' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '预览插件快捷收藏' })).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: '回收站' }))
    expect(screen.getByRole('heading', { name: '回收站' })).toBeInTheDocument()
  })

  test('uses component-level K6 tokens instead of legacy prototype colors', () => {
    const managementDir = join(currentDir, '../../components/management')
    const sourceFiles = [
      join(currentDir, '../ManagementPage.vue'),
      join(currentDir, '../../components/SiteEditorForm.vue'),
      join(currentDir, '../../components/SiteEditorModal.vue'),
      ...readdirSync(managementDir)
        .filter((fileName) => fileName.endsWith('.vue'))
        .map((fileName) => join(managementDir, fileName))
    ]
    const legacyPalette = [
      '#d7d2c6',
      '#fbf8f2',
      '#ffffff',
      '#61685f',
      '#1b6a52',
      '#deeee7',
      '#fffdf8',
      '#f5fbf8',
      '#b8c9be'
    ]

    const offenders = sourceFiles.flatMap((filePath) => {
      const source = readFileSync(filePath, 'utf8')
      const legacyMatches = legacyPalette.filter((color) => source.includes(color))
      const importantMatch = source.includes('!important') ? ['!important'] : []

      return [...legacyMatches, ...importantMatch].map((match) => `${filePath}: ${match}`)
    })

    expect(offenders).toEqual([])
  })

  test('keeps K6 management shadows restrained', () => {
    const sourceFiles = [
      join(currentDir, '../../layouts/AppShell.vue'),
      join(currentDir, '../ManagementPage.vue'),
      join(currentDir, '../../components/SiteEditorModal.vue'),
      join(currentDir, '../../components/management/ManagementSidebar.vue')
    ]
    const heavyShadowTokens = [
      '0 18px 70px',
      '0 24px 60px',
      '0 18px 54px',
      '0 0 16px currentColor'
    ]

    const offenders = sourceFiles.flatMap((filePath) => {
      const source = readFileSync(filePath, 'utf8')

      return heavyShadowTokens
        .filter((token) => source.includes(token))
        .map((token) => `${filePath}: ${token}`)
    })

    expect(offenders).toEqual([])
  })
})
