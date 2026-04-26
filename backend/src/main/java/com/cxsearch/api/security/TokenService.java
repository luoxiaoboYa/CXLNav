package com.cxsearch.api.security;

import com.cxsearch.api.common.ApiException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TokenService {
  private final String secret;

  public TokenService(@Value("${cxsearch.auth.token-secret:cxsearch-local-dev-secret}") String secret) {
    this.secret = secret;
  }

  public String create(String userId) {
    long expiresAt = Instant.now().plusSeconds(60L * 60L * 24L * 14L).getEpochSecond();
    String payload = userId + ":" + expiresAt;
    String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    return encodedPayload + "." + sign(encodedPayload);
  }

  public String verify(String token) {
    String[] parts = token.split("\\.", 2);
    if (parts.length != 2 || !sign(parts[0]).equals(parts[1])) {
      throw ApiException.unauthorized();
    }

    String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
    String[] values = payload.split(":", 2);
    if (values.length != 2 || Long.parseLong(values[1]) < Instant.now().getEpochSecond()) {
      throw ApiException.unauthorized();
    }
    return values[0];
  }

  private String sign(String value) {
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
      return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException | InvalidKeyException exception) {
      throw new IllegalStateException(exception);
    }
  }
}
