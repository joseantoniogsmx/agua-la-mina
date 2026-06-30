package mx.agua.backend.repository;

import mx.agua.backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    List<Pedido> findByEstado(String estado);

    List<Pedido> findByEstadoOrderByFechaAsc(String estado);

    List<Pedido> findByEstadoAndPrioridadOrderByFechaAsc(
            String estado,
            String prioridad
    );

    Optional<Pedido> findById(Integer id);

}