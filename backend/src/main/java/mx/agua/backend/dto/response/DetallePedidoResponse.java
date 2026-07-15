package mx.agua.backend.dto.response;

import java.math.BigDecimal;

public class DetallePedidoResponse {

    private Integer id;

    private Integer productoId;

    private String marca;

    private BigDecimal capacidadLitros;

    private Integer cantidad;

    private Integer prestados;

    private BigDecimal precioUnitario;

    private BigDecimal subtotal;

    public DetallePedidoResponse() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProductoId() {
        return productoId;
    }

    public void setProductoId(Integer productoId) {
        this.productoId = productoId;
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

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Integer getPrestados() {
        return prestados;
    }

    public void setPrestados(Integer prestados) {
        this.prestados = prestados;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

}