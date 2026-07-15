package mx.agua.backend.service;

import mx.agua.backend.dto.request.CrearPedidoRequest;
import mx.agua.backend.dto.request.DetallePedidoRequest;
import mx.agua.backend.model.*;
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

    public Pedido crearPedido(CrearPedidoRequest request) {

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() ->
                        new RuntimeException("Cliente no encontrado."));

        Pedido pedido = new Pedido();

        pedido.setCliente(cliente);
        pedido.setPrioridad(request.getPrioridad());
        pedido.setNotas(request.getNotas());

        BigDecimal total = BigDecimal.ZERO;

        for (DetallePedidoRequest detalleRequest : request.getDetalles()) {

            Producto producto = productoRepository.findById(
                    detalleRequest.getProductoId()
            ).orElseThrow(() ->
                    new RuntimeException("Producto no encontrado."));

            DetallePedido detalle = new DetallePedido();

            detalle.setPedido(pedido);

            detalle.setProducto(producto);

            detalle.setCantidad(detalleRequest.getCantidad());

            detalle.setPrestados(detalleRequest.getPrestados());

            detalle.setPrecioUnitario(producto.getPrecio());

            BigDecimal subtotal =
                    producto.getPrecio().multiply(
                            BigDecimal.valueOf(
                                    detalleRequest.getCantidad()
                            )
                    );

            detalle.setSubtotal(subtotal);

            pedido.getDetalles().add(detalle);

            total = total.add(subtotal);

        }

        pedido.setTotal(total);

        return pedidoRepository.save(pedido);

    }

}