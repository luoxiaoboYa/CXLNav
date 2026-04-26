package com.cxsearch.api.governance;

import com.cxsearch.api.common.ErrorResponse;
import com.cxsearch.api.common.StubResponses;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class GovernanceController {

  @PostMapping("/reports")
  public ResponseEntity<ErrorResponse> createReport(@RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("reports.create");
  }

  @GetMapping("/reports/my")
  public ResponseEntity<ErrorResponse> listMyReports(@RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("reports.my.list");
  }

  @GetMapping("/url-validations")
  public ResponseEntity<ErrorResponse> listUrlValidations(@RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("url-validations.list");
  }

  @PostMapping("/url-validations/recheck")
  public ResponseEntity<ErrorResponse> recheckUrls(@RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("url-validations.recheck");
  }

  @GetMapping("/admin/reviews")
  public ResponseEntity<ErrorResponse> listReviews(@RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("admin.reviews.list");
  }

  @PostMapping("/admin/reviews/{targetType}/{targetId}/approve")
  public ResponseEntity<ErrorResponse> approveReview(@PathVariable String targetType, @PathVariable String targetId) {
    return StubResponses.notImplemented("admin.reviews.approve");
  }

  @PostMapping("/admin/reviews/{targetType}/{targetId}/reject")
  public ResponseEntity<ErrorResponse> rejectReview(@PathVariable String targetType, @PathVariable String targetId, @RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("admin.reviews.reject");
  }

  @PostMapping("/admin/reviews/{targetType}/{targetId}/hide")
  public ResponseEntity<ErrorResponse> hideReviewTarget(@PathVariable String targetType, @PathVariable String targetId, @RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("admin.reviews.hide");
  }

  @PostMapping("/admin/reviews/{targetType}/{targetId}/restore")
  public ResponseEntity<ErrorResponse> restoreReviewTarget(@PathVariable String targetType, @PathVariable String targetId) {
    return StubResponses.notImplemented("admin.reviews.restore");
  }

  @PostMapping("/admin/recommendations/{recommendationId}/remove")
  public ResponseEntity<ErrorResponse> removeRecommendation(@PathVariable String recommendationId, @RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("admin.recommendations.remove");
  }

  @PostMapping("/admin/recommendations/merge")
  public ResponseEntity<ErrorResponse> mergeRecommendations(@RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("admin.recommendations.merge");
  }

  @GetMapping("/admin/risk-domains")
  public ResponseEntity<ErrorResponse> listRiskDomains(@RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("admin.risk-domains.list");
  }

  @PostMapping("/admin/risk-domains")
  public ResponseEntity<ErrorResponse> createRiskDomain(@RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("admin.risk-domains.create");
  }

  @PatchMapping("/admin/risk-domains/{domainId}")
  public ResponseEntity<ErrorResponse> updateRiskDomain(@PathVariable String domainId, @RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("admin.risk-domains.update");
  }

  @DeleteMapping("/admin/risk-domains/{domainId}")
  public ResponseEntity<ErrorResponse> deleteRiskDomain(@PathVariable String domainId) {
    return StubResponses.notImplemented("admin.risk-domains.delete");
  }
}
