package mx.agua.backend.service;

import mx.agua.backend.dto.CrearPedidoRequest;
import mx.agua.backend.model.Cliente;
import mx.agua.backend.model.DetallePedido;
import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.model.Producto;
import mx.agua.backend.repository.ClienteRepository;
import mx.agua.backend.repository.DetallePedidoRepository;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final DetallePedidoRepository detallePedidoRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ProductoRepository productoRepository,
            ClienteRepository clienteRepository,
            DetallePedidoRepository detallePedidoRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.clienteRepository = clienteRepository;
        this.detallePedidoRepository = detallePedidoRepository;
    }

    /**
     * Genera una ruta simple:
     * primero pedidos URGENTES y después NORMALES,
     * ambos ordenados por fecha.
     */
    public List<Pedido> generarRuta() {

        List<Pedido> urgentes =
                pedidoRepository.findByEstadoAndPrioridadOrderByFechaAsc(
                        PedidoEstado.PENDIENTE,
                        "URGENTE"
                );

        List<Pedido> normales =
                pedidoRepository.findByEstadoAndPrioridadOrderByFechaAsc(
                        PedidoEstado.PENDIENTE,
                        "NORMAL"
                );

        List<Pedido> ruta = new ArrayList<>();

        ruta.addAll(urgentes);
        ruta.addAll(normales);

        int orden = 1;

        for (Pedido pedido : ruta) {

            pedido.setOrdenRuta(orden++);
            pedido.setEstado(PedidoEstado.EN_RUTA);

            pedidoRepository.save(pedido);
        }

        return ruta;
    }

    /**
     * (Preparado para el nuevo modelo de pedidos)
     */
    public Pedido crearPedido(CrearPedidoRequest request) {

        Cliente cliente = clienteRepository
                .findById(request.getClienteId())
                .orElseThrow(() ->
                        new RuntimeException("Cliente no encontrado"));

        Pedido pedido = new Pedido();

        pedido.setCliente(cliente);
        pedido.setPrioridad(request.getPrioridad());
        pedido.setNotas(request.getNotas());

        BigDecimal totalGeneral = BigDecimal.ZERO;

        for (var detalleDTO : request.getDetalles()) {

            Producto producto = productoRepository
                    .findById(detalleDTO.getProductoId())
                    .orElseThrow(() ->
                            new RuntimeException("Producto no encontrado"));

            BigDecimal subtotal = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(detalleDTO.getCantidad()));

            DetallePedido detalle = new DetallePedido();

            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrestados(detalleDTO.getPrestados());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(subtotal);

            pedido.agregarDetalle(detalle);

            totalGeneral = totalGeneral.add(subtotal);

        }

        pedido.setTotal(totalGeneral);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        return pedidoGuardado;

    }

}