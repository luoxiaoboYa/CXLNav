package com.cxsearch.api.auth;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<Map<String, Object>> register(@RequestBody(required = false) Map<String, Object> request) {
    return ResponseEntity.ok(authService.register(request));
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@RequestBody(required = false) Map<String, Object> request) {
    return ResponseEntity.ok(authService.login(request));
  }

  @GetMapping("/me")
  public ResponseEntity<Map<String, Object>> me(HttpServletRequest request) {
    return ResponseEntity.ok(authService.me(request));
  }

  @PostMapping("/logout")
  public ResponseEntity<Map<String, Object>> logout() {
    return ResponseEntity.ok(authService.logout());
  }
}
