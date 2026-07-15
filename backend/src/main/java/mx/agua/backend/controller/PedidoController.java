package mx.agua.backend.controller;

import mx.agua.backend.dto.request.CrearPedidoRequest;
import mx.agua.backend.dto.response.ClienteResponse;
import mx.agua.backend.dto.response.DetallePedidoResponse;
import mx.agua.backend.dto.response.PedidoResponse;
import mx.agua.backend.model.DetallePedido;
import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.service.PedidoV2Service;
import mx.agua.backend.service.routing.RutaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final RutaService rutaService;
    private final PedidoV2Service pedidoV2Service;

    public PedidoController(
            PedidoRepository pedidoRepository,
            RutaService rutaService,
            PedidoV2Service pedidoV2Service) {

        this.pedidoRepository = pedidoRepository;
        this.rutaService = rutaService;
        this.pedidoV2Service = pedidoV2Service;

    }

    @GetMapping
    public List<PedidoResponse> listarPedidos() {

        return pedidoRepository.findAll()
                .stream()
                .map(this::convertirPedido)
                .collect(Collectors.toList());

    }

    @GetMapping("/pendientes")
    public List<PedidoResponse> listarPendientes() {

        return pedidoRepository.findByEstado(PedidoEstado.PENDIENTE)
                .stream()
                .map(this::convertirPedido)
                .collect(Collectors.toList());

    }

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(
            @RequestBody CrearPedidoRequest request) {

        Pedido pedido = pedidoV2Service.crearPedido(request);

        return ResponseEntity.ok(pedido);

    }

    @PostMapping("/iniciar-ruta")
    public List<Pedido> iniciarRuta() {

        return rutaService.generarRuta();

    }

    @PutMapping("/{id}/entregado")
    public ResponseEntity<Pedido> entregarPedido(
            @PathVariable Integer id) {

        return pedidoRepository.findById(id)
                .map(pedido -> {

                    pedido.setEstado(PedidoEstado.ENTREGADO);

                    pedidoRepository.save(pedido);

                    return ResponseEntity.ok(pedido);

                })
                .orElse(ResponseEntity.notFound().build());

    }

    /*
     * ======================================
     * Conversores Entity -> DTO
     * ======================================
     */

    private PedidoResponse convertirPedido(Pedido pedido) {

        PedidoResponse response = new PedidoResponse();

        response.setId(pedido.getId());

        response.setTotal(pedido.getTotal());

        response.setPrioridad(pedido.getPrioridad());

        response.setEstado(
                pedido.getEstado() != null
                        ? pedido.getEstado().name()
                        : null
        );

        response.setFecha(pedido.getFecha());

        response.setOrigen(pedido.getOrigen());

        response.setNotas(pedido.getNotas());

        if (pedido.getCliente() != null) {

            response.setCliente(

                    new ClienteResponse(

                            pedido.getCliente().getId(),

                            pedido.getCliente().getNombre()

                    )

            );

        }

        response.setDetalles(

                pedido.getDetalles()

                        .stream()

                        .map(this::convertirDetalle)

                        .collect(Collectors.toList())

        );

        return response;

    }
        private DetallePedidoResponse convertirDetalle(
            DetallePedido detalle) {

        DetallePedidoResponse response =
                new DetallePedidoResponse();

        response.setId(detalle.getId());

        if (detalle.getProducto() != null) {

            response.setProductoId(
                    detalle.getProducto().getId()
            );

            response.setMarca(
                    detalle.getProducto().getMarca()
            );

            response.setCapacidadLitros(
                    detalle.getProducto().getCapacidadLitros()
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