-- CXSearch MVP initial schema.
-- Target database: MySQL 8.x, utf8mb4.
-- Application code owns enum validation and most relationship checks in MVP.

set names utf8mb4;

create table users (
  id varchar(36) primary key,
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
  unique key uk_users_email (email),
  key idx_users_status (status),
  key idx_users_role (role)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
  key idx_personal_sites_last_opened (user_id, last_opened_at),
  fulltext key ft_personal_sites_search (title, url, description, purpose, personal_note)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table personal_site_tags (
  site_id varchar(36) not null,
  tag_id varchar(36) not null,
  created_at datetime(3) not null,
  primary key (site_id, tag_id),
  key idx_personal_site_tags_tag (tag_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
  key idx_public_recommendations_merged_to (merged_to_id),
  fulltext key ft_public_recommendations_search (title, url, description)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table public_recommendation_tags (
  recommendation_id varchar(36) not null,
  tag_id varchar(36) not null,
  created_at datetime(3) not null,
  primary key (recommendation_id, tag_id),
  key idx_public_recommendation_tags_tag (tag_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table share_application_tags (
  share_application_id varchar(36) not null,
  tag_id varchar(36) not null,
  created_at datetime(3) not null,
  primary key (share_application_id, tag_id),
  key idx_share_application_tags_tag (tag_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

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
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;
