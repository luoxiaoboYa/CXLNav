# CXSearch 数据模型与 API 清单

日期：2026-04-25  
版本：v0.1  
状态：已按当前 PRD 方向确认

## 1. 设计结论

- 个人分类和平台分类共用 `Category`，通过 `scope` 区分。
- 个人标签和平台标签共用 `Tag`，通过 `scope` 区分。
- 个人站点归档使用独立 `archiveStatus` 字段，不混入整理状态。
- 公开推荐对象统一使用 `PublicRecommendation`，通过 `type` 区分主站点和功能站点。
- 功能站点通过 `parentId` 关联主站点。
- 前台重复共享不创建新推荐对象，也不自动合并，只提示已有内容并引导补充推荐理由。
- 后台重复合并使用 `mergedToId` 记录标准对象，仅作为管理员治理工具。
- 推荐理由第一版替代评论。
- 插件同步第一版采用本地待同步队列 + 批量同步 API。
- 推荐理由接口使用 `PUT /my-reason`，因为同一用户对同一推荐对象只有一条主推荐理由。
- 管理员审核 API 统一放在 `/api/v1/admin/reviews/...` 下。

## 2. 数据模型草案

### 2.1 User

字段：

```text
id
email
passwordHash
nickname
avatarUrl
role: user | admin
status: active | disabled | deleted
createdAt
updatedAt
lastLoginAt
```

### 2.2 PersonalSite

个人站点是用户自己的收藏数据。

```text
id
userId
localClientId
title
url
normalizedUrl
faviconUrl
description
purpose
personalNote
categoryId
bookmarkPathId
source: manual | plugin | browser_import | recommendation | json_restore
sourcePath
sourceRecommendationId
securityStatus: unchecked | checking | safe | unreachable | risky | blocked
organizeStatus: complete | missing_description | missing_tags | path_pending | duplicate_suspected | stale | link_problem
archiveStatus: active | archived | deleted
shareStatus: none | draft | pending | published | rejected | removed
createdAt
updatedAt
lastOpenedAt
deletedAt
```

说明：

- `localClientId` 用于未登录本地数据同步去重。
- `sourcePath` 保留浏览器书签导入时的原始路径。
- `sourceRecommendationId` 记录推荐库收藏来源；推荐对象下架后个人站点仍保留。
- `shareStatus` 只是个人站点视角的共享摘要，真实流程以 `ShareApplication` 为准。

### 2.3 Category

分类用于个人一级分类和推荐库平台分类。

```text
id
userId
scope: personal | public
name
sortOrder
createdAt
updatedAt
deletedAt
```

### 2.4 Tag

标签用于个人普通标签和推荐库平台标签。

```text
id
userId
scope: personal | public
name
usageCount
createdAt
updatedAt
deletedAt
```

规则：平台标签收藏到我的站点时只作为建议，不自动写入个人标签。

### 2.5 PersonalSiteTag

```text
siteId
tagId
createdAt
```

### 2.6 BookmarkPath

书签路径用于表达浏览器目录结构。

```text
id
userId
categoryId
parentId
name
fullPath
sortOrder
createdAt
updatedAt
deletedAt
```

规则：书签路径属于某个分类；同名路径段可以存在于不同分类下；普通标签不参与浏览器目录导出。

### 2.7 PublicRecommendation

公开推荐对象统一表示主站点和功能站点。

```text
id
type: main_site | feature_site
title
url
normalizedUrl
faviconUrl
description
categoryId
parentId
source: system | user_share | admin_created
createdBy
securityStatus
reviewStatus
publishStatus: draft | pending_review | published | hidden | removed | merged
hotScore
favoriteCount
openCount
reasonCount
createdAt
updatedAt
publishedAt
removedAt
mergedToId
```

规则：功能站点通过 `parentId` 关联主站点；后台合并时重复对象状态变为 `merged`，并通过 `mergedToId` 指向标准对象。

### 2.8 PublicRecommendationTag

```text
recommendationId
tagId
createdAt
```

### 2.9 ShareApplication

共享申请从个人站点发起。

```text
id
userId
personalSiteId
targetRecommendationId
shareType: main_site | feature_site
displayMode: real_name | anonymous
publicTitle
publicUrl
normalizedUrl
publicDescription
categoryId
parentRecommendationId
reason
status: draft | validating | validation_failed | pending_review | rejected | published | withdrawn | removed
validationStatus: not_started | checking | passed | failed
reviewerId
reviewReason
createdAt
updatedAt
submittedAt
reviewedAt
publishedAt
withdrawnAt
```

规则：完整 URL 已存在时，不创建新的 `ShareApplication`，直接引导补充推荐理由；同一个个人站点同一时间只允许一个进行中的共享申请。

### 2.10 ShareApplicationTag

```text
shareApplicationId
tagId
createdAt
```

### 2.11 RecommendationReason

推荐理由第一版替代评论。

```text
id
recommendationId
userId
displayMode: real_name | anonymous
content
status: published | pending_review | hidden | removed
createdAt
updatedAt
hiddenAt
removedAt
```

规则：同一用户对同一推荐对象只保留一条主推荐理由；可编辑；命中风控或被举报后进入复审。

### 2.12 Report

```text
id
reporterId
targetType: recommendation | reason
targetId
reasonType: spam | risk | duplicate | invalid_link | inappropriate | copyright | other
reasonText
status: pending | processing | resolved | rejected
handlerId
handleResult
createdAt
handledAt
```

### 2.13 ReviewRecord

审核、复审、隐藏、下架、合并等治理动作均需记录。

```text
id
targetType
targetId
action: approve | reject | hide | restore | remove | merge | mark_risky | mark_safe
operatorId
reason
beforeStatus
afterStatus
createdAt
```

### 2.14 RiskDomain

```text
id
domain
riskType: phishing | malware | spam | internal | manual_block
status
note
createdBy
createdAt
updatedAt
```

### 2.15 UrlValidationRecord

```text
id
targetType: personal_site | share_application | recommendation
targetId
url
normalizedUrl
status: checking | safe | unreachable | risky | blocked | failed
httpStatus
finalUrl
redirectChain
riskType
failureReason
checkedAt
createdAt
```

### 2.16 ImportTask

```text
id
userId
fileName
importType: browser_bookmark_html | cxsearch_json
importMode: standard | simple
duplicateStrategy: keep_all | merge | skip
status
totalCount
successCount
duplicateCount
skippedCount
problemCount
createdAt
completedAt
```

默认使用 `keep_all`。

### 2.17 ImportItem

```text
id
importTaskId
personalSiteId
title
url
sourcePath
categoryName
bookmarkPath
status
problemReason
createdAt
```

### 2.18 ClientSyncRecord

插件和本地未登录数据同步概念。MVP 可先由插件本地维护待同步队列，服务端提供批量同步接口，不一定落复杂同步表。

```text
id
userId
clientId
localClientId
targetType
targetLocalId
targetServerId
operation: create | update | delete | archive | restore
status: pending | synced | failed | conflict
payload
createdAt
syncedAt
```

## 3. 数据关系总览

```text
User
├─ PersonalSite
│  ├─ Category
│  ├─ BookmarkPath
│  ├─ PersonalSiteTag → Tag(personal)
│  ├─ UrlValidationRecord
│  └─ sourceRecommendationId → PublicRecommendation
│
├─ ShareApplication
│  ├─ PersonalSite
│  ├─ ShareApplicationTag → Tag(public)
│  └─ PublicRecommendation，可为空
│
├─ RecommendationReason
├─ Report
└─ ImportTask
   └─ ImportItem

PublicRecommendation
├─ type: main_site / feature_site
├─ parentId → PublicRecommendation(main_site)
├─ PublicRecommendationTag → Tag(public)
├─ RecommendationReason
├─ Report
├─ ReviewRecord
└─ UrlValidationRecord
```

## 4. API 约定

- API 前缀：`/api/v1`
- 认证方式：`Bearer Token`
- 管理员 API 前缀：`/api/v1/admin`

## 5. API 清单

### 5.1 账号与用户

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

### 5.2 个人站点

```http
POST   /api/v1/personal-sites
GET    /api/v1/personal-sites
GET    /api/v1/personal-sites/{siteId}
PATCH  /api/v1/personal-sites/{siteId}
DELETE /api/v1/personal-sites/{siteId}?confirmShared=true
POST   /api/v1/personal-sites/{siteId}/archive
POST   /api/v1/personal-sites/{siteId}/restore
POST   /api/v1/personal-sites/{siteId}/open
POST   /api/v1/personal-sites/{siteId}/recheck
```

规则：只强制 `url`；保存后默认 `securityStatus = unchecked`；异步进入 URL 校验和信息补全队列；个人站点重复只提示不阻止。

### 5.3 分类

```http
GET    /api/v1/categories?scope=personal
POST   /api/v1/categories
PATCH  /api/v1/categories/{categoryId}
DELETE /api/v1/categories/{categoryId}
```

### 5.4 标签

```http
GET    /api/v1/tags?scope=personal
POST   /api/v1/tags
PATCH  /api/v1/tags/{tagId}
DELETE /api/v1/tags/{tagId}
POST   /api/v1/tags/merge
```

### 5.5 书签路径

```http
GET    /api/v1/bookmark-paths?categoryId=cat_1
POST   /api/v1/bookmark-paths
PATCH  /api/v1/bookmark-paths/{pathId}
DELETE /api/v1/bookmark-paths/{pathId}
POST   /api/v1/bookmark-paths/move
POST   /api/v1/bookmark-paths/merge
```

### 5.6 搜索与待整理

```http
GET  /api/v1/search
GET  /api/v1/organize-tasks
POST /api/v1/organize-tasks/duplicates/resolve
```

搜索参数：`q`、`scope=all|personal|recommendation`、`page`、`pageSize`。

规则：首页默认 `scope=all`；全部搜索结果按我的站点 / 推荐发现分组；同 URL 同时存在时优先展示个人站点，并返回推荐库引用提示。

待整理类型：

```text
missing_description
missing_tags
duplicate_suspected
link_problem
path_pending
stale
archived
```

### 5.7 推荐发现

```http
GET  /api/v1/recommendations
GET  /api/v1/recommendations/{recommendationId}
POST /api/v1/recommendations/{recommendationId}/collect
POST /api/v1/recommendations/{recommendationId}/open
```

推荐列表参数：`keyword`、`type=main_site|feature_site`、`categoryId`、`tagIds`、`sort=hot|latest|favorite_count|open_count`、`page`、`pageSize`。

规则：平台标签不自动写入个人标签；个人已有相同 URL 时返回提示但允许仍然新增；推荐对象下架后不删除已收藏个人站点。

### 5.8 推荐理由

```http
GET    /api/v1/recommendations/{recommendationId}/reasons
PUT    /api/v1/recommendations/{recommendationId}/my-reason
DELETE /api/v1/recommendations/{recommendationId}/my-reason
```

规则：同一用户对同一推荐对象只保留一条主推荐理由；`PUT /my-reason` 表达新增或更新；命中风控进入待复审，否则发布。

### 5.9 共享申请

```http
POST  /api/v1/share-applications/precheck
POST  /api/v1/share-applications
GET   /api/v1/share-applications
GET   /api/v1/share-applications/{applicationId}
PATCH /api/v1/share-applications/{applicationId}
POST  /api/v1/share-applications/{applicationId}/submit
POST  /api/v1/share-applications/{applicationId}/withdraw
```

规则：完整 URL 已存在时，`precheck` 返回 `nextAction = add_reason`；重复 URL 不创建新的共享申请；新主站点必须审核；已审核主站点下的功能站点可免人工审核，但仍需 URL 校验、重复检测和内容风控。

### 5.10 举报

```http
POST /api/v1/reports
GET  /api/v1/reports/my
```

### 5.11 URL 校验

```http
GET  /api/v1/url-validations
POST /api/v1/url-validations/recheck
```

### 5.12 导入 / 导出

```http
POST /api/v1/imports/bookmarks/parse
POST /api/v1/imports/bookmarks/confirm
GET  /api/v1/imports
GET  /api/v1/imports/{importTaskId}
GET  /api/v1/exports/bookmarks.html
GET  /api/v1/exports/cxsearch.json
POST /api/v1/imports/cxsearch-json
```

浏览器书签导出参数：`mode=current_structure|original_structure|flat_by_category`，默认 `current_structure`。CXSearch JSON 恢复 MVP 默认使用 `merge`，不做覆盖恢复。

### 5.13 插件同步

```http
POST /api/v1/sync/plugin
GET  /api/v1/sync/plugin/bootstrap
```

规则：插件第一版只做批量同步；插件优先搜索本地缓存；`bootstrap` 用于登录后获取最近 / 常用 / 必要站点缓存。

### 5.14 管理员 API

```http
GET    /api/v1/admin/reviews
POST   /api/v1/admin/reviews/{targetType}/{targetId}/approve
POST   /api/v1/admin/reviews/{targetType}/{targetId}/reject
POST   /api/v1/admin/reviews/{targetType}/{targetId}/hide
POST   /api/v1/admin/reviews/{targetType}/{targetId}/restore
POST   /api/v1/admin/recommendations/{recommendationId}/remove
POST   /api/v1/admin/recommendations/merge
GET    /api/v1/admin/risk-domains
POST   /api/v1/admin/risk-domains
PATCH  /api/v1/admin/risk-domains/{domainId}
DELETE /api/v1/admin/risk-domains/{domainId}
```

合并规则：只有管理员能合并；前台用户重复共享不走合并；`source.publishStatus` 变为 `merged`；`source.mergedToId` 指向 `target`；保留审核和操作记录。

## 6. API 模块优先级

### 6.1 MVP 第一批

```text
auth
personal-sites
categories
tags
bookmark-paths
search
recommendations
recommendation reasons
share-applications
imports / exports
plugin sync
admin review
```

### 6.2 MVP 可后置但建议保留最小版本

```text
reports
risk-domains
manual url validations
advanced organize duplicate resolve
```

