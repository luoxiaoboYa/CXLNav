package com.cxsearch.api.taxonomy;

import com.cxsearch.api.common.ApiException;
import com.cxsearch.api.common.RequestValues;
import com.cxsearch.api.infrastructure.TimeValues;
import com.cxsearch.api.security.AuthenticatedUser;
import com.cxsearch.api.security.CurrentUserResolver;
import jakarta.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class TaxonomyService {
  private final JdbcTemplate jdbcTemplate;
  private final CurrentUserResolver currentUserResolver;

  public TaxonomyService(JdbcTemplate jdbcTemplate, CurrentUserResolver currentUserResolver) {
    this.jdbcTemplate = jdbcTemplate;
    this.currentUserResolver = currentUserResolver;
  }

  public Map<String, Object> listCategories(HttpServletRequest request, Map<String, String> query) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    String scope = query.getOrDefault("scope", "personal");
    List<Map<String, Object>> items = jdbcTemplate.query("""
            select id, scope, name, sort_order, created_at, updated_at
            from categories
            where deleted_at is null and scope = ? and (scope <> 'personal' or user_id = ?)
            order by sort_order asc, created_at asc
            """,
        (resultSet, rowNumber) -> categoryDto(resultSet.getString("id"), resultSet.getString("scope"),
            resultSet.getString("name"), resultSet.getInt("sort_order"), resultSet.getObject("created_at"),
            resultSet.getObject("updated_at")),
        scope,
        user.id());
    return Map.of("items", items, "total", items.size());
  }

  public Map<String, Object> createCategory(HttpServletRequest request, Map<String, Object> body) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    String id = UUID.randomUUID().toString();
    String name = requiredName(body);
    String scope = RequestValues.stringOrDefault(body, "scope", "personal");
    int sortOrder = RequestValues.integer(body, "sortOrder") == null ? 0 : RequestValues.integer(body, "sortOrder");
    Timestamp now = TimeValues.nowTimestamp();
    jdbcTemplate.update("""
            insert into categories (id, user_id, scope, name, sort_order, created_at, updated_at)
            values (?, ?, ?, ?, ?, ?, ?)
            """,
        id, "personal".equals(scope) ? user.id() : null, scope, name, sortOrder, now, now);
    return Map.of("category", getCategory(user, id));
  }

  public Map<String, Object> updateCategory(HttpServletRequest request, String categoryId, Map<String, Object> body) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    Map<String, Object> current = getCategory(user, categoryId);
    String name = RequestValues.stringOrDefault(body, "name", current.get("name").toString());
    Integer sortOrder = RequestValues.integer(body, "sortOrder");
    jdbcTemplate.update("""
            update categories
            set name = ?, sort_order = ?, updated_at = ?
            where id = ? and user_id = ? and deleted_at is null
            """,
        name, sortOrder == null ? current.get("sortOrder") : sortOrder, TimeValues.nowTimestamp(), categoryId, user.id());
    return Map.of("category", getCategory(user, categoryId));
  }

  public Map<String, Object> deleteCategory(HttpServletRequest request, String categoryId) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    getCategory(user, categoryId);
    Timestamp now = TimeValues.nowTimestamp();
    jdbcTemplate.update("update categories set deleted_at = ?, updated_at = ? where id = ? and user_id = ?", now, now, categoryId, user.id());
    jdbcTemplate.update("update personal_sites set category_id = null, updated_at = ? where category_id = ? and user_id = ?", now, categoryId, user.id());
    return Map.of("success", true);
  }

  public Map<String, Object> listTags(HttpServletRequest request, Map<String, String> query) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    String scope = query.getOrDefault("scope", "personal");
    List<Map<String, Object>> items = jdbcTemplate.query("""
            select id, scope, name, usage_count, created_at, updated_at
            from tags
            where deleted_at is null and scope = ? and (scope <> 'personal' or user_id = ?)
            order by usage_count desc, created_at asc
            """,
        (resultSet, rowNumber) -> tagDto(resultSet.getString("id"), resultSet.getString("scope"),
            resultSet.getString("name"), resultSet.getInt("usage_count"), resultSet.getObject("created_at"),
            resultSet.getObject("updated_at")),
        scope,
        user.id());
    return Map.of("items", items, "total", items.size());
  }

  public Map<String, Object> createTag(HttpServletRequest request, Map<String, Object> body) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    String id = UUID.randomUUID().toString();
    String name = requiredName(body);
    String scope = RequestValues.stringOrDefault(body, "scope", "personal");
    Timestamp now = TimeValues.nowTimestamp();
    jdbcTemplate.update("""
            insert into tags (id, user_id, scope, name, usage_count, created_at, updated_at)
            values (?, ?, ?, ?, 0, ?, ?)
            """,
        id, "personal".equals(scope) ? user.id() : null, scope, name, now, now);
    return Map.of("tag", getTag(user, id));
  }

  public Map<String, Object> updateTag(HttpServletRequest request, String tagId, Map<String, Object> body) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    Map<String, Object> current = getTag(user, tagId);
    String name = RequestValues.stringOrDefault(body, "name", current.get("name").toString());
    jdbcTemplate.update("update tags set name = ?, updated_at = ? where id = ? and user_id = ? and deleted_at is null",
        name, TimeValues.nowTimestamp(), tagId, user.id());
    return Map.of("tag", getTag(user, tagId));
  }

  public Map<String, Object> deleteTag(HttpServletRequest request, String tagId) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    getTag(user, tagId);
    Timestamp now = TimeValues.nowTimestamp();
    jdbcTemplate.update("update tags set deleted_at = ?, updated_at = ? where id = ? and user_id = ?", now, now, tagId, user.id());
    jdbcTemplate.update("delete from personal_site_tags where tag_id = ?", tagId);
    recalculateUsage(tagId);
    return Map.of("success", true);
  }

  public Map<String, Object> mergeTags(HttpServletRequest request, Map<String, Object> body) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    String targetTagId = RequestValues.string(body, "targetTagId");
    if (targetTagId == null || targetTagId.isBlank()) {
      throw ApiException.badRequest("TARGET_TAG_REQUIRED", "请选择目标标签");
    }
    getTag(user, targetTagId);
    for (String sourceTagId : RequestValues.stringList(body, "sourceTagIds")) {
      if (sourceTagId.equals(targetTagId)) {
        continue;
      }
      getTag(user, sourceTagId);
      List<String> siteIds = jdbcTemplate.query("select site_id from personal_site_tags where tag_id = ?",
          (resultSet, rowNumber) -> resultSet.getString("site_id"), sourceTagId);
      for (String siteId : siteIds) {
        try {
          jdbcTemplate.update("insert into personal_site_tags (site_id, tag_id, created_at) values (?, ?, ?)",
              siteId, targetTagId, TimeValues.nowTimestamp());
        } catch (DuplicateKeyException ignored) {
        }
      }
      deleteTag(request, sourceTagId);
    }
    recalculateUsage(targetTagId);
    return Map.of("tag", getTag(user, targetTagId));
  }

  private Map<String, Object> getCategory(AuthenticatedUser user, String categoryId) {
    return jdbcTemplate.query("""
            select id, scope, name, sort_order, created_at, updated_at
            from categories
            where id = ? and user_id = ? and deleted_at is null
            """,
        resultSet -> {
          if (!resultSet.next()) {
            throw ApiException.notFound("分类不存在");
          }
          return categoryDto(resultSet.getString("id"), resultSet.getString("scope"), resultSet.getString("name"),
              resultSet.getInt("sort_order"), resultSet.getObject("created_at"), resultSet.getObject("updated_at"));
        },
        categoryId,
        user.id());
  }

  private Map<String, Object> getTag(AuthenticatedUser user, String tagId) {
    return jdbcTemplate.query("""
            select id, scope, name, usage_count, created_at, updated_at
            from tags
            where id = ? and user_id = ? and deleted_at is null
            """,
        resultSet -> {
          if (!resultSet.next()) {
            throw ApiException.notFound("标签不存在");
          }
          return tagDto(resultSet.getString("id"), resultSet.getString("scope"), resultSet.getString("name"),
              resultSet.getInt("usage_count"), resultSet.getObject("created_at"), resultSet.getObject("updated_at"));
        },
        tagId,
        user.id());
  }

  private void recalculateUsage(String tagId) {
    Integer usageCount = jdbcTemplate.queryForObject("select count(*) from personal_site_tags where tag_id = ?", Integer.class, tagId);
    jdbcTemplate.update("update tags set usage_count = ?, updated_at = ? where id = ?", usageCount == null ? 0 : usageCount, TimeValues.nowTimestamp(), tagId);
  }

  private String requiredName(Map<String, Object> body) {
    String name = RequestValues.string(body, "name");
    if (name == null || name.isBlank()) {
      throw ApiException.badRequest("NAME_REQUIRED", "名称不能为空");
    }
    return name;
  }

  private Map<String, Object> categoryDto(String id, String scope, String name, int sortOrder, Object createdAt, Object updatedAt) {
    Map<String, Object> dto = new LinkedHashMap<>();
    dto.put("id", id);
    dto.put("scope", scope);
    dto.put("name", name);
    dto.put("sortOrder", sortOrder);
    dto.put("createdAt", TimeValues.iso(createdAt));
    dto.put("updatedAt", TimeValues.iso(updatedAt));
    return dto;
  }

  private Map<String, Object> tagDto(String id, String scope, String name, int usageCount, Object createdAt, Object updatedAt) {
    Map<String, Object> dto = new LinkedHashMap<>();
    dto.put("id", id);
    dto.put("scope", scope);
    dto.put("name", name);
    dto.put("usageCount", usageCount);
    dto.put("createdAt", TimeValues.iso(createdAt));
    dto.put("updatedAt", TimeValues.iso(updatedAt));
    return dto;
  }
}
