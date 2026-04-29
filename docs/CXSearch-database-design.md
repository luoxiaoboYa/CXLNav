# CXSearch 数据库表结构设计

日期：2026-04-25  
版本：v0.1  
状态：草案

## 1. 设计约定

- 数据库：MySQL 8.x。
- 字符集：`utf8mb4`。
- 排序规则：`utf8mb4_0900_ai_ci`，如需兼容 MySQL 5.7 可改为 `utf8mb4_unicode_ci`。
- 主键：使用字符串 ID，建议业务层生成 `BIGINT Snowflake` 或 `UUID/ULID`。本文用 `varchar(36)` 表示。
- 时间字段：统一使用 `datetime(3)`，由服务端写入 UTC 或统一时区时间。
- 软删除：核心业务表使用 `deleted_at`。
- 枚举：数据库层优先使用 `varchar`，由应用层约束枚举值，避免后续迁移频繁改 enum。
- JSON 字段：用于跳转链、批量 payload、导入预览等结构化但不高频筛选的数据。
- 命名：表名使用小写复数下划线，字段名使用小写下划线。

## 2. 通用字段

多数业务表建议包含：

```sql
id varchar(36) primary key,
created_at datetime(3) not null,
updated_at datetime(3) not null,
deleted_at datetime(3) null
```

关联表可不设置 `updated_at` 和 `deleted_at`，按实际需要简化。

## 3. 用户与账号

### 3.1 users

```sql
create table users (
  id varchar(36) primary key,
  username varchar(80) not null,
  email varchar(255) not null,
  password_hash varchar(255) not null,
  nickname varchar(80) not null,
  avatar_url varchar(1024) null,
  role varchar(32) not null default 'user',
  status varchar(32) not null default 'active',
  created_at datetime(3) not null,
  updated_at datetime(3) not null,
  last_login_at datetime(3) null,
  deleted_at datetime(3) null,
  unique key uk_users_username (username),
  unique key uk_users_email (email),
  key idx_users_status (status),
  key idx_users_role (role)
);
```

约束：

- `role`：`user`、`admin`。
- `status`：`active`、`disabled`、`deleted`。
- MVP 只做账号/邮箱 + 密码登录，OAuth 字段暂不加入。

## 4. 分类、标签、书签路径

### 4.1 categories

```sql
create table categories (
  id varchar(36) primary key,
  user_id varchar(36) null,
  scope varchar(32) not null,
  name varchar(80) not null,
  sort_order int not null default 0,
  created_at datetime(3) not null,
  updated_at datetime(3) not null,
  deleted_at datetime(3) null,
  key idx_categories_user_scope (user_id, scope),
  key idx_categories_scope_sort (scope, sort_order),
  unique key uk_categories_personal_name (user_id, scope, name, deleted_at)
);
```

约束：

- `scope`：`personal`、`public`。
- 个人分类必须有 `user_id`；平台分类 `user_id` 可为空。
- MySQL 唯一索引中 `deleted_at` 为 `null` 时允许重复，严格唯一需要使用生成列或应用层校验。MVP 可先应用层校验同一用户同名分类。

### 4.2 tags

```sql
create table tags (
  id varchar(36) primary key,
  user_id varchar(36) null,
  scope varchar(32) not null,
  name varchar(80) not null,
  usage_count int not null default 0,
  created_at datetime(3) not null,
  updated_at datetime(3) not null,
  deleted_at datetime(3) null,
  key idx_tags_user_scope (user_id, scope),
  key idx_tags_scope_usage (scope, usage_count),
  unique key uk_tags_scope_name (user_id, scope, name, deleted_at)
);
```

约束：

- `scope`：`personal`、`public`。
- 平台标签收藏到我的站点时只作为建议，不自动写入个人标签。

### 4.3 bookmark_paths

```sql
create table bookmark_paths (
  id varchar(36) primary key,
  user_id varchar(36) not null,
  category_id varchar(36) not null,
  parent_id varchar(36) null,
  name varchar(120) not null,
  full_path varchar(1024) not null,
  sort_order int not null default 0,
  created_at datetime(3) not null,
  updated_at datetime(3) not null,
  deleted_at datetime(3) null,
  key idx_bookmark_paths_user_category (user_id, category_id),
  key idx_bookmark_paths_parent (parent_id),
  key idx_bookmark_paths_full_path (user_id, category_id, full_path(255))
);
```

约束：

- 书签路径属于用户和分类。
- 同名路径段允许存在于不同分类下。
- 路径唯一性建议应用层按 `user_id + category_id + full_path` 校验。

## 5. 个人站点

### 5.1 personal_sites

```sql
create table personal_sites (
  id varchar(36) primary key,
  user_id varchar(36) not null,
  local_client_id varchar(80) null,
  title varchar(255) null,
  url varchar(2048) not null,
  normalized_url varchar(2048) not null,
  url_hash char(64) not null,
  favicon_url varchar(1024) null,
  description text null,
  purpose varchar(500) null,
  personal_note text null,
  category_id varchar(36) null,
  bookmark_path_id varchar(36) null,
  source varchar(32) not null default 'manual',
  source_path varchar(1024) null,
  source_recommendation_id varchar(36) null,
  security_status varchar(32) not null default 'unchecked',
  organize_status varchar(32) not null default 'complete',
  archive_status varchar(32) not null default 'active',
  share_status varchar(32) not null default 'none',
  created_at datetime(3) not null,
  updated_at datetime(3) not null,
  last_opened_at datetime(3) null,
  deleted_at datetime(3) null,
  key idx_personal_sites_user_archive (user_id, archive_status, updated_at),
  key idx_personal_sites_user_category (user_id, category_id),
  key idx_personal_sites_user_path (user_id, bookmark_path_id),
  key idx_personal_sites_user_security (user_id, security_status),
  key idx_personal_sites_user_organize (user_id, organize_status),
  key idx_personal_sites_user_url_hash (user_id, url_hash),
  key idx_personal_sites_source_recommendation (source_recommendation_id),
  key idx_personal_sites_last_opened (user_id, last_opened_at)
);
```

设计说明：

- 个人站点允许同一用户保存重复 URL，所以 `user_id + url_hash` 不做唯一索引。
- `url_hash` 保存规范化 URL 的 SHA-256，避免对 `varchar(2048)` 建长索引。
- 未登录本地数据同步到云端后才写入服务端，因此服务端 `user_id` 为必填。
- 如后续支持匿名云备份，可再引入 `anonymous_client_id`。

枚举：

- `source`：`manual`、`plugin`、`browser_import`、`recommendation`、`json_restore`。
- `security_status`：`unchecked`、`checking`、`safe`、`unreachable`、`risky`、`blocked`。
- `organize_status`：`complete`、`missing_description`、`missing_tags`、`path_pending`、`duplicate_suspected`、`stale`、`link_problem`。
- `archive_status`：`active`、`archived`、`deleted`。
- `share_status`：`none`、`draft`、`pending`、`published`、`rejected`、`removed`。

### 5.2 personal_site_tags

```sql
create table personal_site_tags (
  site_id varchar(36) not null,
  tag_id varchar(36) not null,
  created_at datetime(3) not null,
  primary key (site_id, tag_id),
  key idx_personal_site_tags_tag (tag_id)
);
```

## 6. 推荐库

### 6.1 public_recommendations

```sql
create table public_recommendations (
  id varchar(36) primary key,
  type varchar(32) not null,
  title varchar(255) not null,
  url varchar(2048) not null,
  normalized_url varchar(2048) not null,
  url_hash char(64) not null,
  favicon_url varchar(1024) null,
  description text not null,
  category_id varchar(36) not null,
  parent_id varchar(36) null,
  source varchar(32) not null default 'user_share',
  created_by varchar(36) null,
  security_status varchar(32) not null default 'unchecked',
  review_status varchar(32) not null default 'pending_review',
  publish_status varchar(32) not null default 'draft',
  hot_score decimal(12,4) not null default 0,
  favorite_count int not null default 0,
  open_count int not null default 0,
  reason_count int not null default 0,
  created_at datetime(3) not null,
  updated_at datetime(3) not null,
  published_at datetime(3) null,
  removed_at datetime(3) null,
  merged_to_id varchar(36) null,
  deleted_at datetime(3) null,
  unique key uk_public_recommendations_url_hash (url_hash, deleted_at),
  key idx_public_recommendations_status (publish_status, review_status),
  key idx_public_recommendations_type_category (type, category_id),
  key idx_public_recommendations_parent (parent_id),
  key idx_public_recommendations_hot (publish_status, hot_score),
  key idx_public_recommendations_latest (publish_status, published_at),
  key idx_public_recommendations_merged_to (merged_to_id)
);
```

设计说明：

- 公开推荐库完整 URL 不允许重复创建。
- MySQL 中 `url_hash, deleted_at` 对软删除唯一性不严格，建议 MVP 应用层校验 `url_hash + publish_status != removed/merged`。
- 如果需要数据库强约束，可增加生成列 `active_unique_key` 后续优化。

枚举：

- `type`：`main_site`、`feature_site`。
- `source`：`system`、`user_share`、`admin_created`。
- `publish_status`：`draft`、`pending_review`、`published`、`hidden`、`removed`、`merged`。

### 6.2 public_recommendation_tags

```sql
create table public_recommendation_tags (
  recommendation_id varchar(36) not null,
  tag_id varchar(36) not null,
  created_at datetime(3) not null,
  primary key (recommendation_id, tag_id),
  key idx_public_recommendation_tags_tag (tag_id)
);
```

### 6.3 recommendation_reasons

```sql
create table recommendation_reasons (
  id varchar(36) primary key,
  recommendation_id varchar(36) not null,
  user_id varchar(36) not null,
  display_mode varchar(32) not null default 'real_name',
  content text not null,
  status varchar(32) not null default 'published',
  created_at datetime(3) not null,
  updated_at datetime(3) not null,
  hidden_at datetime(3) null,
  removed_at datetime(3) null,
  unique key uk_recommendation_reasons_user (recommendation_id, user_id),
  key idx_recommendation_reasons_status (status, created_at),
  key idx_recommendation_reasons_user (user_id)
);
```

规则：同一用户对同一推荐对象只保留一条主推荐理由。

## 7. 共享申请

### 7.1 share_applications

```sql
create table share_applications (
  id varchar(36) primary key,
  user_id varchar(36) not null,
  personal_site_id varchar(36) not null,
  target_recommendation_id varchar(36) null,
  share_type varchar(32) not null,
  display_mode varchar(32) not null default 'real_name',
  public_title varchar(255) not null,
  public_url varchar(2048) not null,
  normalized_url varchar(2048) not null,
  url_hash char(64) not null,
  public_description text not null,
  category_id varchar(36) not null,
  parent_recommendation_id varchar(36) null,
  reason text not null,
  status varchar(32) not null default 'draft',
  validation_status varchar(32) not null default 'not_started',
  reviewer_id varchar(36) null,
  review_reason varchar(1000) null,
  created_at datetime(3) not null,
  updated_at datetime(3) not null,
  submitted_at datetime(3) null,
  reviewed_at datetime(3) null,
  published_at datetime(3) null,
  withdrawn_at datetime(3) null,
  deleted_at datetime(3) null,
  key idx_share_applications_user_status (user_id, status),
  key idx_share_applications_site_status (personal_site_id, status),
  key idx_share_applications_review (status, submitted_at),
  key idx_share_applications_url_hash (url_hash),
  key idx_share_applications_target (target_recommendation_id)
);
```

约束：

- 同一个个人站点同一时间只能有一个进行中的共享申请，建议应用层按 `personal_site_id + status in (...)` 校验。
- 进行中状态：`draft`、`validating`、`validation_failed`、`pending_review`。

### 7.2 share_application_tags

```sql
create table share_application_tags (
  share_application_id varchar(36) not null,
  tag_id varchar(36) not null,
  created_at datetime(3) not null,
  primary key (share_application_id, tag_id),
  key idx_share_application_tags_tag (tag_id)
);
```

## 8. 治理与安全

### 8.1 reports

```sql
create table reports (
  id varchar(36) primary key,
  reporter_id varchar(36) not null,
  target_type varchar(32) not null,
  target_id varchar(36) not null,
  reason_type varchar(32) not null,
  reason_text varchar(1000) null,
  status varchar(32) not null default 'pending',
  handler_id varchar(36) null,
  handle_result varchar(1000) null,
  created_at datetime(3) not null,
  handled_at datetime(3) null,
  key idx_reports_target (target_type, target_id),
  key idx_reports_status (status, created_at),
  key idx_reports_reporter (reporter_id, created_at)
);
```

### 8.2 review_records

```sql
create table review_records (
  id varchar(36) primary key,
  target_type varchar(32) not null,
  target_id varchar(36) not null,
  action varchar(32) not null,
  operator_id varchar(36) not null,
  reason varchar(1000) null,
  before_status varchar(32) null,
  after_status varchar(32) null,
  created_at datetime(3) not null,
  key idx_review_records_target (target_type, target_id, created_at),
  key idx_review_records_operator (operator_id, created_at),
  key idx_review_records_action (action, created_at)
);
```

### 8.3 risk_domains

```sql
create table risk_domains (
  id varchar(36) primary key,
  domain varchar(255) not null,
  risk_type varchar(32) not null,
  status varchar(32) not null default 'active',
  note varchar(1000) null,
  created_by varchar(36) not null,
  created_at datetime(3) not null,
  updated_at datetime(3) not null,
  unique key uk_risk_domains_domain (domain),
  key idx_risk_domains_status (status),
  key idx_risk_domains_type (risk_type)
);
```

### 8.4 url_validation_records

```sql
create table url_validation_records (
  id varchar(36) primary key,
  target_type varchar(32) not null,
  target_id varchar(36) not null,
  url varchar(2048) not null,
  normalized_url varchar(2048) not null,
  url_hash char(64) not null,
  status varchar(32) not null,
  http_status int null,
  final_url varchar(2048) null,
  final_url_hash char(64) null,
  redirect_chain json null,
  risk_type varchar(32) null,
  failure_reason varchar(1000) null,
  checked_at datetime(3) null,
  created_at datetime(3) not null,
  key idx_url_validation_target (target_type, target_id, created_at),
  key idx_url_validation_status (status, created_at),
  key idx_url_validation_url_hash (url_hash)
);
```

## 9. 导入导出

### 9.1 import_tasks

```sql
create table import_tasks (
  id varchar(36) primary key,
  user_id varchar(36) not null,
  file_name varchar(255) not null,
  import_type varchar(32) not null,
  import_mode varchar(32) null,
  duplicate_strategy varchar(32) not null default 'keep_all',
  status varchar(32) not null default 'preview',
  total_count int not null default 0,
  success_count int not null default 0,
  duplicate_count int not null default 0,
  skipped_count int not null default 0,
  problem_count int not null default 0,
  created_at datetime(3) not null,
  completed_at datetime(3) null,
  key idx_import_tasks_user (user_id, created_at),
  key idx_import_tasks_status (status, created_at)
);
```

### 9.2 import_items

```sql
create table import_items (
  id varchar(36) primary key,
  import_task_id varchar(36) not null,
  personal_site_id varchar(36) null,
  title varchar(255) null,
  url varchar(2048) not null,
  normalized_url varchar(2048) null,
  url_hash char(64) null,
  source_path varchar(1024) null,
  category_name varchar(80) null,
  bookmark_path varchar(1024) null,
  status varchar(32) not null default 'pending',
  problem_reason varchar(1000) null,
  created_at datetime(3) not null,
  key idx_import_items_task (import_task_id),
  key idx_import_items_status (import_task_id, status),
  key idx_import_items_url_hash (url_hash)
);
```

## 10. 插件同步

### 10.1 client_sync_records

MVP 可不强制落表；如果服务端需要追踪同步记录，可使用以下结构。

```sql
create table client_sync_records (
  id varchar(36) primary key,
  user_id varchar(36) not null,
  client_id varchar(120) not null,
  local_client_id varchar(120) null,
  target_type varchar(32) not null,
  target_local_id varchar(120) null,
  target_server_id varchar(36) null,
  operation varchar(32) not null,
  status varchar(32) not null default 'pending',
  payload json null,
  created_at datetime(3) not null,
  synced_at datetime(3) null,
  key idx_client_sync_user_client (user_id, client_id, created_at),
  key idx_client_sync_status (status, created_at),
  key idx_client_sync_target (target_type, target_server_id)
);
```

## 11. 搜索索引建议

MVP 可先用普通 `like` / `match` 组合实现关键词搜索，后续再接入更强搜索引擎。

建议添加 MySQL FULLTEXT 索引：

```sql
alter table personal_sites
  add fulltext index ft_personal_sites_search (title, url, description, purpose, personal_note);

alter table public_recommendations
  add fulltext index ft_public_recommendations_search (title, url, description);
```

说明：

- 中文分词效果依赖 MySQL ngram parser 配置，MVP 可以先使用关键词 `like`，后续再优化。
- URL / 域名精确匹配优先走 `url_hash` 或单独解析出的域名字段。若搜索域名频繁，后续可增加 `domain` 字段和索引。

## 12. 后续待细化

- 是否为所有外键增加数据库级 `foreign key`。MVP 可先应用层维护关系，避免软删除和批量导入复杂化。
- 是否为软删除唯一约束增加生成列，实现数据库级严格唯一。
- 是否单独增加 `domains` 字段以优化域名搜索和风险统计。
- 是否将 `organizeStatus` 改成多值关联表，以支持一个站点同时存在多个待整理原因。
- 是否增加站点打开记录明细表，支持更精细的访问统计。

