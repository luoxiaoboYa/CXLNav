package com.cxsearch.api.search;

import com.cxsearch.api.common.ErrorResponse;
import com.cxsearch.api.common.StubResponses;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class SearchController {

  @GetMapping("/search")
  public ResponseEntity<ErrorResponse> search(@RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("search.query");
  }

  @GetMapping("/organize-tasks")
  public ResponseEntity<ErrorResponse> listOrganizeTasks(@RequestParam Map<String, String> query) {
    return StubResponses.notImplemented("organize-tasks.list");
  }

  @PostMapping("/organize-tasks/duplicates/resolve")
  public ResponseEntity<ErrorResponse> resolveDuplicates(@RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("organize-tasks.duplicates.resolve");
  }
}
