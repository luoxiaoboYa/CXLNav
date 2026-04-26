package com.cxsearch.api.site;

import com.cxsearch.api.common.ApiException;
import com.cxsearch.api.common.RequestValues;
import com.cxsearch.api.infrastructure.TimeValues;
import com.cxsearch.api.infrastructure.UrlValues;
import com.cxsearch.api.security.AuthenticatedUser;
import com.cxsearch.api.security.CurrentUserResolver;
import jakarta.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PersonalSiteService {
  private final JdbcTemplate jdbcTemplate;
  private final CurrentUserResolver currentUserResolver;

  public PersonalSiteService(JdbcTemplate jdbcTemplate, CurrentUserResolver currentUserResolver) {
    this.jdbcTemplate = jdbcTemplate;
    this.currentUserResolver = currentUserResolver;
  }

  public Map<String, Object> list(HttpServletRequest request, Map<String, String> query) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    int page = parsePositiveInt(query.get("page"), 1);
    int pageSize = Math.min(parsePositiveInt(query.get("pageSize"), 20), 100);
    List<Object> params = new ArrayList<>();
    String where = buildWhere(user, query, params);
    String orderBy = switch (query.getOrDefault("sort", "latest")) {
      case "recent_opened" -> "last_opened_at desc, updated_at desc";
      case "title" -> "title asc, updated_at desc";
      default -> "updated_at desc";
    };

    Integer total = jdbcTemplate.queryForObject("select count(*) from personal_sites " + where, Integer.class, params.toArray());
    List<Object> listParams = new ArrayList<>(params);
    listParams.add(pageSize);
    listParams.add((page - 1) * pageSize);
    List<Map<String, Object>> items = jdbcTemplate.query("select * from personal_sites " + where + " order by " + orderBy + " limit ? offset ?",
        (resultSet, rowNumber) -> siteDto(resultSet.getString("id")),
        listParams.toArray());

    return Map.of(
        "items", items,
        "page", page,
        "pageSize", pageSize,
        "total", total == null ? 0 : total,
        "summary", summary(user));
  }

  @Transactional
  public Map<String, Object> create(HttpServletRequest request, Map<String, Object> body) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    String url = RequestValues.string(body, "url");
    if (url == null || url.isBlank()) {
      throw ApiException.badRequest("URL_REQUIRED", "站点链接不能为空");
    }
    String normalizedUrl = UrlValues.normalize(url);
    String urlHash = UrlValues.sha256(normalizedUrl);
    String id = UUID.randomUUID().toString();
    List<String> tagIds = RequestValues.stringList(body, "tagIds").stream().filter(value -> !value.isBlank()).toList();
    String description = RequestValues.string(body, "description");
    String organizeStatus = organizeStatus(description, tagIds);
    Timestamp now = TimeValues.nowTimestamp();

    jdbcTemplate.update("""
            insert into personal_sites (
              id, user_id, local_client_id, title, url, normalized_url, url_hash, favicon_url,
              description, purpose, personal_note, category_id, bookmark_path_id, source, source_path,
              security_status, organize_status, archive_status, share_status, created_at, updated_at
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unchecked', ?, 'active', 'none', ?, ?)
            """,
        id,
        user.id(),
        RequestValues.string(body, "localClientId"),
        RequestValues.stringOrDefault(body, "title", normalizedUrl),
        url,
        normalizedUrl,
        urlHash,
        RequestValues.string(body, "faviconUrl"),
        description,
        RequestValues.string(body, "purpose"),
        RequestValues.string(body, "personalNote"),
        RequestValues.string(body, "categoryId"),
        RequestValues.string(body, "bookmarkPathId"),
        RequestValues.stringOrDefault(body, "source", "manual"),
        RequestValues.string(body, "sourcePath"),
        organizeStatus,
        now,
        now);
    syncTags(user, id, tagIds);

    Map<String, Object> response = new LinkedHashMap<>();
    response.put("site", siteDto(id));
    response.put("warnings", duplicateWarnings(user, urlHash, id));
    response.put("recommendationMatch", null);
    return response;
  }

  public Map<String, Object> get(HttpServletRequest request, String siteId) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    ensureOwnedSite(user, siteId);
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("site", siteDto(siteId));
    response.put("recommendationInfo", Map.of("exists", false));
    response.put("validationLatest", null);
    return response;
  }

  @Transactional
  public Map<String, Object> update(HttpServletRequest request, String siteId, Map<String, Object> body) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    Map<String, Object> current = ensureOwnedSite(user, siteId);
    String url = RequestValues.stringOrDefault(body, "url", current.get("url").toString());
    String normalizedUrl = UrlValues.normalize(url);
    String urlHash = UrlValues.sha256(normalizedUrl);
    List<String> tagIds = RequestValues.stringList(body, "tagIds").stream().filter(value -> !value.isBlank()).toList();
    String description = RequestValues.stringOrDefault(body, "description", nullableString(current.get("description")));
    String organizeStatus = organizeStatus(description, tagIds.isEmpty() ? currentTagIds(siteId) : tagIds);

    jdbcTemplate.update("""
            update personal_sites
            set title = ?, url = ?, normalized_url = ?, url_hash = ?, favicon_url = ?, description = ?, purpose = ?,
                personal_note = ?, category_id = ?, bookmark_path_id = ?, organize_status = ?, updated_at = ?
            where id = ? and user_id = ? and deleted_at is null
            """,
        RequestValues.stringOrDefault(body, "title", nullableString(current.get("title"))),
        url,
        normalizedUrl,
        urlHash,
        RequestValues.stringOrDefault(body, "faviconUrl", nullableString(current.get("faviconUrl"))),
        description,
        RequestValues.stringOrDefault(body, "purpose", nullableString(current.get("purpose"))),
        RequestValues.stringOrDefault(body, "personalNote", nullableString(current.get("personalNote"))),
        RequestValues.stringOrDefault(body, "categoryId", nullableString(current.get("categoryId"))),
        RequestValues.stringOrDefault(body, "bookmarkPathId", nullableString(current.get("bookmarkPathId"))),
        organizeStatus,
        TimeValues.nowTimestamp(),
        siteId,
        user.id());
    if (body != null && body.containsKey("tagIds")) {
      syncTags(user, siteId, tagIds);
    }
    return Map.of("site", siteDto(siteId));
  }

  public Map<String, Object> delete(HttpServletRequest request, String siteId, boolean confirmShared) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    Map<String, Object> site = ensureOwnedSite(user, siteId);
    if (!confirmShared && List.of("pending", "published").contains(site.get("shareStatus"))) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "CONFIRM_REQUIRED", "这个站点已共享到推荐库，删除个人站点不会删除公开推荐内容。");
    }
    Timestamp now = TimeValues.nowTimestamp();
    jdbcTemplate.update("""
        update personal_sites
        set archive_status = 'deleted', deleted_at = ?, updated_at = ?
        where id = ? and user_id = ?
        """, now, now, siteId, user.id());
    return Map.of("success", true);
  }

  public Map<String, Object> archive(HttpServletRequest request, String siteId) {
    return updateArchiveStatus(request, siteId, "archived");
  }

  public Map<String, Object> restore(HttpServletRequest request, String siteId) {
    return updateArchiveStatus(request, siteId, "active");
  }

  public Map<String, Object> recordOpen(HttpServletRequest request, String siteId) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    Map<String, Object> site = ensureOwnedSite(user, siteId);
    Timestamp now = TimeValues.nowTimestamp();
    jdbcTemplate.update("update personal_sites set last_opened_at = ?, updated_at = ? where id = ? and user_id = ?", now, now, siteId, user.id());
    return Map.of("url", site.get("url"), "lastOpenedAt", TimeValues.iso(now));
  }

  public Map<String, Object> recheck(HttpServletRequest request, String siteId) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    ensureOwnedSite(user, siteId);
    jdbcTemplate.update("update personal_sites set security_status = 'checking', updated_at = ? where id = ? and user_id = ?",
        TimeValues.nowTimestamp(), siteId, user.id());
    return Map.of("validationTaskId", UUID.randomUUID().toString(), "status", "checking");
  }

  private Map<String, Object> updateArchiveStatus(HttpServletRequest request, String siteId, String archiveStatus) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    ensureOwnedSite(user, siteId);
    jdbcTemplate.update("update personal_sites set archive_status = ?, updated_at = ? where id = ? and user_id = ?",
        archiveStatus, TimeValues.nowTimestamp(), siteId, user.id());
    return Map.of("site", siteDto(siteId));
  }

  private String buildWhere(AuthenticatedUser user, Map<String, String> query, List<Object> params) {
    StringBuilder where = new StringBuilder("where user_id = ? and deleted_at is null");
    params.add(user.id());
    if (query.containsKey("keyword") && !query.get("keyword").isBlank()) {
      where.append(" and (lower(title) like ? or lower(url) like ? or lower(description) like ? or lower(personal_note) like ?)");
      String keyword = "%" + query.get("keyword").toLowerCase() + "%";
      params.add(keyword);
      params.add(keyword);
      params.add(keyword);
      params.add(keyword);
    }
    addEquals(where, params, "category_id", query.get("categoryId"));
    addEquals(where, params, "bookmark_path_id", query.get("bookmarkPathId"));
    addEquals(where, params, "archive_status", query.getOrDefault("archiveStatus", "active"));
    addEquals(where, params, "security_status", query.get("securityStatus"));
    addEquals(where, params, "organize_status", query.get("organizeStatus"));
    addEquals(where, params, "source", query.get("source"));
    if (query.containsKey("tagIds") && !query.get("tagIds").isBlank()) {
      List<String> tagIds = List.of(query.get("tagIds").split(","));
      where.append(" and exists (select 1 from personal_site_tags pst where pst.site_id = personal_sites.id and pst.tag_id in (");
      where.append("?,".repeat(tagIds.size()).replaceAll(",$", ""));
      where.append("))");
      params.addAll(tagIds);
    }
    return where.toString();
  }

  private void addEquals(StringBuilder where, List<Object> params, String column, String value) {
    if (value == null || value.isBlank()) {
      return;
    }
    where.append(" and ").append(column).append(" = ?");
    params.add(value);
  }

  private Map<String, Object> ensureOwnedSite(AuthenticatedUser user, String siteId) {
    return jdbcTemplate.query("select * from personal_sites where id = ? and user_id = ? and deleted_at is null",
        resultSet -> {
          if (!resultSet.next()) {
            throw ApiException.notFound("站点不存在");
          }
          return rawSite(resultSet.getString("id"));
        },
        siteId,
        user.id());
  }

  private Map<String, Object> rawSite(String siteId) {
    return jdbcTemplate.query("select * from personal_sites where id = ?",
        resultSet -> {
          if (!resultSet.next()) {
            throw ApiException.notFound("站点不存在");
          }
          Map<String, Object> site = new LinkedHashMap<>();
          site.put("id", resultSet.getString("id"));
          site.put("title", resultSet.getString("title"));
          site.put("url", resultSet.getString("url"));
          site.put("description", resultSet.getString("description"));
          site.put("purpose", resultSet.getString("purpose"));
          site.put("personalNote", resultSet.getString("personal_note"));
          site.put("faviconUrl", resultSet.getString("favicon_url"));
          site.put("categoryId", resultSet.getString("category_id"));
          site.put("bookmarkPathId", resultSet.getString("bookmark_path_id"));
          site.put("shareStatus", resultSet.getString("share_status"));
          return site;
        },
        siteId);
  }

  private Map<String, Object> siteDto(String siteId) {
    return jdbcTemplate.query("select * from personal_sites where id = ?",
        resultSet -> {
          if (!resultSet.next()) {
            throw ApiException.notFound("站点不存在");
          }
          Map<String, Object> dto = new LinkedHashMap<>();
          dto.put("id", resultSet.getString("id"));
          dto.put("title", resultSet.getString("title"));
          dto.put("url", resultSet.getString("url"));
          dto.put("normalizedUrl", resultSet.getString("normalized_url"));
          dto.put("faviconUrl", resultSet.getString("favicon_url"));
          dto.put("description", resultSet.getString("description"));
          dto.put("purpose", resultSet.getString("purpose"));
          dto.put("personalNote", resultSet.getString("personal_note"));
          dto.put("category", categoryDto(resultSet.getString("category_id")));
          dto.put("bookmarkPath", null);
          dto.put("tags", tagDtos(siteId));
          dto.put("source", resultSet.getString("source"));
          dto.put("sourcePath", resultSet.getString("source_path"));
          dto.put("sourceRecommendationId", resultSet.getString("source_recommendation_id"));
          dto.put("securityStatus", resultSet.getString("security_status"));
          dto.put("organizeStatus", resultSet.getString("organize_status"));
          dto.put("archiveStatus", resultSet.getString("archive_status"));
          dto.put("shareStatus", resultSet.getString("share_status"));
          dto.put("createdAt", TimeValues.iso(resultSet.getObject("created_at")));
          dto.put("updatedAt", TimeValues.iso(resultSet.getObject("updated_at")));
          dto.put("lastOpenedAt", TimeValues.iso(resultSet.getObject("last_opened_at")));
          return dto;
        },
        siteId);
  }

  private Map<String, Object> categoryDto(String categoryId) {
    if (categoryId == null) {
      return null;
    }
    return jdbcTemplate.query("select id, name from categories where id = ? and deleted_at is null",
        resultSet -> {
          if (!resultSet.next()) {
            return null;
          }
          return Map.of("id", resultSet.getString("id"), "name", resultSet.getString("name"));
        },
        categoryId);
  }

  private List<Map<String, Object>> tagDtos(String siteId) {
    return jdbcTemplate.query("""
            select t.id, t.name
            from tags t
            join personal_site_tags pst on pst.tag_id = t.id
            where pst.site_id = ? and t.deleted_at is null
            order by t.name asc
            """,
        (resultSet, rowNumber) -> Map.of("id", resultSet.getString("id"), "name", resultSet.getString("name")),
        siteId);
  }

  private List<String> currentTagIds(String siteId) {
    return jdbcTemplate.query("select tag_id from personal_site_tags where site_id = ?",
        (resultSet, rowNumber) -> resultSet.getString("tag_id"), siteId);
  }

  private void syncTags(AuthenticatedUser user, String siteId, List<String> tagIds) {
    List<String> oldTagIds = currentTagIds(siteId);
    jdbcTemplate.update("delete from personal_site_tags where site_id = ?", siteId);
    for (String tagId : tagIds) {
      validateTag(user, tagId);
      try {
        jdbcTemplate.update("insert into personal_site_tags (site_id, tag_id, created_at) values (?, ?, ?)", siteId, tagId, TimeValues.nowTimestamp());
      } catch (DuplicateKeyException ignored) {
      }
    }
    oldTagIds.forEach(this::recalculateUsage);
    tagIds.forEach(this::recalculateUsage);
  }

  private void validateTag(AuthenticatedUser user, String tagId) {
    Integer count = jdbcTemplate.queryForObject("select count(*) from tags where id = ? and user_id = ? and deleted_at is null", Integer.class, tagId, user.id());
    if (count == null || count == 0) {
      throw ApiException.notFound("标签不存在");
    }
  }

  private void recalculateUsage(String tagId) {
    Integer usageCount = jdbcTemplate.queryForObject("select count(*) from personal_site_tags where tag_id = ?", Integer.class, tagId);
    jdbcTemplate.update("update tags set usage_count = ?, updated_at = ? where id = ?", usageCount == null ? 0 : usageCount, TimeValues.nowTimestamp(), tagId);
  }

  private List<Map<String, Object>> duplicateWarnings(AuthenticatedUser user, String urlHash, String currentSiteId) {
    List<String> duplicateIds = jdbcTemplate.query("""
            select id from personal_sites
            where user_id = ? and url_hash = ? and id <> ? and deleted_at is null
            """,
        (resultSet, rowNumber) -> resultSet.getString("id"), user.id(), urlHash, currentSiteId);
    if (duplicateIds.isEmpty()) {
      return List.of();
    }
    return List.of(Map.of(
        "type", "duplicate_personal_site",
        "message", "你已经收藏过这个链接",
        "siteIds", duplicateIds));
  }

  private Map<String, Object> summary(AuthenticatedUser user) {
    Integer activeCount = jdbcTemplate.queryForObject("select count(*) from personal_sites where user_id = ? and archive_status = 'active' and deleted_at is null", Integer.class, user.id());
    Integer archivedCount = jdbcTemplate.queryForObject("select count(*) from personal_sites where user_id = ? and archive_status = 'archived' and deleted_at is null", Integer.class, user.id());
    Integer todoCount = jdbcTemplate.queryForObject("select count(*) from personal_sites where user_id = ? and organize_status <> 'complete' and deleted_at is null", Integer.class, user.id());
    return Map.of(
        "activeCount", activeCount == null ? 0 : activeCount,
        "archivedCount", archivedCount == null ? 0 : archivedCount,
        "todoCount", todoCount == null ? 0 : todoCount);
  }

  private String organizeStatus(String description, List<String> tagIds) {
    if (description == null || description.isBlank()) {
      return "missing_description";
    }
    if (tagIds.isEmpty()) {
      return "missing_tags";
    }
    return "complete";
  }

  private int parsePositiveInt(String value, int defaultValue) {
    if (value == null || value.isBlank()) {
      return defaultValue;
    }
    return Math.max(Integer.parseInt(value), 1);
  }

  private String nullableString(Object value) {
    return value == null ? null : value.toString();
  }
}
