package com.cxsearch.api.recommendation;

import com.cxsearch.api.common.ErrorResponse;
import com.cxsearch.api.common.StubResponses;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

  @GetMapping
  public ResponseEntity<ErrorResponse> list(@RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("recommendations.list");
  }

  @GetMapping("/{recommendationId}")
  public ResponseEntity<ErrorResponse> get(@PathVariable String recommendationId) {
    return StubResponses.notImplemented("recommendations.get");
  }

  @PostMapping("/{recommendationId}/collect")
  public ResponseEntity<ErrorResponse> collect(@PathVariable String recommendationId, @RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("recommendations.collect");
  }

  @PostMapping("/{recommendationId}/open")
  public ResponseEntity<ErrorResponse> recordOpen(@PathVariable String recommendationId) {
    return StubResponses.notImplemented("recommendations.open");
  }

  @GetMapping("/{recommendationId}/reasons")
  public ResponseEntity<ErrorResponse> listReasons(@PathVariable String recommendationId, @RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("recommendations.reasons.list");
  }

  @PutMapping("/{recommendationId}/my-reason")
  public ResponseEntity<ErrorResponse> upsertMyReason(@PathVariable String recommendationId, @RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("recommendations.my-reason.upsert");
  }

  @DeleteMapping("/{recommendationId}/my-reason")
  public ResponseEntity<ErrorResponse> deleteMyReason(@PathVariable String recommendationId) {
    return StubResponses.notImplemented("recommendations.my-reason.delete");
  }
}
