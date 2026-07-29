package mx.agua.backend.service;

import mx.agua.backend.model.Cliente;
import mx.agua.backend.repository.ClienteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> listar() {
        return repository.findAll();
    }

    public Optional<Cliente> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    public Cliente crear(Cliente cliente) {

        if (cliente.getActivo() == null) {
            cliente.setActivo(true);
        }

        return repository.save(cliente);
    }

    public Cliente actualizar(Integer id, Cliente datos) {

        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // ==========================
        // Datos personales
        // ==========================

        cliente.setNombre(datos.getNombre());
        cliente.setAlias(datos.getAlias());
        cliente.setTelefono(datos.getTelefono());
        cliente.setTipoCliente(datos.getTipoCliente());

        // ==========================
        // Dirección
        // ==========================

        cliente.setDireccion(datos.getDireccion());
        cliente.setCalle(datos.getCalle());
        cliente.setNumeroExterior(datos.getNumeroExterior());
        cliente.setNumeroInterior(datos.getNumeroInterior());
        cliente.setColonia(datos.getColonia());
        cliente.setLocalidad(datos.getLocalidad());
        cliente.setMunicipio(datos.getMunicipio());
        cliente.setEstado(datos.getEstado());
        cliente.setCodigoPostal(datos.getCodigoPostal());
        cliente.setReferencias(datos.getReferencias());

        // ==========================
        // Ubicación
        // ==========================

        cliente.setPlaceId(datos.getPlaceId());
        cliente.setLatitud(datos.getLatitud());
        cliente.setLongitud(datos.getLongitud());

        // ==========================
        // Otros
        // ==========================

        cliente.setObservaciones(datos.getObservaciones());
        cliente.setActivo(datos.getActivo());

        return repository.save(cliente);
    }

    public Cliente actualizarUbicacion(Integer id, Cliente datos) {

        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setDireccion(datos.getDireccion());
        cliente.setPlaceId(datos.getPlaceId());
        cliente.setLatitud(datos.getLatitud());
        cliente.setLongitud(datos.getLongitud());

        return repository.save(cliente);
    }

    public void eliminar(Integer id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado");
        }

        try {

            repository.deleteById(id);

        } catch (DataIntegrityViolationException ex) {

            throw new RuntimeException(
                    "No se puede eliminar este cliente porque tiene pedidos registrados."
            );

        }

    }

}