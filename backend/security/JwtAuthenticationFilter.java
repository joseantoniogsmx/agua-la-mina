package mx.agua.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import mx.agua.backend.model.Rol;
import mx.agua.backend.model.Usuario;
import mx.agua.backend.repository.UsuarioRepository;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UsuarioRepository usuarioRepository) {

        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                authorizationHeader.substring(7);

        try {

            if (!jwtService.esTokenValido(token)) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            String username =
                    jwtService.obtenerUsername(token);

            Usuario usuario =
                    usuarioRepository
                            .findByUsername(username)
                            .orElse(null);

            if (usuario == null ||
                    !Boolean.TRUE.equals(
                            usuario.getActivo())) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            List<SimpleGrantedAuthority> authorities =
                    usuario.getRoles()
                            .stream()
                            .map(Rol::getNombre)
                            .map(nombre ->
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + nombre
                                    )
                            )
                            .toList();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            usuario.getUsername(),
                            null,
                            authorities
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );

            filterChain.doFilter(
                    request,
                    response
            );

        } catch (Exception e) {

            SecurityContextHolder
                    .clearContext();

            filterChain.doFilter(
                    request,
                    response
            );
        }
    }
}