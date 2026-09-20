package mx.agua.backend.controller;

import mx.agua.backend.dto.request.CrearPedidoRequest;
import mx.agua.backend.dto.response.ClienteResponse;
import mx.agua.backend.dto.response.DetallePedidoResponse;
import mx.agua.backend.dto.response.PedidoResponse;
import mx.agua.backend.model.DetallePedido;
import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.service.PedidoService;
import mx.agua.backend.service.PedidoV2Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final PedidoService pedidoService;
    private final PedidoV2Service pedidoV2Service;

    public PedidoController(
            PedidoRepository pedidoRepository,
            PedidoService pedidoService,
            PedidoV2Service pedidoV2Service) {

        this.pedidoRepository = pedidoRepository;
        this.pedidoService = pedidoService;
        this.pedidoV2Service = pedidoV2Service;
    }


    @GetMapping
    public List<PedidoResponse> listarPedidos() {

        return pedidoRepository
                .findAll()
                .stream()
                .map(this::convertirPedido)
                .toList();
    }


    @GetMapping("/pendientes")
    public List<PedidoResponse> listarPendientes() {

        return pedidoRepository
                .findByEstado(PedidoEstado.PENDIENTE)
                .stream()
                .map(this::convertirPedido)
                .toList();
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPedido(
            @PathVariable Integer id) {

        try {

            Pedido pedido =
                    pedidoV2Service.obtenerPedido(id);

            return ResponseEntity.ok(
                    convertirPedido(pedido)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    @PostMapping
    public ResponseEntity<?> crearPedido(
            @RequestBody CrearPedidoRequest request) {

        try {

            Pedido pedido =
                    pedidoV2Service.crearPedido(request);

            return ResponseEntity.ok(
                    convertirPedido(pedido)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPedido(
            @PathVariable Integer id,
            @RequestBody CrearPedidoRequest request) {

        try {

            Pedido pedido =
                    pedidoV2Service.actualizarPedido(
                            id,
                            request
                    );

            return ResponseEntity.ok(
                    convertirPedido(pedido)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @PutMapping("/{id}/entregado")
    public ResponseEntity<?> entregarPedido(
            @PathVariable Integer id) {

        try {

            Pedido pedido =
                    pedidoService.marcarComoEntregado(id);

            return ResponseEntity.ok(
                    convertirPedido(pedido)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPedido(
            @PathVariable Integer id) {

        try {

            pedidoV2Service.eliminarPedido(id);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


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


        /*
         * ======================================================
         * ENVÍO / RUTA
         * ======================================================
         *
         * Si el pedido pertenece a un envío,
         * enviamos su identificador al frontend.
         *
         * Esto permitirá acceder directamente
         * a la ruta desde el pedido.
         */

        if (pedido.getEnvio() != null) {

            response.setEnvioId(
                    pedido.getEnvio().getId()
            );

        } else {

            response.setEnvioId(
                    null
            );

        }


        /*
         * ======================================================
         * CLIENTE
         * ======================================================
         */

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


        /*
         * ======================================================
         * DETALLES
         * ======================================================
         */

        response.setDetalles(

                pedido.getDetalles()

                        .stream()

                        .map(
                                this::convertirDetalle
                        )

                        .toList()

        );


        return response;
    }


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

}