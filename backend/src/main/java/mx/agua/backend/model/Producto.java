package mx.agua.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;

    private String marca;

    @Column(name = "capacidad_litros")
    private BigDecimal capacidadLitros;

    private BigDecimal precio;

    @Column(name = "requiere_envase")
    private Boolean requiereEnvase;

    @Column(name = "color_principal")
    private String colorPrincipal;

    private String imagen;

    @Column(name = "orden_visual")
    private Integer ordenVisual;

    private Boolean activo;

    public Producto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public BigDecimal getCapacidadLitros() {
        return capacidadLitros;
    }

    public void setCapacidadLitros(BigDecimal capacidadLitros) {
        this.capacidadLitros = capacidadLitros;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Boolean getRequiereEnvase() {
        return requiereEnvase;
    }

    public void setRequiereEnvase(Boolean requiereEnvase) {
        this.requiereEnvase = requiereEnvase;
    }

    public String getColorPrincipal() {
        return colorPrincipal;
    }

    public void setColorPrincipal(String colorPrincipal) {
        this.colorPrincipal = colorPrincipal;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Integer getOrdenVisual() {
        return ordenVisual;
    }

    public void setOrdenVisual(Integer ordenVisual) {
        this.ordenVisual = ordenVisual;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}