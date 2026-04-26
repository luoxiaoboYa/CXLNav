package com.cxsearch.api.importexport;

import com.cxsearch.api.common.ErrorResponse;
import com.cxsearch.api.common.StubResponses;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ImportExportController {

  @PostMapping("/imports/bookmarks/parse")
  public ResponseEntity<ErrorResponse> parseBookmarks() {
    return StubResponses.notImplemented("imports.bookmarks.parse");
  }

  @PostMapping("/imports/bookmarks/confirm")
  public ResponseEntity<ErrorResponse> confirmBookmarks(@RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("imports.bookmarks.confirm");
  }

  @GetMapping("/imports")
  public ResponseEntity<ErrorResponse> listImports(@RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("imports.list");
  }

  @GetMapping("/imports/{importTaskId}")
  public ResponseEntity<ErrorResponse> getImport(@PathVariable String importTaskId) {
    return StubResponses.notImplemented("imports.get");
  }

  @GetMapping("/exports/bookmarks.html")
  public ResponseEntity<ErrorResponse> exportBookmarksHtml() {
    return StubResponses.notImplemented("exports.bookmarks-html");
  }

  @GetMapping("/exports/cxsearch.json")
  public ResponseEntity<ErrorResponse> exportCxSearchJson() {
    return StubResponses.notImplemented("exports.cxsearch-json");
  }

  @PostMapping("/imports/cxsearch-json")
  public ResponseEntity<ErrorResponse> importCxSearchJson() {
    return StubResponses.notImplemented("imports.cxsearch-json");
  }
}
