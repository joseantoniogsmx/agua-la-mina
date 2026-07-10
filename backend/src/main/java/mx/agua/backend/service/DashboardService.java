package mx.agua.backend.service;

import mx.agua.backend.dto.DashboardDTO;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.repository.ClienteRepository;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final PedidoRepository pedidoRepository;

    public DashboardService(
            ClienteRepository clienteRepository,
            ProductoRepository productoRepository,
            PedidoRepository pedidoRepository) {

        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
        this.pedidoRepository = pedidoRepository;
    }

    public DashboardDTO obtenerDashboard() {

        DashboardDTO dashboard = new DashboardDTO();

        dashboard.setClientes(
                clienteRepository.count()
        );

        dashboard.setProductos(
                productoRepository.count()
        );

        dashboard.setPedidosPendientes(
                pedidoRepository.countByEstado(PedidoEstado.PENDIENTE)
        );

        dashboard.setPedidosEnRuta(
                pedidoRepository.countByEstado(PedidoEstado.EN_RUTA)
        );

        dashboard.setPedidosEntregados(
                pedidoRepository.countByEstado(PedidoEstado.ENTREGADO)
        );

        BigDecimal ventas = pedidoRepository.obtenerVentasTotales();

        dashboard.setVentasTotales(ventas);

        return dashboard;
    }

}