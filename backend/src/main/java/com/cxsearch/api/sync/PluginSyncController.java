package com.cxsearch.api.sync;

import com.cxsearch.api.common.ErrorResponse;
import com.cxsearch.api.common.StubResponses;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/sync/plugin")
public class PluginSyncController {

  @PostMapping
  public ResponseEntity<ErrorResponse> sync(@RequestBody(required = false) Map<String, Object> request) {
    return StubResponses.notImplemented("sync.plugin");
  }

  @GetMapping("/bootstrap")
  public ResponseEntity<ErrorResponse> bootstrap() {
    return StubResponses.notImplemented("sync.plugin.bootstrap");
  }
}
