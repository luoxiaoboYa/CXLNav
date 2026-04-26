package com.cxsearch.api.infrastructure;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Locale;

public final class UrlValues {
  private UrlValues() {
  }

  public static String normalize(String url) {
    if (url == null || url.isBlank()) {
      return null;
    }
    String candidate = url.trim();
    if (!candidate.matches("^[a-zA-Z][a-zA-Z0-9+.-]*://.*")) {
      candidate = "https://" + candidate;
    }
    try {
      URI uri = new URI(candidate);
      String scheme = uri.getScheme() == null ? "https" : uri.getScheme().toLowerCase(Locale.ROOT);
      String host = uri.getHost() == null ? "" : uri.getHost().toLowerCase(Locale.ROOT);
      int port = uri.getPort();
      String path = uri.getRawPath() == null || uri.getRawPath().isBlank() ? "/" : uri.getRawPath();
      String query = uri.getRawQuery();
      return new URI(scheme, uri.getRawUserInfo(), host, port, path, query, null).toString();
    } catch (URISyntaxException exception) {
      return candidate;
    }
  }

  public static String sha256(String value) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException exception) {
      throw new IllegalStateException(exception);
    }
  }
}
