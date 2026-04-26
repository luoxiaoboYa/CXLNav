# CXSearch Backend

CXSearch 后端 MVP 服务，基于 Spring Boot + Maven。当前已从 Controller 占位推进到核心个人站点链路：账号、分类、标签、个人站点可直接使用内存 H2 本地运行，也可启用 MySQL + Flyway。

## 环境要求

- JDK 21+
- Maven 3.8+
- MySQL 8.x（启用 `mysql` profile 时需要）

## 本地启动

默认配置使用内存 H2，并关闭 Flyway；应用启动时会自动初始化核心表，便于先验证接口：

```bash
mvn spring-boot:run
```

健康检查：

```bash
curl http://localhost:8080/api/v1/system/health
curl http://localhost:8080/actuator/health
```

## 已可用接口

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/categories?scope=personal`
- `POST /api/v1/categories`
- `PATCH /api/v1/categories/{categoryId}`
- `DELETE /api/v1/categories/{categoryId}`
- `GET /api/v1/tags?scope=personal`
- `POST /api/v1/tags`
- `PATCH /api/v1/tags/{tagId}`
- `DELETE /api/v1/tags/{tagId}`
- `POST /api/v1/tags/merge`
- `GET /api/v1/personal-sites`
- `POST /api/v1/personal-sites`
- `GET /api/v1/personal-sites/{siteId}`
- `PATCH /api/v1/personal-sites/{siteId}`
- `DELETE /api/v1/personal-sites/{siteId}?confirmShared=true`
- `POST /api/v1/personal-sites/{siteId}/archive`
- `POST /api/v1/personal-sites/{siteId}/restore`
- `POST /api/v1/personal-sites/{siteId}/open`
- `POST /api/v1/personal-sites/{siteId}/recheck`

其他 MVP 接口仍保留 Controller 边界，当前返回 `501 NOT_IMPLEMENTED`。

## 鉴权

注册和登录返回 `token`，后续私有接口使用：

```http
Authorization: Bearer <token>
```

当前是 MVP 本地令牌实现，用于打通接口联调；生产级刷新、吊销、OAuth 后续再补。

## 使用 MySQL + Flyway

先创建数据库和账号，示例：

```sql
create database cxsearch character set utf8mb4 collate utf8mb4_0900_ai_ci;
create user 'cxsearch'@'%' identified by 'cxsearch';
grant all privileges on cxsearch.* to 'cxsearch'@'%';
flush privileges;
```

使用 `mysql` profile 启动后，Flyway 会读取 `classpath:db/migration` 并执行 `V1__init_schema.sql`：

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

可通过环境变量覆盖连接信息：

```bash
CXSEARCH_DATASOURCE_URL=jdbc:mysql://localhost:3306/cxsearch?useUnicode=true\&characterEncoding=utf8\&connectionTimeZone=UTC\&forceConnectionTimeZoneToSession=true
CXSEARCH_DATASOURCE_USERNAME=cxsearch
CXSEARCH_DATASOURCE_PASSWORD=cxsearch
```

## 校验命令

```bash
mvn test
```