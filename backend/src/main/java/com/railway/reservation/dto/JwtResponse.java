package com.railway.reservation.dto;

public class JwtResponse {
    private String token;
    private Long id;
    private String fullname;
    private String email;
    private String role;

    public JwtResponse(String token, Long id, String fullname, String email, String role) {
        this.token = token;
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
