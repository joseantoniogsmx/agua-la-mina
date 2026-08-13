package mx.agua.backend.service;

import mx.agua.backend.dto.response.ClienteResponse;
import mx.agua.backend.dto.response.DetallePedidoResponse;
import mx.agua.backend.dto.response.EnvioResponse;
import mx.agua.backend.dto.response.PedidoResponse;
import mx.agua.backend.model.DetallePedido;
import mx.agua.backend.model.Envio;
import mx.agua.backend.model.EnvioEstado;
import mx.agua.backend.model.Pedido;
import mx.agua.backend.repository.EnvioRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EnvioService {

    private final EnvioRepository envioRepository;

    public EnvioService(
            EnvioRepository envioRepository) {

        this.envioRepository = envioRepository;

    }


    /**
     * Crea un nuevo envío a partir de los pedidos
     * que formarán parte de la salida.
     */
    public Envio crearEnvio(
            List<Pedido> pedidos,
            BigDecimal distanciaKm,
            Long duracionMinutos) {

        if (pedidos == null
                || pedidos.isEmpty()) {

            throw new IllegalArgumentException(
                    "No se puede crear un envío sin pedidos."
            );

        }


        Envio envio = new Envio();


        envio.setFolio(
                generarFolio()
        );


        envio.setEstado(
                EnvioEstado.EN_RUTA
        );


        envio.setDistanciaKm(
                distanciaKm
        );


        envio.setDuracionMinutos(
                duracionMinutos
        );


        /*
         * Asociamos los pedidos al envío.
         */
        for (Pedido pedido : pedidos) {

            pedido.setEnvio(envio);

        }


        envio.setPedidos(pedidos);


        return envioRepository.save(envio);

    }


    /**
     * Obtiene todos los envíos como DTO.
     */
    public List<EnvioResponse> listar() {

        return envioRepository
                .findAllByOrderByFechaDesc()
                .stream()
                .map(this::convertirEnvio)
                .toList();

    }


    /**
     * Busca un envío por ID.
     */
    public EnvioResponse buscarPorId(Integer id) {

        Envio envio =
                envioRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Envío no encontrado"
                                )
                        );

        return convertirEnvio(envio);

    }


    /**
     * Busca un envío por folio.
     */
    public EnvioResponse buscarPorFolio(
            String folio) {

        Envio envio =
                envioRepository
                        .findByFolio(folio)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Envío no encontrado"
                                )
                        );

        return convertirEnvio(envio);

    }


    /**
     * Obtiene los envíos que tienen un estado determinado.
     */
    public List<EnvioResponse> listarPorEstado(
            EnvioEstado estado) {

        return envioRepository
                .findByEstadoOrderByFechaDesc(estado)
                .stream()
                .map(this::convertirEnvio)
                .toList();

    }


    /**
     * Convierte una entidad Envio en
     * un EnvioResponse.
     */
    private EnvioResponse convertirEnvio(
            Envio envio) {

        EnvioResponse response =
                new EnvioResponse();


        response.setId(
                envio.getId()
        );


        response.setFolio(
                envio.getFolio()
        );


        response.setFecha(
                envio.getFecha()
        );


        response.setEstado(

                envio.getEstado() != null
                        ? envio.getEstado().name()
                        : null

        );


        response.setHoraInicio(
                envio.getHoraInicio()
        );


        response.setHoraFin(
                envio.getHoraFin()
        );


        response.setDistanciaKm(
                envio.getDistanciaKm()
        );


        response.setDuracionMinutos(
                envio.getDuracionMinutos()
        );


        response.setPedidos(

                envio.getPedidos()
                        .stream()
                        .map(this::convertirPedido)
                        .toList()

        );


        return response;

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


        response.setOrdenRuta(
                pedido.getOrdenRuta()
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
     * Genera un folio único para el envío.
     *
     * Ejemplo:
     *
     * ENV-20260813-001
     */
    private String generarFolio() {

        String fecha =
                LocalDateTime.now()
                        .format(
                                DateTimeFormatter
                                        .ofPattern("yyyyMMdd")
                        );


        long consecutivo =
                envioRepository.count() + 1;


        return String.format(
                "ENV-%s-%03d",
                fecha,
                consecutivo
        );

    }

}