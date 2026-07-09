package mx.agua.backend.controller;

import mx.agua.backend.model.Pedido;
import mx.agua.backend.model.PedidoEstado;
import mx.agua.backend.repository.PedidoRepository;
import mx.agua.backend.service.PedidoService;
import mx.agua.backend.service.routing.RutaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final PedidoService pedidoService;
    private final RutaService rutaService;

    public PedidoController(
            PedidoRepository pedidoRepository,
            PedidoService pedidoService,
            RutaService rutaService) {

        this.pedidoRepository = pedidoRepository;
        this.pedidoService = pedidoService;
        this.rutaService = rutaService;
    }

    @GetMapping("/pedidos")
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/pedidos/pendientes")
    public List<Pedido> listarPendientes() {
        return pedidoRepository.findByEstado(PedidoEstado.PENDIENTE);
    }

    @PostMapping("/pedidos")
    public ResponseEntity<?> crearPedido(@RequestBody Pedido pedido) {
        return pedidoService.crearPedido(pedido);
    }

    @PostMapping("/pedidos/iniciar-ruta")
    public List<Pedido> iniciarRuta() {
        return rutaService.generarRuta();
    }

    @PutMapping("/pedidos/{id}/entregado")
    public ResponseEntity<Pedido> entregarPedido(@PathVariable Integer id) {
        return pedidoService.entregarPedido(id);
    }

}