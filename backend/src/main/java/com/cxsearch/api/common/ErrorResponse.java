package com.cxsearch.api.common;

public record ErrorResponse(ApiError error) {

  public static ErrorResponse notImplemented(String feature) {
    return new ErrorResponse(ApiError.of("NOT_IMPLEMENTED", feature + " is not implemented yet"));
  }
}
