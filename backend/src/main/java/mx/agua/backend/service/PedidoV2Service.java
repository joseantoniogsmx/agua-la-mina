package mx.agua.backend.service;

import jakarta.transaction.Transactional;
import mx.agua.backend.dto.request.CrearPedidoRequest;
import mx.agua.backend.dto.request.DetallePedidoRequest;
import mx.agua.backend.model.Cliente;
import mx.agua.backend.model.DetallePedido;
import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.model.Producto;
import mx.agua.backend.repository.ClienteRepository;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PedidoV2Service {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;

    public PedidoV2Service(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            ProductoRepository productoRepository) {

        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional
    public Pedido crearPedido(CrearPedidoRequest request) {

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() ->
                        new RuntimeException("Cliente no encontrado"));

        Pedido pedido = new Pedido();

        pedido.setCliente(cliente);
        pedido.setPrioridad(request.getPrioridad());
        pedido.setNotas(request.getNotas());
        pedido.setEstado(PedidoEstado.PENDIENTE);

        BigDecimal total = BigDecimal.ZERO;

        for (DetallePedidoRequest item : request.getDetalles()) {

            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Producto no encontrado: " + item.getProductoId()));

            DetallePedido detalle = new DetallePedido();

            detalle.setProducto(producto);

            detalle.setCantidad(item.getCantidad());

            detalle.setPrestados(
                    item.getPrestados() == null
                            ? 0
                            : item.getPrestados());

            detalle.setPrecioUnitario(producto.getPrecio());

            BigDecimal subtotal = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(item.getCantidad()));

            detalle.setSubtotal(subtotal);

            pedido.agregarDetalle(detalle);

            total = total.add(subtotal);

        }

        pedido.setTotal(total);

        return pedidoRepository.save(pedido);

    }

}