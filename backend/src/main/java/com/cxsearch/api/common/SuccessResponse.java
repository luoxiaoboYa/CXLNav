package com.cxsearch.api.common;

public record SuccessResponse(boolean success) {

  public static SuccessResponse ok() {
    return new SuccessResponse(true);
  }
}
