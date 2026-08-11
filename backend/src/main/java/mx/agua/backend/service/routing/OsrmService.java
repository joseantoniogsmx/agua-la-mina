package mx.agua.backend.service.routing;

import mx.agua.backend.model.Pedido;
import mx.agua.backend.service.routing.dto.OsrmResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class OsrmService {

    private final WebClient webClient;


    public OsrmService(WebClient webClient) {

        this.webClient = webClient;

    }


    /**
     * ==========================================================
     * RUTA SIMPLE
     * ==========================================================
     *
     * Mantiene compatibilidad con el OsrmController existente.
     *
     * Permite calcular:
     *
     * origen → destino
     */
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


    /**
     * ==========================================================
     * RUTA CON VARIOS PEDIDOS
     * ==========================================================
     *
     * Calcula una ruta comenzando en la purificadora
     * y pasando por los pedidos en el orden recibido.
     *
     * Ejemplo:
     *
     * Purificadora
     *      ↓
     * Pedido 1
     *      ↓
     * Pedido 2
     *      ↓
     * Pedido 3
     */
    public OsrmResponse obtenerRuta(

            double latOrigen,
            double lonOrigen,
            List<Pedido> pedidos) {


        if (pedidos == null || pedidos.isEmpty()) {

            throw new IllegalArgumentException(

                    "No hay pedidos para calcular la ruta."

            );

        }


        StringBuilder coordenadas =

                new StringBuilder();


        /*
         * OSRM utiliza el formato:
         *
         * longitud,latitud
         */

        coordenadas

                .append(lonOrigen)

                .append(",")

                .append(latOrigen);


        for (Pedido pedido : pedidos) {


            if (pedido == null) {

                throw new IllegalArgumentException(

                        "La lista contiene un pedido inválido."

                );

            }


            if (pedido.getCliente() == null) {

                throw new IllegalStateException(

                        "El pedido "
                                + pedido.getId()
                                + " no tiene cliente."

                );

            }


            if (pedido.getCliente().getLatitud() == null

                    || pedido.getCliente().getLongitud() == null) {

                throw new IllegalStateException(

                        "El pedido "
                                + pedido.getId()
                                + " no tiene coordenadas."

                );

            }


            coordenadas

                    .append(";")

                    .append(

                            pedido.getCliente()

                                    .getLongitud()

                    )

                    .append(",")

                    .append(

                            pedido.getCliente()

                                    .getLatitud()

                    );

        }


        String url =

                "https://router.project-osrm.org/route/v1/driving/"

                        + coordenadas

                        + "?overview=false";


        return webClient

                .get()

                .uri(url)

                .retrieve()

                .bodyToMono(OsrmResponse.class)

                .block();

    }

}