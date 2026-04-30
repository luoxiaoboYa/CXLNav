import { createRouter, createWebHistory } from 'vue-router'

import AuthPage from '../pages/AuthPage.vue'
import DiscoverPage from '../pages/DiscoverPage.vue'
import ExtensionPopupPage from '../pages/ExtensionPopupPage.vue'
import HomePage from '../pages/HomePage.vue'
import ManagementPage from '../pages/ManagementPage.vue'
import MySitesPage from '../pages/MySitesPage.vue'
import SiteDetailPage from '../pages/SiteDetailPage.vue'
import SiteEditorPage from '../pages/SiteEditorPage.vue'
import UIDesignPreviewPage from '../pages/UIDesignPreviewPage.vue'
import { hasAuthSession } from '../services/auth'

const requireAuth = { requiresAuth: true }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/my-sites', name: 'my-sites', component: MySitesPage, meta: requireAuth },
    { path: '/my-sites/:siteTitle', name: 'site-detail', component: SiteDetailPage, meta: requireAuth },
    { path: '/discover', name: 'discover', component: DiscoverPage },
    { path: '/settings', name: 'settings', component: ManagementPage, meta: requireAuth },
    { path: '/auth', name: 'auth', component: AuthPage },
    { path: '/site-editor', name: 'site-editor', component: SiteEditorPage, meta: requireAuth },
    { path: '/extension-popup', name: 'extension-popup', component: ExtensionPopupPage, meta: requireAuth },
    { path: '/ui-design', name: 'ui-design', component: UIDesignPreviewPage }
  ]
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true
  }

  if (hasAuthSession()) {
    return true
  }

  return {
    path: '/auth',
    query: {
      redirect: to.fullPath
    }
  }
})

export default router
