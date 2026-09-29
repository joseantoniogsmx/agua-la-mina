package mx.agua.backend.config;

import mx.agua.backend.model.Rol;
import mx.agua.backend.model.Usuario;
import mx.agua.backend.repository.RolRepository;
import mx.agua.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner inicializarDatos(
            RolRepository rolRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            Rol administrador =
                    crearRolSiNoExiste(
                            rolRepository,
                            "ADMINISTRADOR"
                    );

            Rol cajero =
                    crearRolSiNoExiste(
                            rolRepository,
                            "CAJERO"
                    );

            Rol repartidor =
                    crearRolSiNoExiste(
                            rolRepository,
                            "REPARTIDOR"
                    );

            crearAdministradorSiNoExiste(
                    usuarioRepository,
                    passwordEncoder,
                    administrador
            );
        };
    }

    private Rol crearRolSiNoExiste(
            RolRepository rolRepository,
            String nombre) {

        return rolRepository
                .findByNombre(nombre)
                .orElseGet(() ->
                        rolRepository.save(
                                new Rol(nombre)
                        )
                );
    }

    private void crearAdministradorSiNoExiste(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            Rol rolAdministrador) {

        if (usuarioRepository
                .existsByUsername("admin")) {

            return;
        }

        Usuario usuario =
                new Usuario();

        usuario.setNombre(
                "Administrador"
        );

        usuario.setUsername(
                "admin"
        );

        /*
         * CONTRASEÑA INICIAL DE DESARROLLO
         *
         * Cambiarla después del primer acceso.
         */
        usuario.setPassword(
                passwordEncoder.encode(
                        "AguaLaMina2026"
                )
        );

        usuario.setActivo(true);

        usuario.agregarRol(
                rolAdministrador
        );

        usuarioRepository.save(usuario);
    }
}