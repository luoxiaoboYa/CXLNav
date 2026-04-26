package com.cxsearch.api.security;

public record AuthenticatedUser(String id, String email, String nickname, String role, String status) {
}
