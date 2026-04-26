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
    String password = requiredPassword(request);
    String nickname = RequestValues.stringOrDefault(request, "nickname", email.split("@")[0]);
    String id = UUID.randomUUID().toString();
    Timestamp now = new Timestamp(System.currentTimeMillis());

    try {
      jdbcTemplate.update("""
              insert into users (id, email, password_hash, nickname, role, status, created_at, updated_at)
              values (?, ?, ?, ?, 'user', 'active', ?, ?)
              """,
          id, email, passwordHasher.hash(password), nickname, now, now);
    } catch (DuplicateKeyException exception) {
      throw ApiException.conflict("EMAIL_EXISTS", "邮箱已注册");
    }

    return authResponse(loadUser(id));
  }

  public Map<String, Object> login(Map<String, Object> request) {
    String email = requiredEmail(request);
    String password = requiredPassword(request);
    Map<String, Object> user = jdbcTemplate.query("""
            select id, email, password_hash, nickname, role, status
            from users
            where email = ? and deleted_at is null
            """,
        resultSet -> resultSet.next() ? Map.of(
            "id", resultSet.getString("id"),
            "email", resultSet.getString("email"),
            "passwordHash", resultSet.getString("password_hash"),
            "nickname", resultSet.getString("nickname"),
            "role", resultSet.getString("role"),
            "status", resultSet.getString("status")) : null,
        email);

    if (user == null || !"active".equals(user.get("status")) || !passwordHasher.matches(password, user.get("passwordHash").toString())) {
      throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "邮箱或密码不正确");
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
            select id, email, nickname, role, status
            from users
            where id = ? and deleted_at is null
            """,
        resultSet -> {
          if (!resultSet.next()) {
            throw ApiException.notFound("用户不存在");
          }
          return new AuthenticatedUser(
              resultSet.getString("id"),
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

  private String requiredPassword(Map<String, Object> request) {
    String password = RequestValues.string(request, "password");
    if (password == null || password.length() < 6) {
      throw ApiException.badRequest("INVALID_PASSWORD", "密码至少需要 6 位");
    }
    return password;
  }
}
