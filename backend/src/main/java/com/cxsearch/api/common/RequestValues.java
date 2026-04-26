package com.cxsearch.api.common;

import java.util.List;
import java.util.Map;

public final class RequestValues {
  private RequestValues() {
  }

  public static String string(Map<String, Object> request, String key) {
    Object value = request == null ? null : request.get(key);
    return value == null ? null : value.toString().trim();
  }

  public static String stringOrDefault(Map<String, Object> request, String key, String defaultValue) {
    String value = string(request, key);
    return value == null || value.isBlank() ? defaultValue : value;
  }

  public static Integer integer(Map<String, Object> request, String key) {
    Object value = request == null ? null : request.get(key);
    if (value == null || value.toString().isBlank()) {
      return null;
    }
    if (value instanceof Number number) {
      return number.intValue();
    }
    return Integer.parseInt(value.toString());
  }

  @SuppressWarnings("unchecked")
  public static List<String> stringList(Map<String, Object> request, String key) {
    Object value = request == null ? null : request.get(key);
    if (value == null) {
      return List.of();
    }
    if (value instanceof List<?> list) {
      return list.stream().map(Object::toString).toList();
    }
    return List.of(value.toString().split(","));
  }
}
