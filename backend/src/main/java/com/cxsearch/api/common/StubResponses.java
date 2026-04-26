package com.cxsearch.api.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class StubResponses {

  private StubResponses() {
  }

  public static ResponseEntity<ErrorResponse> notImplemented(String feature) {
    return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(ErrorResponse.notImplemented(feature));
  }
}
