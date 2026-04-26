package com.cxsearch;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CxSearchCoreApiTests {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void createsTaxonomyAndPersonalSite() throws Exception {
    JsonNode auth = postJson("/api/v1/auth/register", Map.of(
        "email", "core-api@example.com",
        "password", "password123",
        "nickname", "Core API"));
    String token = auth.get("token").asText();

    JsonNode category = postJson("/api/v1/categories", token, Map.of(
        "name", "开发文档",
        "scope", "personal",
        "sortOrder", 10));
    JsonNode tag = postJson("/api/v1/tags", token, Map.of(
        "name", "文档",
        "scope", "personal"));

    mockMvc.perform(post("/api/v1/personal-sites")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(Map.of(
                "url", "https://router.vuejs.org",
                "title", "Vue Router",
                "description", "Vue 官方路由库",
                "categoryId", category.get("category").get("id").asText(),
                "tagIds", new String[] {tag.get("tag").get("id").asText()}))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.site.title").value("Vue Router"))
        .andExpect(jsonPath("$.site.organizeStatus").value("complete"));

    mockMvc.perform(get("/api/v1/personal-sites")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.total").value(1))
        .andExpect(jsonPath("$.summary.activeCount").value(1));
  }

  private JsonNode postJson(String path, Map<String, Object> body) throws Exception {
    return objectMapper.readTree(mockMvc.perform(post(path)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString());
  }

  private JsonNode postJson(String path, String token, Map<String, Object> body) throws Exception {
    return objectMapper.readTree(mockMvc.perform(post(path)
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString());
  }
}