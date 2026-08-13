package mx.agua.backend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "envios")
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @Column(nullable = false, unique = true, length = 30)
    private String folio;


    @Column(nullable = false)
    private LocalDateTime fecha;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnvioEstado estado;


    @Column(name = "hora_inicio")
    private LocalDateTime horaInicio;


    @Column(name = "hora_fin")
    private LocalDateTime horaFin;


    @Column(name = "distancia_km", precision = 10, scale = 2)
    private BigDecimal distanciaKm;


    @Column(name = "duracion_minutos")
    private Long duracionMinutos;


    @OneToMany(
            mappedBy = "envio",
            fetch = FetchType.LAZY
    )
    @OrderBy("ordenRuta ASC")
    private List<Pedido> pedidos = new ArrayList<>();


    public Envio() {
    }


    @PrePersist
    public void prePersist() {

        if (fecha == null) {
            fecha = LocalDateTime.now();
        }

        if (estado == null) {
            estado = EnvioEstado.PENDIENTE;
        }

    }


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public String getFolio() {
        return folio;
    }


    public void setFolio(String folio) {
        this.folio = folio;
    }


    public LocalDateTime getFecha() {
        return fecha;
    }


    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }


    public EnvioEstado getEstado() {
        return estado;
    }


    public void setEstado(EnvioEstado estado) {
        this.estado = estado;
    }


    public LocalDateTime getHoraInicio() {
        return horaInicio;
    }


    public void setHoraInicio(LocalDateTime horaInicio) {
        this.horaInicio = horaInicio;
    }


    public LocalDateTime getHoraFin() {
        return horaFin;
    }


    public void setHoraFin(LocalDateTime horaFin) {
        this.horaFin = horaFin;
    }


    public BigDecimal getDistanciaKm() {
        return distanciaKm;
    }


    public void setDistanciaKm(BigDecimal distanciaKm) {
        this.distanciaKm = distanciaKm;
    }


    public Long getDuracionMinutos() {
        return duracionMinutos;
    }


    public void setDuracionMinutos(Long duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }


    public List<Pedido> getPedidos() {
        return pedidos;
    }


    public void setPedidos(List<Pedido> pedidos) {
        this.pedidos = pedidos;
    }

}