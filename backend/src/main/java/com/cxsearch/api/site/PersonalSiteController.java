package com.cxsearch.api.site;

import jakarta.servlet.http.HttpServletRequest;
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
@RequestMapping("/api/v1/personal-sites")
public class PersonalSiteController {
  private final PersonalSiteService personalSiteService;

  public PersonalSiteController(PersonalSiteService personalSiteService) {
    this.personalSiteService = personalSiteService;
  }

  @GetMapping
  public ResponseEntity<Map<String, Object>> list(HttpServletRequest request, @RequestParam Map<String, String> query) {
    return ResponseEntity.ok(personalSiteService.list(request, query));
  }

  @PostMapping
  public ResponseEntity<Map<String, Object>> create(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
    return ResponseEntity.ok(personalSiteService.create(request, body));
  }

  @GetMapping("/{siteId}")
  public ResponseEntity<Map<String, Object>> get(HttpServletRequest request, @PathVariable String siteId) {
    return ResponseEntity.ok(personalSiteService.get(request, siteId));
  }

  @PatchMapping("/{siteId}")
  public ResponseEntity<Map<String, Object>> update(HttpServletRequest request, @PathVariable String siteId, @RequestBody(required = false) Map<String, Object> body) {
    return ResponseEntity.ok(personalSiteService.update(request, siteId, body));
  }

  @DeleteMapping("/{siteId}")
  public ResponseEntity<Map<String, Object>> delete(HttpServletRequest request, @PathVariable String siteId, @RequestParam(defaultValue = "false") boolean confirmShared) {
    return ResponseEntity.ok(personalSiteService.delete(request, siteId, confirmShared));
  }

  @PostMapping("/{siteId}/archive")
  public ResponseEntity<Map<String, Object>> archive(HttpServletRequest request, @PathVariable String siteId) {
    return ResponseEntity.ok(personalSiteService.archive(request, siteId));
  }

  @PostMapping("/{siteId}/restore")
  public ResponseEntity<Map<String, Object>> restore(HttpServletRequest request, @PathVariable String siteId) {
    return ResponseEntity.ok(personalSiteService.restore(request, siteId));
  }

  @PostMapping("/{siteId}/open")
  public ResponseEntity<Map<String, Object>> recordOpen(HttpServletRequest request, @PathVariable String siteId) {
    return ResponseEntity.ok(personalSiteService.recordOpen(request, siteId));
  }

  @PostMapping("/{siteId}/recheck")
  public ResponseEntity<Map<String, Object>> recheck(HttpServletRequest request, @PathVariable String siteId) {
    return ResponseEntity.ok(personalSiteService.recheck(request, siteId));
  }
}
