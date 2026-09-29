package mx.agua.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import mx.agua.backend.model.Rol;
import mx.agua.backend.model.Usuario;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    /*
     * IMPORTANTE:
     * Esta clave es temporal para desarrollo.
     *
     * Antes de utilizar el sistema en producción,
     * deberá trasladarse a una variable de entorno
     * o a una configuración segura.
     */
    private static final String SECRET =
            "AguaLaMina-SecretKey-2026-Backend-JWT-Segura";

    private static final long EXPIRACION_MS =
            1000L * 60L * 60L * 8L;

    private final SecretKey key;

    public JwtService() {
        this.key = Keys.hmacShaKeyFor(
                SECRET.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generarToken(Usuario usuario) {

        Instant ahora = Instant.now();

        List<String> roles =
                usuario.getRoles()
                        .stream()
                        .map(Rol::getNombre)
                        .toList();

        return Jwts.builder()
                .subject(usuario.getUsername())
                .claim("usuarioId", usuario.getId())
                .claim("nombre", usuario.getNombre())
                .claim("roles", roles)
                .issuedAt(Date.from(ahora))
                .expiration(
                        Date.from(
                                ahora.plusMillis(
                                        EXPIRACION_MS
                                )
                        )
                )
                .signWith(key)
                .compact();
    }

    public String obtenerUsername(
            String token) {

        return obtenerClaims(token)
                .getSubject();
    }

    public boolean esTokenValido(
            String token) {

        try {

            obtenerClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }

    public Claims obtenerClaims(
            String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}