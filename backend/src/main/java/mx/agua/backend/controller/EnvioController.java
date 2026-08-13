package mx.agua.backend.controller;

import mx.agua.backend.dto.response.EnvioResponse;
import mx.agua.backend.model.EnvioEstado;
import mx.agua.backend.service.EnvioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/envios")
@CrossOrigin(origins = "*")
public class EnvioController {

    private final EnvioService envioService;

    public EnvioController(
            EnvioService envioService) {

        this.envioService = envioService;

    }


    /**
     * Lista todos los envíos.
     */
    @GetMapping
    public List<EnvioResponse> listar() {

        return envioService.listar();

    }


    /**
     * Obtiene un envío por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(
            @PathVariable Integer id) {

        try {

            return ResponseEntity.ok(
                    envioService.buscarPorId(id)
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .status(404)
                    .body(ex.getMessage());

        }

    }


    /**
     * Obtiene un envío por folio.
     */
    @GetMapping("/folio/{folio}")
    public ResponseEntity<?> buscarPorFolio(
            @PathVariable String folio) {

        try {

            return ResponseEntity.ok(
                    envioService.buscarPorFolio(folio)
            );

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .status(404)
                    .body(ex.getMessage());

        }

    }


    /**
     * Lista envíos por estado.
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> listarPorEstado(
            @PathVariable String estado) {

        try {

            EnvioEstado envioEstado =
                    EnvioEstado.valueOf(
                            estado.toUpperCase()
                    );

            return ResponseEntity.ok(
                    envioService.listarPorEstado(
                            envioEstado
                    )
            );

        } catch (IllegalArgumentException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Estado de envío no válido: "
                                    + estado
                    );

        }

    }

}