package mx.agua.backend.service;

import mx.agua.backend.model.Configuracion;
import mx.agua.backend.repository.ConfiguracionRepository;
import org.springframework.stereotype.Service;

@Service
public class ConfiguracionService {

    private final ConfiguracionRepository configuracionRepository;

    public ConfiguracionService(ConfiguracionRepository configuracionRepository) {
        this.configuracionRepository = configuracionRepository;
    }

    public String obtenerValor(String clave) {

        return configuracionRepository.findById(clave)
                .map(Configuracion::getValor)
                .orElse(null);
    }

    public Double obtenerLatitudPurificadora() {
        return Double.valueOf(obtenerValor("LAT_PURIFICADORA"));
    }

    public Double obtenerLongitudPurificadora() {
        return Double.valueOf(obtenerValor("LON_PURIFICADORA"));
    }

    public String obtenerTelefonoEmpresa() {
        return obtenerValor("TELEFONO_EMPRESA");
    }

    public String obtenerNombreEmpresa() {
        return obtenerValor("NOMBRE_EMPRESA");
    }

}