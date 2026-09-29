package mx.agua.backend.controller;

import mx.agua.backend.dto.request.LoginRequest;
import mx.agua.backend.dto.response.LoginResponse;
import mx.agua.backend.model.Rol;
import mx.agua.backend.model.Usuario;
import mx.agua.backend.security.JwtService;
import mx.agua.backend.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService) {

        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            Usuario usuario =
                    authService.autenticar(
                            request.getUsername(),
                            request.getPassword()
                    );

            String token =
                    jwtService.generarToken(
                            usuario
                    );

            List<String> roles =
                    usuario.getRoles()
                            .stream()
                            .map(Rol::getNombre)
                            .toList();

            LoginResponse response =
                    new LoginResponse(
                            token,
                            usuario.getId(),
                            usuario.getNombre(),
                            usuario.getUsername(),
                            roles
                    );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(401)
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .status(403)
                    .body(e.getMessage());
        }
    }
}