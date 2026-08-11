package mx.agua.backend.controller;

import mx.agua.backend.dto.request.GenerarRutaRequest;
import mx.agua.backend.dto.request.IniciarRutaRequest;
import mx.agua.backend.service.routing.RutaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ruta")
@CrossOrigin(origins = "*")
public class RutaController {

    private final RutaService rutaService;

    public RutaController(RutaService rutaService) {

        this.rutaService = rutaService;

    }


    /**
     * Genera una propuesta de ruta.
     *
     * IMPORTANTE:
     * Esta operación NO modifica el estado
     * de los pedidos.
     */
    @PostMapping("/generar")
    public ResponseEntity<?> generarRuta(
            @RequestBody GenerarRutaRequest request) {

        try {

            return ResponseEntity.ok(
                    rutaService.generarRuta(
                            request.getPedidoIds()
                    )
            );

        } catch (IllegalArgumentException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());

        } catch (IllegalStateException ex) {

            return ResponseEntity
                    .unprocessableEntity()
                    .body(ex.getMessage());

        }

    }


    /**
     * Confirma e inicia una ruta.
     *
     * Esta operación cambia los pedidos
     * seleccionados a EN_RUTA.
     */
    @PostMapping("/iniciar")
    public ResponseEntity<?> iniciarRuta(
            @RequestBody IniciarRutaRequest request) {

        try {

            return ResponseEntity.ok(
                    rutaService.iniciarRuta(
                            request.getPedidoIds()
                    )
            );

        } catch (IllegalArgumentException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());

        } catch (IllegalStateException ex) {

            return ResponseEntity
                    .unprocessableEntity()
                    .body(ex.getMessage());

        }

    }

}