package com.cxsearch.api.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ErrorResponse> handleApiException(ApiException exception) {
    return ResponseEntity.status(exception.status())
        .body(new ErrorResponse(ApiError.of(exception.code(), exception.getMessage())));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnexpected(Exception exception) {
    return ResponseEntity.internalServerError()
        .body(new ErrorResponse(ApiError.of("INTERNAL_ERROR", exception.getMessage())));
  }
}
