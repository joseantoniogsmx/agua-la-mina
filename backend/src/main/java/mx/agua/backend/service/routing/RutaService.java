package mx.agua.backend.service.routing;

import mx.agua.backend.dto.response.ClienteResponse;
import mx.agua.backend.dto.response.DetallePedidoResponse;
import mx.agua.backend.dto.response.PedidoResponse;
import mx.agua.backend.dto.response.RutaResponse;
import mx.agua.backend.model.DetallePedido;
import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.service.ConfiguracionService;
import mx.agua.backend.service.routing.dto.OsrmResponse;
import mx.agua.backend.service.routing.dto.Route;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RutaService {

    private final PedidoRepository pedidoRepository;

    private final ConfiguracionService configuracionService;

    private final OsrmService osrmService;


    public RutaService(
            PedidoRepository pedidoRepository,
            ConfiguracionService configuracionService,
            OsrmService osrmService) {

        this.pedidoRepository = pedidoRepository;

        this.configuracionService = configuracionService;

        this.osrmService = osrmService;

    }


    /**
     * Genera una propuesta de ruta únicamente con
     * los pedidos seleccionados por el conductor.
     *
     * IMPORTANTE:
     *
     * Este método NO cambia el estado de los pedidos.
     */
    public RutaResponse generarRuta(
            List<Integer> pedidoIds) {

        List<Pedido> pedidosSeleccionados =
                obtenerPedidosValidos(pedidoIds);


        Double latPurificadora =
                configuracionService
                        .obtenerLatitudPurificadora();

        Double lonPurificadora =
                configuracionService
                        .obtenerLongitudPurificadora();


        /*
         * Orden inicial por distancia aproximada
         * desde la purificadora.
         */
        List<Pedido> pedidosOrdenados =
                new ArrayList<>(
                        pedidosSeleccionados
                );


        pedidosOrdenados.sort(

                Comparator.comparingDouble(

                        pedido -> calcularDistanciaCuadrada(

                                latPurificadora,

                                lonPurificadora,

                                pedido.getCliente()
                                        .getLatitud(),

                                pedido.getCliente()
                                        .getLongitud()

                        )

                )

        );


        /*
         * Asignamos el orden solamente a la
         * propuesta.
         *
         * Todavía no se guarda en la base de datos.
         */
        int orden = 1;

        for (Pedido pedido : pedidosOrdenados) {

            pedido.setOrdenRuta(orden++);

        }


        /*
         * Consultamos OSRM con todos los puntos.
         */
        OsrmResponse osrmResponse =

                osrmService.obtenerRuta(

                        latPurificadora,

                        lonPurificadora,

                        pedidosOrdenados

                );


        if (osrmResponse == null) {

            throw new IllegalStateException(
                    "No fue posible obtener la ruta."
            );

        }


        if (!"Ok".equalsIgnoreCase(
                osrmResponse.getCode())) {

            throw new IllegalStateException(
                    "OSRM no pudo calcular la ruta."
            );

        }


        if (osrmResponse.getRoutes() == null
                || osrmResponse.getRoutes().isEmpty()) {

            throw new IllegalStateException(
                    "OSRM no devolvió una ruta válida."
            );

        }


        Route ruta =

                osrmResponse
                        .getRoutes()
                        .get(0);


        BigDecimal distanciaKm =

                BigDecimal.valueOf(
                        ruta.getDistance() / 1000.0
                )
                .setScale(
                        2,
                        RoundingMode.HALF_UP
                );


        long duracionMinutos =

                Math.round(
                        ruta.getDuration() / 60.0
                );


        List<PedidoResponse> respuestas =

                pedidosOrdenados
                        .stream()
                        .map(this::convertirPedido)
                        .toList();


        return new RutaResponse(

                respuestas,

                distanciaKm,

                duracionMinutos

        );

    }


    /**
     * Confirma e inicia una ruta.
     *
     * Solamente los pedidos seleccionados pasan
     * de PENDIENTE a EN_RUTA.
     */
    public List<Pedido> iniciarRuta(
            List<Integer> pedidoIds) {

        List<Pedido> pedidos =
                obtenerPedidosValidos(pedidoIds);


        /*
         * Ordenamos nuevamente los pedidos para
         * garantizar que el orden almacenado sea
         * consistente con la propuesta.
         */
        Double latPurificadora =
                configuracionService
                        .obtenerLatitudPurificadora();

        Double lonPurificadora =
                configuracionService
                        .obtenerLongitudPurificadora();


        pedidos.sort(

                Comparator.comparingDouble(

                        pedido -> calcularDistanciaCuadrada(

                                latPurificadora,

                                lonPurificadora,

                                pedido.getCliente()
                                        .getLatitud(),

                                pedido.getCliente()
                                        .getLongitud()

                        )

                )

        );


        int orden = 1;

        for (Pedido pedido : pedidos) {

            pedido.setOrdenRuta(orden++);

            pedido.setEstado(
                    PedidoEstado.EN_RUTA
            );

        }


        return pedidoRepository.saveAll(pedidos);

    }


    /**
     * Obtiene y valida los pedidos seleccionados.
     *
     * Esta validación se utiliza tanto al generar
     * como al iniciar una ruta.
     */
    private List<Pedido> obtenerPedidosValidos(
            List<Integer> pedidoIds) {

        if (pedidoIds == null
                || pedidoIds.isEmpty()) {

            throw new IllegalArgumentException(
                    "Debe seleccionar al menos un pedido."
            );

        }


        Double latPurificadora =
                configuracionService
                        .obtenerLatitudPurificadora();

        Double lonPurificadora =
                configuracionService
                        .obtenerLongitudPurificadora();


        if (latPurificadora == null
                || lonPurificadora == null) {

            throw new IllegalStateException(
                    "La ubicación de la purificadora no está configurada."
            );

        }


        List<Pedido> pedidos =
                new ArrayList<>();


        for (Integer pedidoId : pedidoIds) {

            if (pedidoId == null) {

                continue;

            }


            Pedido pedido =

                    pedidoRepository
                            .findById(pedidoId)
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "No existe el pedido con ID "
                                                    + pedidoId
                                    )
                            );


            /*
             * Solamente pedidos pendientes.
             */
            if (pedido.getEstado()
                    != PedidoEstado.PENDIENTE) {

                throw new IllegalStateException(
                        "El pedido "
                                + pedido.getId()
                                + " no está pendiente."
                );

            }


            /*
             * El pedido debe tener cliente.
             */
            if (pedido.getCliente() == null) {

                throw new IllegalStateException(
                        "El pedido "
                                + pedido.getId()
                                + " no tiene cliente."
                );

            }


            /*
             * El cliente debe tener coordenadas.
             */
            if (pedido.getCliente().getLatitud() == null
                    || pedido.getCliente().getLongitud() == null) {

                throw new IllegalStateException(
                        "El cliente del pedido "
                                + pedido.getId()
                                + " no tiene una ubicación configurada."
                );

            }


            pedidos.add(pedido);

        }


        if (pedidos.isEmpty()) {

            throw new IllegalArgumentException(
                    "No se seleccionaron pedidos válidos."
            );

        }


        /*
         * Eliminamos IDs duplicados.
         */
        return pedidos
                .stream()
                .distinct()
                .toList();

    }


    /**
     * Convierte un Pedido en PedidoResponse.
     */
    private PedidoResponse convertirPedido(
            Pedido pedido) {

        PedidoResponse response =
                new PedidoResponse();


        response.setId(
                pedido.getId()
        );


        response.setTotal(
                pedido.getTotal()
        );


        response.setPrioridad(
                pedido.getPrioridad()
        );


        response.setEstado(

                pedido.getEstado() != null

                        ? pedido.getEstado().name()

                        : null

        );


        response.setFecha(
                pedido.getFecha()
        );


        response.setOrigen(
                pedido.getOrigen()
        );


        response.setNotas(
                pedido.getNotas()
        );


        if (pedido.getCliente() != null) {

            response.setCliente(

                    new ClienteResponse(

                            pedido.getCliente().getId(),

                            pedido.getCliente().getNombre(),

                            pedido.getCliente().getDireccion(),

                            pedido.getCliente().getLatitud(),

                            pedido.getCliente().getLongitud()

                    )

            );

        }


        response.setDetalles(

                pedido.getDetalles()

                        .stream()

                        .map(this::convertirDetalle)

                        .toList()

        );


        return response;

    }


    /**
     * Convierte un DetallePedido en
     * DetallePedidoResponse.
     */
    private DetallePedidoResponse convertirDetalle(
            DetallePedido detalle) {

        DetallePedidoResponse response =
                new DetallePedidoResponse();


        response.setId(
                detalle.getId()
        );


        if (detalle.getProducto() != null) {

            response.setProductoId(
                    detalle.getProducto().getId()
            );


            response.setMarca(
                    detalle.getProducto().getMarca()
            );


            response.setCapacidadLitros(
                    detalle.getProducto()
                            .getCapacidadLitros()
            );

        }


        response.setCantidad(
                detalle.getCantidad()
        );


        response.setPrestados(
                detalle.getPrestados()
        );


        response.setPrecioUnitario(
                detalle.getPrecioUnitario()
        );


        response.setSubtotal(
                detalle.getSubtotal()
        );


        return response;

    }


    /**
     * Distancia aproximada utilizada para establecer
     * el orden inicial de los pedidos.
     */
    private double calcularDistanciaCuadrada(

            double latOrigen,

            double lonOrigen,

            double latDestino,

            double lonDestino) {

        double diferenciaLatitud =
                latDestino - latOrigen;


        double diferenciaLongitud =
                lonDestino - lonOrigen;


        return (

                diferenciaLatitud
                        * diferenciaLatitud

        ) + (

                diferenciaLongitud
                        * diferenciaLongitud

        );

    }

}