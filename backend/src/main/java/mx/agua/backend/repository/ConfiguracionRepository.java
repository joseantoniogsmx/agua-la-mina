package mx.agua.backend.repository;

import mx.agua.backend.model.Configuracion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracionRepository
        extends JpaRepository<Configuracion, String> {
}