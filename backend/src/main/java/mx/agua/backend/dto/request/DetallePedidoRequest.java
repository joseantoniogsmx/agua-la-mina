package mx.agua.backend.dto.request;

public class DetallePedidoRequest {

    private Integer productoId;

    private Integer cantidad;

    private Integer prestados;

    public DetallePedidoRequest() {
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