package com.cxsearch.api.security;

import com.cxsearch.api.common.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserResolver {
  private final JdbcTemplate jdbcTemplate;
  private final TokenService tokenService;

  public CurrentUserResolver(JdbcTemplate jdbcTemplate, TokenService tokenService) {
    this.jdbcTemplate = jdbcTemplate;
    this.tokenService = tokenService;
  }

  public AuthenticatedUser requireUser(HttpServletRequest request) {
    String authorization = request.getHeader("Authorization");
    if (authorization == null || !authorization.startsWith("Bearer ")) {
      throw ApiException.unauthorized();
    }

    String userId = tokenService.verify(authorization.substring("Bearer ".length()).trim());
    return jdbcTemplate.query("""
            select id, email, nickname, role, status
            from users
            where id = ? and deleted_at is null and status = 'active'
            """,
        resultSet -> {
          if (!resultSet.next()) {
            throw ApiException.unauthorized();
          }
          return new AuthenticatedUser(
              resultSet.getString("id"),
              resultSet.getString("email"),
              resultSet.getString("nickname"),
              resultSet.getString("role"),
              resultSet.getString("status"));
        },
        userId);
  }

  public Map<String, Object> toUserResponse(AuthenticatedUser user) {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("id", user.id());
    response.put("email", user.email());
    response.put("nickname", user.nickname());
    response.put("avatarUrl", null);
    response.put("role", user.role());
    response.put("status", user.status());
    return response;
  }
}
