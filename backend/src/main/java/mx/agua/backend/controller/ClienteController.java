package mx.agua.backend.controller;

import mx.agua.backend.model.Cliente;
import mx.agua.backend.repository.ClienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @GetMapping("/clientes")
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    @PostMapping("/clientes")
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @PutMapping("/clientes/{id}/ubicacion")
    public ResponseEntity<Cliente> actualizarUbicacion(
            @PathVariable Integer id,
            @RequestBody Cliente datosUbicacion) {

        return clienteRepository.findById(id)
                .map(cliente -> {

                    cliente.setLatitud(datosUbicacion.getLatitud());
                    cliente.setLongitud(datosUbicacion.getLongitud());

                    clienteRepository.save(cliente);

                    return ResponseEntity.ok(cliente);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}