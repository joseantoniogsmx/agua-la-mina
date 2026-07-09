package mx.agua.backend.service;

import mx.agua.backend.model.Cliente;
import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.model.Producto;
import mx.agua.backend.repository.ClienteRepository;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            ProductoRepository productoRepository) {

        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
    }

    /**
     * Crea un pedido.
     */
    public ResponseEntity<?> crearPedido(Pedido pedido) {

        // ==========================
        // Validar cliente
        // ==========================

        if (pedido.getCliente() == null || pedido.getCliente().getId() == null) {
            return ResponseEntity.badRequest().body("Debe seleccionar un cliente.");
        }

        Cliente cliente = clienteRepository
                .findById(pedido.getCliente().getId())
                .orElse(null);

        if (cliente == null) {
            return ResponseEntity.badRequest().body("Cliente inexistente.");
        }

        // ==========================
        // Validar producto
        // ==========================

        if (pedido.getProducto() == null || pedido.getProducto().getId() == null) {
            return ResponseEntity.badRequest().body("Debe seleccionar un producto.");
        }

        Producto producto = productoRepository
                .findById(pedido.getProducto().getId())
                .orElse(null);

        if (producto == null) {
            return ResponseEntity.badRequest().body("Producto inexistente.");
        }

        // ==========================
        // Validar cantidad
        // ==========================

        if (pedido.getCantidad() == null) {
            return ResponseEntity.badRequest().body("Debe indicar la cantidad.");
        }

        if (pedido.getCantidad() <= 0) {
            return ResponseEntity.badRequest().body("La cantidad debe ser mayor que cero.");
        }

        // ==========================
        // Completar datos
        // ==========================

        pedido.setCliente(cliente);
        pedido.setProducto(producto);
        pedido.setMarca(producto.getMarca());

        BigDecimal total = producto.getPrecio()
                .multiply(BigDecimal.valueOf(pedido.getCantidad()));

        pedido.setTotal(total);

        return ResponseEntity.ok(
                pedidoRepository.save(pedido)
        );
    }

    /**
     * Marca un pedido como entregado.
     */
    public ResponseEntity<Pedido> entregarPedido(Integer id) {

        return pedidoRepository.findById(id)
                .map(pedido -> {

                    pedido.setEstado(PedidoEstado.ENTREGADO);

                    pedidoRepository.save(pedido);

                    return ResponseEntity.ok(pedido);

                })
                .orElse(ResponseEntity.notFound().build());

    }

}