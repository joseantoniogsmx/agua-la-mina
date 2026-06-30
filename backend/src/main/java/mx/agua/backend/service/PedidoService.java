package mx.agua.backend.service;

import mx.agua.backend.model.Pedido;
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
     * Obtiene la ruta de reparto.
     * Primero aparecen los pedidos urgentes y después
     * los normales, ambos ordenados por fecha.
     */
    public List<Pedido> generarRuta() {

        List<Pedido> urgentes =
                pedidoRepository.findByEstadoAndPrioridadOrderByFechaAsc(
                        "PENDIENTE",
                        "URGENTE"
                );

        List<Pedido> normales =
                pedidoRepository.findByEstadoAndPrioridadOrderByFechaAsc(
                        "PENDIENTE",
                        "NORMAL"
                );

        List<Pedido> ruta = new ArrayList<>();

        ruta.addAll(urgentes);
        ruta.addAll(normales);

        int orden = 1;

        for (Pedido pedido : ruta) {

            pedido.setOrdenRuta(orden++);
            pedido.setEstado("EN_RUTA");

            pedidoRepository.save(pedido);
        }

        return ruta;
    }

}