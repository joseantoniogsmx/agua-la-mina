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

    /**
     * Crea un pedido nuevo.
     *
     * Todo pedido nuevo comienza en estado PENDIENTE.
     */
    @Transactional
    public Pedido crearPedido(CrearPedidoRequest request) {

        validarRequest(request);

        Cliente cliente =
                obtenerCliente(request.getClienteId());

        Pedido pedido = new Pedido();

        pedido.setCliente(cliente);
        pedido.setPrioridad(request.getPrioridad());
        pedido.setNotas(request.getNotas());
        pedido.setEstado(PedidoEstado.PENDIENTE);

        calcularDetallesYTotal(
                pedido,
                request
        );

        return pedidoRepository.save(pedido);
    }

    /**
     * Obtiene un pedido por su ID.
     */
    @Transactional
    public Pedido obtenerPedido(Integer id) {

        return pedidoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Pedido no encontrado"
                        )
                );
    }

    /**
     * Actualiza un pedido.
     *
     * Solo se pueden modificar pedidos PENDIENTES.
     */
    @Transactional
    public Pedido actualizarPedido(
            Integer id,
            CrearPedidoRequest request) {

        validarRequest(request);

        Pedido pedido = obtenerPedido(id);

        validarPedidoPendiente(
                pedido,
                "No se puede modificar un pedido que ya está en ruta o fue entregado."
        );

        Cliente cliente =
                obtenerCliente(request.getClienteId());

        pedido.setCliente(cliente);
        pedido.setPrioridad(request.getPrioridad());
        pedido.setNotas(request.getNotas());

        /*
         * Se reemplazan los detalles completos del pedido.
         *
         * Pedido utiliza orphanRemoval = true, por lo que
         * los detalles anteriores serán eliminados.
         */
        pedido.getDetalles().clear();

        calcularDetallesYTotal(
                pedido,
                request
        );

        return pedidoRepository.save(pedido);
    }

    /**
     * Elimina un pedido.
     *
     * Solo se pueden eliminar pedidos PENDIENTES.
     */
    @Transactional
    public void eliminarPedido(Integer id) {

        Pedido pedido = obtenerPedido(id);

        validarPedidoPendiente(
                pedido,
                "No se puede eliminar un pedido que ya está en ruta o fue entregado."
        );

        pedidoRepository.delete(pedido);
    }

    /**
     * Valida los datos básicos de una solicitud.
     */
    private void validarRequest(
            CrearPedidoRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "La información del pedido es obligatoria."
            );
        }

        if (request.getClienteId() == null) {
            throw new IllegalArgumentException(
                    "El cliente es obligatorio."
            );
        }

        if (request.getDetalles() == null
                || request.getDetalles().isEmpty()) {

            throw new IllegalArgumentException(
                    "El pedido debe contener al menos un producto."
            );
        }
    }

    /**
     * Obtiene el cliente asociado al pedido.
     */
    private Cliente obtenerCliente(
            Integer clienteId) {

        return clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cliente no encontrado"
                        )
                );
    }

    /**
     * Construye los detalles y calcula el total del pedido.
     */
    private void calcularDetallesYTotal(
            Pedido pedido,
            CrearPedidoRequest request) {

        BigDecimal total = BigDecimal.ZERO;

        for (DetallePedidoRequest item :
                request.getDetalles()) {

            if (item == null) {
                throw new IllegalArgumentException(
                        "Existe un detalle de pedido inválido."
                );
            }

            if (item.getProductoId() == null) {
                throw new IllegalArgumentException(
                        "Cada detalle debe tener un producto."
                );
            }

            if (item.getCantidad() == null
                    || item.getCantidad() <= 0) {

                throw new IllegalArgumentException(
                        "La cantidad debe ser mayor que cero."
                );
            }

            int prestados =
                    item.getPrestados() == null
                            ? 0
                            : item.getPrestados();

            if (prestados < 0) {
                throw new IllegalArgumentException(
                        "Los garrafones prestados no pueden ser negativos."
                );
            }

            if (prestados > item.getCantidad()) {
                throw new IllegalArgumentException(
                        "Los garrafones prestados no pueden superar la cantidad solicitada."
                );
            }

            Producto producto =
                    productoRepository
                            .findById(
                                    item.getProductoId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Producto no encontrado: "
                                                    + item.getProductoId()
                                    )
                            );

            BigDecimal subtotal =
                    producto.getPrecio()
                            .multiply(
                                    BigDecimal.valueOf(
                                            item.getCantidad()
                                    )
                            );

            DetallePedido detalle =
                    new DetallePedido();

            detalle.setProducto(producto);
            detalle.setCantidad(
                    item.getCantidad()
            );
            detalle.setPrestados(prestados);
            detalle.setPrecioUnitario(
                    producto.getPrecio()
            );
            detalle.setSubtotal(subtotal);

            pedido.agregarDetalle(detalle);

            total = total.add(subtotal);
        }

        pedido.setTotal(total);
    }

    /**
     * Verifica que un pedido pueda ser modificado
     * o eliminado.
     */
    private void validarPedidoPendiente(
            Pedido pedido,
            String mensaje) {

        if (pedido.getEstado()
                != PedidoEstado.PENDIENTE) {

            throw new IllegalStateException(
                    mensaje
            );
        }
    }
}