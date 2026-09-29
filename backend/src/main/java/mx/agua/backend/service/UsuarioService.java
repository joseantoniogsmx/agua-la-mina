package mx.agua.backend.service;

import mx.agua.backend.model.Rol;
import mx.agua.backend.model.Usuario;
import mx.agua.backend.repository.RolRepository;
import mx.agua.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario crearUsuario(
            String nombre,
            String username,
            String password) {

        validarDatosUsuario(
                nombre,
                username,
                password
        );

        if (usuarioRepository.existsByUsername(username)) {
            throw new IllegalArgumentException(
                    "El nombre de usuario ya está registrado."
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(nombre.trim());
        usuario.setUsername(username.trim());
        usuario.setPassword(
                passwordEncoder.encode(password)
        );
        usuario.setActivo(true);

        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario obtenerPorUsername(
            String username) {

        return usuarioRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado."
                        )
                );
    }

    @Transactional(readOnly = true)
    public Usuario obtenerPorId(
            Integer id) {

        return usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado."
                        )
                );
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @Transactional
    public void asignarRol(
            Integer usuarioId,
            Integer rolId) {

        Usuario usuario =
                obtenerPorId(usuarioId);

        Rol rol =
                rolRepository
                        .findById(rolId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rol no encontrado."
                                )
                        );

        usuario.agregarRol(rol);

        usuarioRepository.save(usuario);
    }

    @Transactional
    public void quitarRol(
            Integer usuarioId,
            Integer rolId) {

        Usuario usuario =
                obtenerPorId(usuarioId);

        Rol rol =
                rolRepository
                        .findById(rolId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rol no encontrado."
                                )
                        );

        usuario.quitarRol(rol);

        usuarioRepository.save(usuario);
    }

    @Transactional
    public void cambiarEstado(
            Integer usuarioId,
            boolean activo) {

        Usuario usuario =
                obtenerPorId(usuarioId);

        usuario.setActivo(activo);

        usuarioRepository.save(usuario);
    }

    private void validarDatosUsuario(
            String nombre,
            String username,
            String password) {

        if (nombre == null ||
                nombre.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "El nombre del usuario es obligatorio."
            );
        }

        if (username == null ||
                username.trim().isEmpty()) {

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

        if (password.length() < 8) {

            throw new IllegalArgumentException(
                    "La contraseña debe tener al menos 8 caracteres."
            );
        }
    }
}