package mx.agua.backend.controller;

import mx.agua.backend.model.Cliente;
import mx.agua.backend.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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

        String error = validarCliente(cliente);

        if (error != null) {
            return ResponseEntity.badRequest().body(error);
        }

        construirDireccion(cliente);

        Cliente guardado = clienteService.crear(cliente);

        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/clientes/{id}")
    public ResponseEntity<?> actualizarCliente(
            @PathVariable Integer id,
            @RequestBody Cliente cliente) {

        String error = validarCliente(cliente);

        if (error != null) {
            return ResponseEntity.badRequest().body(error);
        }

        construirDireccion(cliente);

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

    /**
     * Valida únicamente los campos realmente obligatorios.
     */
    private String validarCliente(Cliente cliente) {

        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            return "El nombre es obligatorio.";
        }

        if (cliente.getTelefono() == null || cliente.getTelefono().isBlank()) {
            return "El teléfono es obligatorio.";
        }

        if (cliente.getCalle() == null || cliente.getCalle().isBlank()) {
            return "La calle es obligatoria.";
        }

        return null;

    }

    /**
     * Si Google Maps no envía una dirección completa,
     * se genera automáticamente a partir de los campos
     * capturados por el usuario.
     */
    private void construirDireccion(Cliente cliente) {

        if (cliente.getDireccion() != null &&
                !cliente.getDireccion().isBlank()) {
            return;
        }

        List<String> partes = new ArrayList<>();

        agregar(partes, cliente.getCalle());

        if (cliente.getNumeroExterior() != null &&
                !cliente.getNumeroExterior().isBlank()) {

            String numero = cliente.getNumeroExterior();

            if (cliente.getNumeroInterior() != null &&
                    !cliente.getNumeroInterior().isBlank()) {

                numero += " Int. " + cliente.getNumeroInterior();

            }

            partes.add(numero);

        }

        agregar(partes, cliente.getColonia());
        agregar(partes, cliente.getLocalidad());
        agregar(partes, cliente.getMunicipio());
        agregar(partes, cliente.getEstado());
        agregar(partes, cliente.getCodigoPostal());

        cliente.setDireccion(String.join(", ", partes));

    }

    private void agregar(List<String> lista, String valor) {

        if (valor != null && !valor.isBlank()) {
            lista.add(valor.trim());
        }

    }

}