package mx.agua.backend.repository;

import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    List<Pedido> findByEstado(PedidoEstado estado);

    List<Pedido> findByEstadoOrderByFechaAsc(PedidoEstado estado);

    List<Pedido> findByEstadoAndPrioridadOrderByFechaAsc(
            PedidoEstado estado,
            String prioridad
    );

    long countByEstado(PedidoEstado estado);

    @Query("""
            SELECT COALESCE(SUM(p.total), 0)
            FROM Pedido p
            """)
    BigDecimal obtenerVentasTotales();

}