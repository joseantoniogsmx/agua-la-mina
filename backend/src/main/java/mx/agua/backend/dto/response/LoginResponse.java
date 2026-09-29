package mx.agua.backend.dto.response;

import java.util.List;

public class LoginResponse {

    private String token;
    private Integer usuarioId;
    private String nombre;
    private String username;
    private List<String> roles;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            Integer usuarioId,
            String nombre,
            String username,
            List<String> roles) {

        this.token = token;
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.username = username;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}