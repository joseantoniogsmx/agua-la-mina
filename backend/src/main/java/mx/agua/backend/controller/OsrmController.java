package mx.agua.backend.controller;

import mx.agua.backend.service.routing.OsrmService;
import mx.agua.backend.service.routing.dto.OsrmResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OsrmController {

    private final OsrmService osrmService;

    public OsrmController(OsrmService osrmService) {
        this.osrmService = osrmService;
    }

    @GetMapping("/osrm/prueba")
    public OsrmResponse prueba() {

        return osrmService.obtenerRuta(
                19.893916,
                -100.984136,
                19.900000,
                -100.980000
        );

    }

}