package com.cxsearch.api.infrastructure;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class LocalSchemaInitializer implements ApplicationRunner {
  private final JdbcTemplate jdbcTemplate;

  public LocalSchemaInitializer(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (hasUsersTable()) {
      return;
    }

    jdbcTemplate.execute("""
        create table users (
          id varchar(36) primary key,
          email varchar(255) not null unique,
          password_hash varchar(255) not null,
          nickname varchar(80) not null,
          avatar_url varchar(1024),
          role varchar(32) not null default 'user',
          status varchar(32) not null default 'active',
          created_at timestamp not null,
          updated_at timestamp not null,
          last_login_at timestamp,
          deleted_at timestamp
        )
        """);
    jdbcTemplate.execute("""
        create table categories (
          id varchar(36) primary key,
          user_id varchar(36),
          scope varchar(32) not null,
          name varchar(80) not null,
          sort_order int not null default 0,
          created_at timestamp not null,
          updated_at timestamp not null,
          deleted_at timestamp
        )
        """);
    jdbcTemplate.execute("create index idx_categories_user_scope on categories(user_id, scope)");
    jdbcTemplate.execute("""
        create table tags (
          id varchar(36) primary key,
          user_id varchar(36),
          scope varchar(32) not null,
          name varchar(80) not null,
          usage_count int not null default 0,
          created_at timestamp not null,
          updated_at timestamp not null,
          deleted_at timestamp
        )
        """);
    jdbcTemplate.execute("create index idx_tags_user_scope on tags(user_id, scope)");
    jdbcTemplate.execute("""
        create table personal_sites (
          id varchar(36) primary key,
          user_id varchar(36) not null,
          local_client_id varchar(80),
          title varchar(255),
          url varchar(2048) not null,
          normalized_url varchar(2048) not null,
          url_hash char(64) not null,
          favicon_url varchar(1024),
          description clob,
          purpose varchar(500),
          personal_note clob,
          category_id varchar(36),
          bookmark_path_id varchar(36),
          source varchar(32) not null default 'manual',
          source_path varchar(1024),
          source_recommendation_id varchar(36),
          security_status varchar(32) not null default 'unchecked',
          organize_status varchar(32) not null default 'complete',
          archive_status varchar(32) not null default 'active',
          share_status varchar(32) not null default 'none',
          created_at timestamp not null,
          updated_at timestamp not null,
          last_opened_at timestamp,
          deleted_at timestamp
        )
        """);
    jdbcTemplate.execute("create index idx_personal_sites_user_archive on personal_sites(user_id, archive_status, updated_at)");
    jdbcTemplate.execute("create index idx_personal_sites_user_url_hash on personal_sites(user_id, url_hash)");
    jdbcTemplate.execute("""
        create table personal_site_tags (
          site_id varchar(36) not null,
          tag_id varchar(36) not null,
          created_at timestamp not null,
          primary key (site_id, tag_id)
        )
        """);
  }

  private boolean hasUsersTable() {
    try {
      jdbcTemplate.queryForObject("select count(*) from users", Integer.class);
      return true;
    } catch (RuntimeException exception) {
      return false;
    }
  }
}
