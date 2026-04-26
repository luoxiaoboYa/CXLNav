package com.cxsearch.api.taxonomy;

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
@RequestMapping("/api/v1")
public class TaxonomyController {
  private final TaxonomyService taxonomyService;

  public TaxonomyController(TaxonomyService taxonomyService) {
    this.taxonomyService = taxonomyService;
  }

  @GetMapping("/categories")
  public ResponseEntity<Map<String, Object>> listCategories(HttpServletRequest request, @RequestParam Map<String, String> query) {
    return ResponseEntity.ok(taxonomyService.listCategories(request, query));
  }

  @PostMapping("/categories")
  public ResponseEntity<Map<String, Object>> createCategory(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
    return ResponseEntity.ok(taxonomyService.createCategory(request, body));
  }

  @PatchMapping("/categories/{categoryId}")
  public ResponseEntity<Map<String, Object>> updateCategory(HttpServletRequest request, @PathVariable String categoryId, @RequestBody(required = false) Map<String, Object> body) {
    return ResponseEntity.ok(taxonomyService.updateCategory(request, categoryId, body));
  }

  @DeleteMapping("/categories/{categoryId}")
  public ResponseEntity<Map<String, Object>> deleteCategory(HttpServletRequest request, @PathVariable String categoryId) {
    return ResponseEntity.ok(taxonomyService.deleteCategory(request, categoryId));
  }

  @GetMapping("/tags")
  public ResponseEntity<Map<String, Object>> listTags(HttpServletRequest request, @RequestParam Map<String, String> query) {
    return ResponseEntity.ok(taxonomyService.listTags(request, query));
  }

  @PostMapping("/tags")
  public ResponseEntity<Map<String, Object>> createTag(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
    return ResponseEntity.ok(taxonomyService.createTag(request, body));
  }

  @PatchMapping("/tags/{tagId}")
  public ResponseEntity<Map<String, Object>> updateTag(HttpServletRequest request, @PathVariable String tagId, @RequestBody(required = false) Map<String, Object> body) {
    return ResponseEntity.ok(taxonomyService.updateTag(request, tagId, body));
  }

  @DeleteMapping("/tags/{tagId}")
  public ResponseEntity<Map<String, Object>> deleteTag(HttpServletRequest request, @PathVariable String tagId) {
    return ResponseEntity.ok(taxonomyService.deleteTag(request, tagId));
  }

  @PostMapping("/tags/merge")
  public ResponseEntity<Map<String, Object>> mergeTags(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
    return ResponseEntity.ok(taxonomyService.mergeTags(request, body));
  }

  @GetMapping("/bookmark-paths")
  public ResponseEntity<com.cxsearch.api.common.ErrorResponse> listBookmarkPaths(@RequestParam Map<String, String> query) {
    return com.cxsearch.api.common.StubResponses.notImplemented("bookmark-paths.list");
  }

  @PostMapping("/bookmark-paths")
  public ResponseEntity<com.cxsearch.api.common.ErrorResponse> createBookmarkPath(@RequestBody(required = false) Map<String, Object> request) {
    return com.cxsearch.api.common.StubResponses.notImplemented("bookmark-paths.create");
  }

  @PatchMapping("/bookmark-paths/{pathId}")
  public ResponseEntity<com.cxsearch.api.common.ErrorResponse> updateBookmarkPath(@PathVariable String pathId, @RequestBody(required = false) Map<String, Object> request) {
    return com.cxsearch.api.common.StubResponses.notImplemented("bookmark-paths.update");
  }

  @DeleteMapping("/bookmark-paths/{pathId}")
  public ResponseEntity<com.cxsearch.api.common.ErrorResponse> deleteBookmarkPath(@PathVariable String pathId) {
    return com.cxsearch.api.common.StubResponses.notImplemented("bookmark-paths.delete");
  }

  @PostMapping("/bookmark-paths/move")
  public ResponseEntity<com.cxsearch.api.common.ErrorResponse> moveBookmarkPath(@RequestBody(required = false) Map<String, Object> request) {
    return com.cxsearch.api.common.StubResponses.notImplemented("bookmark-paths.move");
  }

  @PostMapping("/bookmark-paths/merge")
  public ResponseEntity<com.cxsearch.api.common.ErrorResponse> mergeBookmarkPaths(@RequestBody(required = false) Map<String, Object> request) {
    return com.cxsearch.api.common.StubResponses.notImplemented("bookmark-paths.merge");
  }
}
