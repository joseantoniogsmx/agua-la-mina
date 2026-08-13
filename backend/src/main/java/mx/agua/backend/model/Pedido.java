package mx.agua.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "envio_id")
    private Envio envio;


    @OneToMany(
            mappedBy = "pedido",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<DetallePedido> detalles = new ArrayList<>();


    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;


    @Column(length = 20)
    private String prioridad;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PedidoEstado estado;


    @Column(name = "orden_ruta")
    private Integer ordenRuta;


    @Column(nullable = false)
    private LocalDateTime fecha;


    @Column(length = 50)
    private String origen;


    @Column(columnDefinition = "TEXT")
    private String notas;


    public Pedido() {
    }


    @PrePersist
    public void prePersist() {

        if (fecha == null) {
            fecha = LocalDateTime.now();
        }

        if (estado == null) {
            estado = PedidoEstado.PENDIENTE;
        }

        if (total == null) {
            total = BigDecimal.ZERO;
        }

    }


    public void agregarDetalle(DetallePedido detalle) {

        detalle.setPedido(this);

        detalles.add(detalle);

    }


    public void eliminarDetalle(DetallePedido detalle) {

        detalles.remove(detalle);

        detalle.setPedido(null);

    }


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public Cliente getCliente() {
        return cliente;
    }


    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }


    public Envio getEnvio() {
        return envio;
    }


    public void setEnvio(Envio envio) {
        this.envio = envio;
    }


    public List<DetallePedido> getDetalles() {
        return detalles;
    }


    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }


    public BigDecimal getTotal() {
        return total;
    }


    public void setTotal(BigDecimal total) {
        this.total = total;
    }


    public String getPrioridad() {
        return prioridad;
    }


    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }


    public PedidoEstado getEstado() {
        return estado;
    }


    public void setEstado(PedidoEstado estado) {
        this.estado = estado;
    }


    public Integer getOrdenRuta() {
        return ordenRuta;
    }


    public void setOrdenRuta(Integer ordenRuta) {
        this.ordenRuta = ordenRuta;
    }


    public LocalDateTime getFecha() {
        return fecha;
    }


    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }


    public String getOrigen() {
        return origen;
    }


    public void setOrigen(String origen) {
        this.origen = origen;
    }


    public String getNotas() {
        return notas;
    }


    public void setNotas(String notas) {
        this.notas = notas;
    }

}