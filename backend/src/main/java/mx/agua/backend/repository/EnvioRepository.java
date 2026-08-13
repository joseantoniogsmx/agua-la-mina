package mx.agua.backend.repository;

import mx.agua.backend.model.Envio;
import mx.agua.backend.model.EnvioEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnvioRepository
        extends JpaRepository<Envio, Integer> {

    Optional<Envio> findByFolio(String folio);

    List<Envio> findByEstadoOrderByFechaDesc(
            EnvioEstado estado
    );

    List<Envio> findAllByOrderByFechaDesc();

}