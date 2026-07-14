package mx.agua.backend.dto;

public class CrearPedidoDetalleDTO {

    private Integer productoId;

    private Integer cantidad;

    private Integer prestados;

    public CrearPedidoDetalleDTO() {
    }

    public Integer getProductoId() {
        return productoId;
    }

    public void setProductoId(Integer productoId) {
        this.productoId = productoId;
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

}