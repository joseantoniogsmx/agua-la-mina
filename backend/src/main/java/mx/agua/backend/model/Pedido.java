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

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    /*
     * MODELO ANTIGUO
     * Se mantiene temporalmente para no romper el sistema
     * mientras migramos completamente a DetallePedido.
     */
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private Integer cantidad;

    private BigDecimal total;

    private Integer prestados;

    /*
     * MODELO NUEVO
     */
    @OneToMany(
            mappedBy = "pedido",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<DetallePedido> detalles = new ArrayList<>();

    private String prioridad;

    @Enumerated(EnumType.STRING)
    private PedidoEstado estado;

    @Column(name = "orden_ruta")
    private Integer ordenRuta;

    private LocalDateTime fecha;

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

        if (prioridad == null) {
            prioridad = "NORMAL";
        }

        if (origen == null) {
            origen = "CAJERO";
        }

    }

    /**
     * Mantiene sincronizada la relación bidireccional
     * entre Pedido y DetallePedido.
     */
    public void agregarDetalle(DetallePedido detalle) {

        detalles.add(detalle);
        detalle.setPedido(this);

    }

    /**
     * Elimina un detalle del pedido.
     */
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

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public Integer getPrestados() {
        return prestados;
    }

    public void setPrestados(Integer prestados) {
        this.prestados = prestados;
    }

    public List<DetallePedido> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
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