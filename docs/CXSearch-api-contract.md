# CXSearch API 契约草案

日期：2026-04-25  
版本：v0.1  
状态：MVP 第一批接口草案

## 1. 通用约定

### 1.1 基础信息

- API 前缀：`/api/v1`
- 管理员 API 前缀：`/api/v1/admin`
- 认证方式：`Authorization: Bearer <token>`
- 请求体：`application/json`，文件上传使用 `multipart/form-data`
- 时间格式：ISO 8601 字符串，例如 `2026-04-25T10:00:00.000Z`

### 1.2 通用分页请求

```text
page=1
pageSize=20
```

### 1.3 通用分页响应

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 0
}
```

### 1.4 通用错误响应

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数校验失败",
    "details": [
      {
        "field": "url",
        "message": "URL 格式不正确"
      }
    ]
  }
}
```

常用错误码：

```text
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
DUPLICATE_RESOURCE
SHARE_NOT_ALLOWED
URL_RISK_BLOCKED
REVIEW_REQUIRED
CONFLICT
INTERNAL_ERROR
```

### 1.5 通用对象摘要

#### UserDto

```json
{
  "id": "user_1",
  "email": "user@example.com",
  "nickname": "小明",
  "avatarUrl": null,
  "role": "user",
  "status": "active",
  "createdAt": "2026-04-25T10:00:00.000Z"
}
```

#### CategoryDto

```json
{
  "id": "cat_1",
  "scope": "personal",
  "name": "开发",
  "sortOrder": 10,
  "siteCount": 12
}
```

#### TagDto

```json
{
  "id": "tag_1",
  "scope": "personal",
  "name": "高频",
  "usageCount": 8
}
```

#### BookmarkPathDto

```json
{
  "id": "path_1",
  "categoryId": "cat_1",
  "parentId": null,
  "name": "前端",
  "fullPath": "前端 / Vue",
  "sortOrder": 10,
  "siteCount": 5
}
```

## 2. 账号与用户

### 2.1 注册

```http
POST /api/v1/auth/register
```

请求：

```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "小明"
}
```

响应：

```json
{
  "token": "jwt-token",
  "user": {
    "id": "user_1",
    "email": "user@example.com",
    "nickname": "小明",
    "avatarUrl": null,
    "role": "user",
    "status": "active",
    "createdAt": "2026-04-25T10:00:00.000Z"
  }
}
```

### 2.2 登录

```http
POST /api/v1/auth/login
```

请求：

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

响应同注册。

### 2.3 当前用户

```http
GET /api/v1/auth/me
```

响应：

```json
{
  "user": {
    "id": "user_1",
    "email": "user@example.com",
    "nickname": "小明",
    "avatarUrl": null,
    "role": "user",
    "status": "active",
    "createdAt": "2026-04-25T10:00:00.000Z"
  }
}
```

### 2.4 退出登录

```http
POST /api/v1/auth/logout
```

响应：

```json
{
  "success": true
}
```

## 3. 个人站点

### 3.1 PersonalSiteDto

```json
{
  "id": "site_1",
  "title": "Vue Router",
  "url": "https://router.vuejs.org",
  "normalizedUrl": "https://router.vuejs.org/",
  "faviconUrl": null,
  "description": "Vue 官方路由库",
  "purpose": "查 Vue 路由文档",
  "personalNote": "项目初始化时常用",
  "category": {
    "id": "cat_1",
    "name": "开发"
  },
  "bookmarkPath": {
    "id": "path_1",
    "fullPath": "前端 / Vue / 官方"
  },
  "tags": [
    {
      "id": "tag_1",
      "name": "文档"
    }
  ],
  "source": "manual",
  "sourcePath": null,
  "sourceRecommendationId": null,
  "securityStatus": "unchecked",
  "organizeStatus": "complete",
  "archiveStatus": "active",
  "shareStatus": "none",
  "createdAt": "2026-04-25T10:00:00.000Z",
  "updatedAt": "2026-04-25T10:00:00.000Z",
  "lastOpenedAt": null
}
```

### 3.2 创建个人站点

```http
POST /api/v1/personal-sites
```

请求：

```json
{
  "url": "https://router.vuejs.org",
  "title": "Vue Router",
  "description": "",
  "purpose": "",
  "personalNote": "",
  "categoryId": "cat_1",
  "bookmarkPathId": "path_1",
  "tagIds": ["tag_1"],
  "source": "manual"
}
```

响应：

```json
{
  "site": {},
  "warnings": [
    {
      "type": "duplicate_personal_site",
      "message": "你已经收藏过这个链接",
      "siteIds": ["site_old_1"]
    }
  ],
  "recommendationMatch": {
    "id": "rec_1",
    "title": "Vue Router",
    "message": "推荐库中已有更完整说明"
  }
}
```

规则：

- 只强制 `url`。
- 保存不等待抓取完成。
- 个人站点重复不阻止，只返回 `warnings`。
- 推荐库命中不阻止保存，只返回 `recommendationMatch`。

### 3.3 获取个人站点列表

```http
GET /api/v1/personal-sites
```

查询参数：

```text
keyword
categoryId
tagIds
bookmarkPathId
archiveStatus=active|archived|deleted
securityStatus
organizeStatus
source
page
pageSize
sort=latest|recent_opened|title
```

响应：

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 0,
  "summary": {
    "activeCount": 100,
    "archivedCount": 12,
    "todoCount": 18
  }
}
```

### 3.4 获取个人站点详情

```http
GET /api/v1/personal-sites/{siteId}
```

响应：

```json
{
  "site": {},
  "recommendationInfo": {
    "exists": true,
    "recommendationId": "rec_1",
    "title": "Vue Router",
    "publishStatus": "published"
  },
  "validationLatest": {
    "status": "safe",
    "checkedAt": "2026-04-25T10:00:00.000Z"
  }
}
```

### 3.5 更新个人站点

```http
PATCH /api/v1/personal-sites/{siteId}
```

请求：

```json
{
  "title": "Vue Router",
  "url": "https://router.vuejs.org",
  "description": "Vue 官方路由库",
  "purpose": "查 Vue 路由文档",
  "personalNote": "项目初始化时常用",
  "categoryId": "cat_1",
  "bookmarkPathId": "path_1",
  "tagIds": ["tag_1", "tag_2"]
}
```

响应：

```json
{
  "site": {}
}
```

### 3.6 删除、归档、恢复、打开、重检

```http
DELETE /api/v1/personal-sites/{siteId}?confirmShared=true
POST   /api/v1/personal-sites/{siteId}/archive
POST   /api/v1/personal-sites/{siteId}/restore
POST   /api/v1/personal-sites/{siteId}/open
POST   /api/v1/personal-sites/{siteId}/recheck
```

删除已共享站点但未确认时，返回：

```json
{
  "error": {
    "code": "CONFIRM_REQUIRED",
    "message": "这个站点已共享到推荐库，删除个人站点不会删除公开推荐内容。"
  }
}
```

打开响应：

```json
{
  "url": "https://router.vuejs.org",
  "lastOpenedAt": "2026-04-25T10:00:00.000Z"
}
```

重检响应：

```json
{
  "validationTaskId": "val_task_1",
  "status": "checking"
}
```

## 4. 分类、标签、书签路径

### 4.1 分类

```http
GET    /api/v1/categories?scope=personal
POST   /api/v1/categories
PATCH  /api/v1/categories/{categoryId}
DELETE /api/v1/categories/{categoryId}
```

创建请求：

```json
{
  "name": "开发",
  "scope": "personal",
  "sortOrder": 10
}
```

列表响应：

```json
{
  "items": [],
  "total": 0
}
```

### 4.2 标签

```http
GET    /api/v1/tags?scope=personal
POST   /api/v1/tags
PATCH  /api/v1/tags/{tagId}
DELETE /api/v1/tags/{tagId}
POST   /api/v1/tags/merge
```

合并请求：

```json
{
  "sourceTagIds": ["tag_1", "tag_2"],
  "targetTagId": "tag_3"
}
```

### 4.3 书签路径

```http
GET    /api/v1/bookmark-paths?categoryId=cat_1
POST   /api/v1/bookmark-paths
PATCH  /api/v1/bookmark-paths/{pathId}
DELETE /api/v1/bookmark-paths/{pathId}
POST   /api/v1/bookmark-paths/move
POST   /api/v1/bookmark-paths/merge
```

创建请求：

```json
{
  "categoryId": "cat_1",
  "parentId": null,
  "name": "前端",
  "sortOrder": 10
}
```

移动请求：

```json
{
  "pathId": "path_1",
  "targetParentId": "path_2",
  "targetCategoryId": "cat_1"
}
```

## 5. 搜索与待整理

### 5.1 全局搜索

```http
GET /api/v1/search?q=github&scope=all&page=1&pageSize=20
```

响应：

```json
{
  "personalSites": {
    "items": [],
    "total": 0
  },
  "recommendations": {
    "mainSites": [],
    "featureSites": [],
    "total": 0
  },
  "crossHints": [
    {
      "type": "recommendation_has_more_info",
      "personalSiteId": "site_1",
      "recommendationId": "rec_1",
      "message": "推荐库中也有更完整说明"
    }
  ],
  "meta": {
    "scope": "all",
    "keyword": "github"
  }
}
```

### 5.2 待整理列表

```http
GET /api/v1/organize-tasks?type=missing_description&page=1&pageSize=20
```

响应：

```json
{
  "items": [
    {
      "type": "missing_description",
      "site": {},
      "message": "这个站点缺少说明",
      "recommendationSuggestion": null
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 0,
  "summary": {
    "missingDescription": 5,
    "missingTags": 8,
    "duplicateSuspected": 3,
    "linkProblem": 2,
    "pathPending": 4,
    "stale": 10,
    "archived": 12
  }
}
```

### 5.3 处理疑似重复

```http
POST /api/v1/organize-tasks/duplicates/resolve
```

请求：

```json
{
  "siteIds": ["site_1", "site_2"],
  "action": "keep_all",
  "targetSiteId": null,
  "deleteSiteIds": []
}
```

## 6. 推荐发现与推荐理由

### 6.1 RecommendationDto

```json
{
  "id": "rec_1",
  "type": "main_site",
  "title": "GitHub",
  "url": "https://github.com",
  "normalizedUrl": "https://github.com/",
  "faviconUrl": null,
  "description": "代码托管和协作平台",
  "category": {
    "id": "cat_public_dev",
    "name": "开发"
  },
  "parent": null,
  "tags": [],
  "source": "system",
  "publishStatus": "published",
  "hotScore": 100,
  "favoriteCount": 20,
  "openCount": 120,
  "reasonCount": 5,
  "publishedAt": "2026-04-25T10:00:00.000Z"
}
```

### 6.2 推荐列表与详情

```http
GET /api/v1/recommendations
GET /api/v1/recommendations/{recommendationId}
```

详情响应：

```json
{
  "recommendation": {},
  "reasons": [],
  "relatedFeatures": [],
  "myState": {
    "collected": true,
    "personalSiteId": "site_1",
    "hasReason": false
  }
}
```

### 6.3 收藏推荐内容

```http
POST /api/v1/recommendations/{recommendationId}/collect
```

请求：

```json
{
  "categoryId": "cat_1",
  "bookmarkPathId": null,
  "applySuggestedTags": false,
  "selectedTagIds": []
}
```

响应：

```json
{
  "site": {},
  "warnings": [],
  "suggestedTags": [
    {
      "id": "tag_public_ai",
      "name": "AI"
    }
  ]
}
```

### 6.4 推荐理由

```http
GET    /api/v1/recommendations/{recommendationId}/reasons
PUT    /api/v1/recommendations/{recommendationId}/my-reason
DELETE /api/v1/recommendations/{recommendationId}/my-reason
```

PUT 请求：

```json
{
  "content": "我常用它查看开源趋势",
  "displayMode": "real_name"
}
```

响应：

```json
{
  "reason": {
    "id": "reason_1",
    "recommendationId": "rec_1",
    "displayMode": "real_name",
    "content": "我常用它查看开源趋势",
    "status": "published",
    "createdAt": "2026-04-25T10:00:00.000Z",
    "updatedAt": "2026-04-25T10:00:00.000Z"
  }
}
```

## 7. 共享申请

### 7.1 共享前检查

```http
POST /api/v1/share-applications/precheck
```

请求：

```json
{
  "personalSiteId": "site_1",
  "shareType": "feature_site"
}
```

可共享响应：

```json
{
  "canShare": true,
  "blockReasons": [],
  "duplicateRecommendation": null,
  "matchedMainSite": {
    "id": "rec_github",
    "title": "GitHub"
  },
  "suggestedShareType": "feature_site",
  "nextAction": "create_application"
}
```

重复 URL 响应：

```json
{
  "canShare": false,
  "blockReasons": ["duplicate_recommendation"],
  "duplicateRecommendation": {
    "id": "rec_1",
    "title": "GitHub Trending"
  },
  "matchedMainSite": null,
  "suggestedShareType": "feature_site",
  "nextAction": "add_reason"
}
```

不可共享响应：

```json
{
  "canShare": false,
  "blockReasons": ["site_archived", "security_not_safe"],
  "duplicateRecommendation": null,
  "matchedMainSite": null,
  "suggestedShareType": "feature_site",
  "nextAction": "fix_site"
}
```

### 7.2 创建共享申请

```http
POST /api/v1/share-applications
```

请求：

```json
{
  "personalSiteId": "site_1",
  "shareType": "feature_site",
  "displayMode": "anonymous",
  "publicTitle": "GitHub Trending",
  "publicDescription": "查看 GitHub 热门开源项目",
  "categoryId": "cat_public_dev",
  "parentRecommendationId": "rec_github",
  "tagIds": ["tag_open_source"],
  "reason": "每天看技术趋势很方便"
}
```

响应：

```json
{
  "application": {
    "id": "share_1",
    "status": "draft",
    "validationStatus": "not_started"
  }
}
```

### 7.3 提交、撤回、列表、详情

```http
GET   /api/v1/share-applications
GET   /api/v1/share-applications/{applicationId}
PATCH /api/v1/share-applications/{applicationId}
POST  /api/v1/share-applications/{applicationId}/submit
POST  /api/v1/share-applications/{applicationId}/withdraw
```

提交响应：

```json
{
  "application": {
    "id": "share_1",
    "status": "validating",
    "validationStatus": "checking"
  }
}
```

## 8. 导入 / 导出

### 8.1 解析浏览器书签

```http
POST /api/v1/imports/bookmarks/parse
```

请求：`multipart/form-data`，字段 `file`。

响应：

```json
{
  "importTaskId": "import_1",
  "summary": {
    "totalCount": 328,
    "validCount": 319,
    "duplicateCount": 12,
    "problemCount": 9
  },
  "items": [
    {
      "previewItemId": "item_1",
      "title": "Vue Router",
      "url": "https://router.vuejs.org",
      "sourcePath": "开发 / 前端 / Vue / 官方",
      "suggestedCategoryName": "开发",
      "suggestedBookmarkPath": "前端 / Vue / 官方",
      "duplicate": false,
      "problemReason": null
    }
  ]
}
```

### 8.2 确认导入

```http
POST /api/v1/imports/bookmarks/confirm
```

请求：

```json
{
  "importTaskId": "import_1",
  "importMode": "standard",
  "duplicateStrategy": "keep_all",
  "items": [
    {
      "previewItemId": "item_1",
      "categoryId": "cat_1",
      "bookmarkPathId": "path_1",
      "shouldImport": true
    }
  ]
}
```

响应：

```json
{
  "importTask": {
    "id": "import_1",
    "status": "completed",
    "successCount": 319,
    "duplicateCount": 12,
    "problemCount": 9
  }
}
```

### 8.3 导出

```http
GET /api/v1/exports/bookmarks.html?mode=current_structure
GET /api/v1/exports/cxsearch.json
POST /api/v1/imports/cxsearch-json
```

## 9. 插件同步

### 9.1 批量同步

```http
POST /api/v1/sync/plugin
```

请求：

```json
{
  "clientId": "plugin_chrome_xxx",
  "items": [
    {
      "localId": "local_1",
      "operation": "create",
      "targetType": "personal_site",
      "payload": {
        "url": "https://example.com",
        "title": "Example",
        "source": "plugin"
      },
      "clientUpdatedAt": "2026-04-25T10:00:00.000Z"
    }
  ]
}
```

响应：

```json
{
  "synced": [
    {
      "localId": "local_1",
      "serverId": "site_1"
    }
  ],
  "failed": [],
  "conflicts": []
}
```

### 9.2 插件启动数据

```http
GET /api/v1/sync/plugin/bootstrap
```

响应：

```json
{
  "recentSites": [],
  "frequentSites": [],
  "updatedAt": "2026-04-25T10:00:00.000Z"
}
```

## 10. 举报、URL 校验、管理员接口

### 10.1 举报

```http
POST /api/v1/reports
GET  /api/v1/reports/my
```

创建举报请求：

```json
{
  "targetType": "recommendation",
  "targetId": "rec_1",
  "reasonType": "risk",
  "reasonText": "疑似钓鱼网站"
}
```

### 10.2 URL 校验

```http
GET  /api/v1/url-validations?targetType=personal_site&targetId=site_1
POST /api/v1/url-validations/recheck
```

手动重检请求：

```json
{
  "targetType": "personal_site",
  "targetId": "site_1"
}
```

### 10.3 管理员审核

```http
GET  /api/v1/admin/reviews
POST /api/v1/admin/reviews/{targetType}/{targetId}/approve
POST /api/v1/admin/reviews/{targetType}/{targetId}/reject
POST /api/v1/admin/reviews/{targetType}/{targetId}/hide
POST /api/v1/admin/reviews/{targetType}/{targetId}/restore
```

拒绝请求：

```json
{
  "reason": "描述过短，请补充具体用途"
}
```

### 10.4 管理员推荐治理

```http
POST /api/v1/admin/recommendations/{recommendationId}/remove
POST /api/v1/admin/recommendations/merge
```

合并请求：

```json
{
  "sourceRecommendationId": "rec_duplicate",
  "targetRecommendationId": "rec_standard",
  "reason": "重复站点"
}
```

### 10.5 风险域名

```http
GET    /api/v1/admin/risk-domains
POST   /api/v1/admin/risk-domains
PATCH  /api/v1/admin/risk-domains/{domainId}
DELETE /api/v1/admin/risk-domains/{domainId}
```

## 11. 后续待细化

- 邮箱注册是否需要邮件验证和密码找回接口。
- 个人站点 `organizeStatus` 是否需要支持多状态数组。
- 搜索结果命中原因的详细结构。
- 管理员审核列表是否拆分为审核、举报、风险三个独立队列。
- URL 校验异步任务是否需要单独暴露任务查询接口。

