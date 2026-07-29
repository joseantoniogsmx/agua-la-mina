package mx.agua.backend.service;

import mx.agua.backend.model.Cliente;
import mx.agua.backend.repository.ClienteRepository;
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

        cliente.setNombre(datos.getNombre());
        cliente.setTelefono(datos.getTelefono());
        cliente.setDireccion(datos.getDireccion());
        cliente.setLatitud(datos.getLatitud());
        cliente.setLongitud(datos.getLongitud());
        cliente.setObservaciones(datos.getObservaciones());
        cliente.setActivo(datos.getActivo());

        return repository.save(cliente);
    }

    public Cliente actualizarUbicacion(Integer id, Cliente datos) {

        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setLatitud(datos.getLatitud());
        cliente.setLongitud(datos.getLongitud());

        return repository.save(cliente);
    }

    public void eliminar(Integer id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado");
        }

        repository.deleteById(id);
    }

}