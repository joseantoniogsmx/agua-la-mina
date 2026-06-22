package mx.agua.backend.repository;

import mx.agua.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository
        extends JpaRepository<Cliente, Integer> {

}