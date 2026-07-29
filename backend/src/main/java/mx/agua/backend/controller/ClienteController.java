package mx.agua.backend.controller;

import mx.agua.backend.model.Cliente;
import mx.agua.backend.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/clientes")
    public List<Cliente> listarClientes() {
        return clienteService.listar();
    }

    @PostMapping("/clientes")
    public ResponseEntity<?> crearCliente(@RequestBody Cliente cliente) {

        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("El nombre es obligatorio.");
        }

        if (cliente.getTelefono() == null || cliente.getTelefono().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("El teléfono es obligatorio.");
        }

        if (cliente.getDireccion() == null || cliente.getDireccion().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("La dirección es obligatoria.");
        }

        Cliente guardado = clienteService.crear(cliente);

        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/clientes/{id}")
    public ResponseEntity<?> actualizarCliente(
            @PathVariable Integer id,
            @RequestBody Cliente cliente) {

        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("El nombre es obligatorio.");
        }

        if (cliente.getTelefono() == null || cliente.getTelefono().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("El teléfono es obligatorio.");
        }

        if (cliente.getDireccion() == null || cliente.getDireccion().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("La dirección es obligatoria.");
        }

        try {

            Cliente actualizado =
                    clienteService.actualizar(id, cliente);

            return ResponseEntity.ok(actualizado);

        } catch (RuntimeException ex) {

            return ResponseEntity.status(404)
                    .body(ex.getMessage());

        }

    }

    @PutMapping("/clientes/{id}/ubicacion")
    public ResponseEntity<?> actualizarUbicacion(
            @PathVariable Integer id,
            @RequestBody Cliente datosUbicacion) {

        try {

            Cliente actualizado =
                    clienteService.actualizarUbicacion(id, datosUbicacion);

            return ResponseEntity.ok(actualizado);

        } catch (RuntimeException ex) {

            return ResponseEntity.status(404)
                    .body(ex.getMessage());

        }

    }

    @DeleteMapping("/clientes/{id}")
    public ResponseEntity<?> eliminarCliente(
            @PathVariable Integer id) {

        try {

            clienteService.eliminar(id);

            return ResponseEntity.noContent().build();

        } catch (RuntimeException ex) {

            return ResponseEntity.status(404)
                    .body(ex.getMessage());

        }

    }

}