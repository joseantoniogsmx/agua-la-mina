package mx.agua.backend.service.routing;

import mx.agua.backend.service.routing.dto.OsrmResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OsrmService {

    private final WebClient webClient;

    public OsrmService(WebClient webClient) {
        this.webClient = webClient;
    }

    public OsrmResponse obtenerRuta(
            double latOrigen,
            double lonOrigen,
            double latDestino,
            double lonDestino) {

        String url =
                "https://router.project-osrm.org/route/v1/driving/"
                        + lonOrigen + "," + latOrigen + ";"
                        + lonDestino + "," + latDestino
                        + "?overview=false";

        return webClient
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(OsrmResponse.class)
                .block();
    }

}