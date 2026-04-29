package com.cxsearch.api.auth;

import com.cxsearch.api.common.ApiException;
import com.cxsearch.api.common.RequestValues;
import com.cxsearch.api.security.AuthenticatedUser;
import com.cxsearch.api.security.CurrentUserResolver;
import com.cxsearch.api.security.PasswordHasher;
import com.cxsearch.api.security.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final JdbcTemplate jdbcTemplate;
  private final PasswordHasher passwordHasher;
  private final TokenService tokenService;
  private final CurrentUserResolver currentUserResolver;

  public AuthService(
      JdbcTemplate jdbcTemplate,
      PasswordHasher passwordHasher,
      TokenService tokenService,
      CurrentUserResolver currentUserResolver) {
    this.jdbcTemplate = jdbcTemplate;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
    this.currentUserResolver = currentUserResolver;
  }

  public Map<String, Object> register(Map<String, Object> request) {
    String email = requiredEmail(request);
    String username = normalizedUsername(RequestValues.stringOrDefault(request, "username", email.split("@")[0]));
    String password = requiredPassword(request);
    String nickname = RequestValues.stringOrDefault(request, "nickname", username);
    String id = UUID.randomUUID().toString();
    Timestamp now = new Timestamp(System.currentTimeMillis());

    try {
      jdbcTemplate.update("""
              insert into users (id, username, email, password_hash, nickname, role, status, created_at, updated_at)
              values (?, ?, ?, ?, ?, 'user', 'active', ?, ?)
              """,
          id, username, email, passwordHasher.hash(password), nickname, now, now);
    } catch (DuplicateKeyException exception) {
      throw ApiException.conflict("ACCOUNT_EXISTS", "账号或邮箱已被注册");
    }

    return authResponse(loadUser(id));
  }

  public Map<String, Object> login(Map<String, Object> request) {
    String identifier = requiredIdentifier(request);
    String password = requiredPassword(request);
    boolean emailLogin = identifier.contains("@");
    String lookupColumn = emailLogin ? "email" : "username";
    String lookupValue = emailLogin ? identifier.toLowerCase() : normalizedUsername(identifier);

    Map<String, Object> user = jdbcTemplate.query(String.format("""
            select id, username, email, password_hash, nickname, role, status
            from users
            where %s = ? and deleted_at is null
            """, lookupColumn),
        resultSet -> resultSet.next() ? Map.of(
            "id", resultSet.getString("id"),
            "username", resultSet.getString("username"),
            "email", resultSet.getString("email"),
            "passwordHash", resultSet.getString("password_hash"),
            "nickname", resultSet.getString("nickname"),
            "role", resultSet.getString("role"),
            "status", resultSet.getString("status")) : null,
        lookupValue);

    if (user == null || !"active".equals(user.get("status")) || !passwordHasher.matches(password, user.get("passwordHash").toString())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "账号/邮箱或密码不正确");
    }

    jdbcTemplate.update("update users set last_login_at = ?, updated_at = ? where id = ?",
        new Timestamp(System.currentTimeMillis()), new Timestamp(System.currentTimeMillis()), user.get("id"));
    return authResponse(loadUser(user.get("id").toString()));
  }

  public Map<String, Object> me(HttpServletRequest request) {
    AuthenticatedUser user = currentUserResolver.requireUser(request);
    return Map.of("user", currentUserResolver.toUserResponse(user));
  }

  public Map<String, Object> logout() {
    return Map.of("success", true);
  }

  private Map<String, Object> authResponse(AuthenticatedUser user) {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("token", tokenService.create(user.id()));
    response.put("user", currentUserResolver.toUserResponse(user));
    return response;
  }

  private AuthenticatedUser loadUser(String id) {
    return jdbcTemplate.query("""
            select id, username, email, nickname, role, status
            from users
            where id = ? and deleted_at is null
            """,
        resultSet -> {
          if (!resultSet.next()) {
            throw ApiException.notFound("用户不存在");
          }
          return new AuthenticatedUser(
              resultSet.getString("id"),
              resultSet.getString("username"),
              resultSet.getString("email"),
              resultSet.getString("nickname"),
              resultSet.getString("role"),
              resultSet.getString("status"));
        },
        id);
  }

  private String requiredEmail(Map<String, Object> request) {
    String email = RequestValues.string(request, "email");
    if (email == null || email.isBlank() || !email.contains("@")) {
      throw ApiException.badRequest("INVALID_EMAIL", "请填写有效邮箱");
    }
    return email.toLowerCase();
  }

  private String requiredIdentifier(Map<String, Object> request) {
    String identifier = RequestValues.stringOrDefault(request, "identifier", RequestValues.string(request, "email"));
    if (identifier == null || identifier.isBlank()) {
      throw ApiException.badRequest("IDENTIFIER_REQUIRED", "请填写账号或邮箱");
    }
    return identifier.trim();
  }

  private String normalizedUsername(String username) {
    if (username == null) {
      throw ApiException.badRequest("INVALID_USERNAME", "请填写账号");
    }

    String normalized = username.trim().toLowerCase();
    if (!normalized.matches("[a-z0-9][a-z0-9_-]{2,31}")) {
      throw ApiException.badRequest("INVALID_USERNAME", "账号需为 3-32 位字母、数字、下划线或短横线");
    }
    return normalized;
  }

  private String requiredPassword(Map<String, Object> request) {
    String password = RequestValues.string(request, "password");
    if (password == null || password.length() < 6) {
      throw ApiException.badRequest("INVALID_PASSWORD", "密码至少需要 6 位");
    }
    return password;
  }
}
