package com.cxsearch.api.share;

import com.cxsearch.api.common.ErrorResponse;
import com.cxsearch.api.common.StubResponses;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/share-applications")
public class ShareApplicationController {

  @PostMapping("/precheck")
  public ResponseEntity<ErrorResponse> precheck(@RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("share-applications.precheck");
  }

  @GetMapping
  public ResponseEntity<ErrorResponse> list(@RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("share-applications.list");
  }

  @PostMapping
  public ResponseEntity<ErrorResponse> create(@RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("share-applications.create");
  }

  @GetMapping("/{applicationId}")
  public ResponseEntity<ErrorResponse> get(@PathVariable String applicationId) {
    return StubResponses.notImplemented("share-applications.get");
  }

  @PatchMapping("/{applicationId}")
  public ResponseEntity<ErrorResponse> update(@PathVariable String applicationId, @RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("share-applications.update");
  }

  @PostMapping("/{applicationId}/submit")
  public ResponseEntity<ErrorResponse> submit(@PathVariable String applicationId) {
    return StubResponses.notImplemented("share-applications.submit");
  }

  @PostMapping("/{applicationId}/withdraw")
  public ResponseEntity<ErrorResponse> withdraw(@PathVariable String applicationId) {
    return StubResponses.notImplemented("share-applications.withdraw");
  }
}
