package com.cxsearch.api.infrastructure;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public final class TimeValues {
  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneOffset.UTC);

  private TimeValues() {
  }

  public static Timestamp nowTimestamp() {
    return Timestamp.from(Instant.now());
  }

  public static String iso(Object value) {
    if (value == null) {
      return null;
    }
    if (value instanceof Timestamp timestamp) {
      return FORMATTER.format(timestamp.toInstant());
    }
    if (value instanceof Instant instant) {
      return FORMATTER.format(instant);
    }
    return value.toString();
  }
}
