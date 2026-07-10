package mx.agua.backend.service.routing;

import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.service.ConfiguracionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RutaService {

    private final PedidoRepository pedidoRepository;
    private final ConfiguracionService configuracionService;
    private final OsrmService osrmService;

    public RutaService(
            PedidoRepository pedidoRepository,
            ConfiguracionService configuracionService,
            OsrmService osrmService) {

        this.pedidoRepository = pedidoRepository;
        this.configuracionService = configuracionService;
        this.osrmService = osrmService;
    }

    public List<Pedido> generarRuta() {

        Double latPurificadora =
                configuracionService.obtenerLatitudPurificadora();

        Double lonPurificadora =
                configuracionService.obtenerLongitudPurificadora();

        List<Pedido> pedidos =
                pedidoRepository.findByEstado(PedidoEstado.PENDIENTE);

        int orden = 1;

        for (Pedido pedido : pedidos) {

            if (pedido.getCliente() == null
                    || pedido.getCliente().getLatitud() == null
                    || pedido.getCliente().getLongitud() == null) {
                continue;
            }

            // Consulta a OSRM para validar la comunicación
            osrmService.obtenerRuta(
                    latPurificadora,
                    lonPurificadora,
                    pedido.getCliente().getLatitud().doubleValue(),
                    pedido.getCliente().getLongitud().doubleValue()
            );

            pedido.setOrdenRuta(orden++);
            pedido.setEstado(PedidoEstado.EN_RUTA);
        }

        return pedidoRepository.saveAll(pedidos);
    }

}