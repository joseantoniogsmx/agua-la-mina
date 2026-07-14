package mx.agua.backend.controller;

import mx.agua.backend.dto.CrearPedidoRequest;
import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.model.Producto;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.repository.ProductoRepository;
import mx.agua.backend.service.PedidoService;
import mx.agua.backend.service.routing.RutaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final RutaService rutaService;
    private final PedidoService pedidoService;

    public PedidoController(
            PedidoRepository pedidoRepository,
            ProductoRepository productoRepository,
            RutaService rutaService,
            PedidoService pedidoService) {

        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.rutaService = rutaService;
        this.pedidoService = pedidoService;
    }

    @GetMapping("/pedidos")
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/pedidos/pendientes")
    public List<Pedido> listarPendientes() {
        return pedidoRepository.findByEstado(PedidoEstado.PENDIENTE);
    }

    /*
     * ==========================================
     * ENDPOINT ANTIGUO
     * Se conserva temporalmente.
     * ==========================================
     */
    @PostMapping("/pedidos")
    public ResponseEntity<?> crearPedido(@RequestBody Pedido pedido) {

        if (pedido.getProducto() == null || pedido.getProducto().getId() == null) {
            return ResponseEntity.badRequest().body("Debe seleccionar un producto.");
        }

        Producto producto = productoRepository
                .findById(pedido.getProducto().getId())
                .orElse(null);

        if (producto == null) {
            return ResponseEntity.badRequest().body("Producto inexistente.");
        }

        pedido.setProducto(producto);

        BigDecimal total = producto.getPrecio()
                .multiply(BigDecimal.valueOf(pedido.getCantidad()));

        pedido.setTotal(total);

        return ResponseEntity.ok(pedidoRepository.save(pedido));
    }

    /*
     * ==========================================
     * NUEVO ENDPOINT (MÚLTIPLES PRODUCTOS)
     * ==========================================
     */
    @PostMapping("/pedidos/v2")
    public ResponseEntity<Pedido> crearPedidoV2(
            @RequestBody CrearPedidoRequest request) {

        Pedido pedido = pedidoService.crearPedido(request);

        return ResponseEntity.ok(pedido);

    }

    @PostMapping("/pedidos/iniciar-ruta")
    public List<Pedido> iniciarRuta() {
        return rutaService.generarRuta();
    }

    @PutMapping("/pedidos/{id}/entregado")
    public ResponseEntity<Pedido> entregarPedido(@PathVariable Integer id) {

        return pedidoRepository.findById(id)
                .map(pedido -> {

                    pedido.setEstado(PedidoEstado.ENTREGADO);

                    pedidoRepository.save(pedido);

                    return ResponseEntity.ok(pedido);

                })
                .orElse(ResponseEntity.notFound().build());

    }

}