# CXSearch 后端数据库迁移

当前目录用于存放后端数据库迁移脚本，命名采用 Flyway 风格：`V{版本}__{说明}.sql`。

## 当前脚本

- `V1__init_schema.sql`：根据 `docs/CXSearch-database-design.md` 生成的 MVP 初始 MySQL 8.x 表结构。

## 设计取舍

- MVP 暂不添加数据库级外键，软删除、批量导入、合并和审核流程由应用层维护关系一致性。
- 枚举字段使用 `varchar`，枚举值由后端代码校验，避免早期需求变化导致频繁迁移。
- 个人站点允许同一用户保存重复 URL；公开推荐库完整 URL 去重由应用层结合 `url_hash` 和发布状态校验。
- MySQL 软删除唯一约束中 `deleted_at is null` 不严格唯一，后续可用生成列增强。

## 使用建议

后端项目接入 Spring Boot 后，建议引入 Flyway，并将该目录配置为默认迁移路径：

```properties
spring.flyway.locations=classpath:db/migration
```

当前后端骨架已加入 Flyway 依赖，默认本地配置关闭迁移以便无 MySQL 时启动；启用 `mysql` profile 后会执行该目录下的迁移脚本。
