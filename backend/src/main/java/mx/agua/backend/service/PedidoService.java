package mx.agua.backend.service;

import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
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

}