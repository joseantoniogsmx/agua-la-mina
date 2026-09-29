package mx.agua.backend.service;

import mx.agua.backend.model.Usuario;
import mx.agua.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario autenticar(
            String username,
            String password) {

        if (username == null ||
                username.isBlank()) {

            throw new IllegalArgumentException(
                    "El nombre de usuario es obligatorio."
            );
        }

        if (password == null ||
                password.isBlank()) {

            throw new IllegalArgumentException(
                    "La contraseña es obligatoria."
            );
        }

        Usuario usuario =
                usuarioRepository
                        .findByUsername(username.trim())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Usuario o contraseña incorrectos."
                                )
                        );

        if (!Boolean.TRUE.equals(
                usuario.getActivo())) {

            throw new IllegalStateException(
                    "El usuario está desactivado."
            );
        }

        if (!passwordEncoder.matches(
                password,
                usuario.getPassword())) {

            throw new IllegalArgumentException(
                    "Usuario o contraseña incorrectos."
            );
        }

        return usuario;
    }
}