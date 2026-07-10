package mx.agua.backend.dto;

import java.math.BigDecimal;

public class DashboardDTO {

    private long clientes;

    private long productos;

    private long pedidosPendientes;

    private long pedidosEnRuta;

    private long pedidosEntregados;

    private BigDecimal ventasTotales;

    public DashboardDTO() {
    }

    public long getClientes() {
        return clientes;
    }

    public void setClientes(long clientes) {
        this.clientes = clientes;
    }

    public long getProductos() {
        return productos;
    }

    public void setProductos(long productos) {
        this.productos = productos;
    }

    public long getPedidosPendientes() {
        return pedidosPendientes;
    }

    public void setPedidosPendientes(long pedidosPendientes) {
        this.pedidosPendientes = pedidosPendientes;
    }

    public long getPedidosEnRuta() {
        return pedidosEnRuta;
    }

    public void setPedidosEnRuta(long pedidosEnRuta) {
        this.pedidosEnRuta = pedidosEnRuta;
    }

    public long getPedidosEntregados() {
        return pedidosEntregados;
    }

    public void setPedidosEntregados(long pedidosEntregados) {
        this.pedidosEntregados = pedidosEntregados;
    }

    public BigDecimal getVentasTotales() {
        return ventasTotales;
    }

    public void setVentasTotales(BigDecimal ventasTotales) {
        this.ventasTotales = ventasTotales;
    }

}