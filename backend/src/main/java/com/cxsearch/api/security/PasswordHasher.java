package com.cxsearch.api.security;

import com.cxsearch.api.common.ApiException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class PasswordHasher {
  private static final int ITERATIONS = 120_000;
  private static final int KEY_LENGTH = 256;
  private final SecureRandom secureRandom = new SecureRandom();

  public String hash(String password) {
    byte[] salt = new byte[16];
    secureRandom.nextBytes(salt);
    byte[] hash = pbkdf2(password, salt);
    return "pbkdf2$" + ITERATIONS + "$" + Base64.getEncoder().encodeToString(salt) + "$" + Base64.getEncoder().encodeToString(hash);
  }

  public boolean matches(String password, String storedHash) {
    String[] parts = storedHash.split("\\$");
    if (parts.length != 4 || !"pbkdf2".equals(parts[0])) {
      return false;
    }
    byte[] salt = Base64.getDecoder().decode(parts[2]);
    byte[] expected = Base64.getDecoder().decode(parts[3]);
    byte[] actual = pbkdf2(password, salt);
    if (actual.length != expected.length) {
      return false;
    }
    int diff = 0;
    for (int index = 0; index < actual.length; index++) {
      diff |= actual[index] ^ expected[index];
    }
    return diff == 0;
  }

  private byte[] pbkdf2(String password, byte[] salt) {
    try {
      KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
      return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
    } catch (NoSuchAlgorithmException | InvalidKeySpecException exception) {
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "PASSWORD_HASH_FAILED", exception.getMessage());
    }
  }
}
