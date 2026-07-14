package mx.agua.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class CrearPedidoRequest {

    private Integer clienteId;

    private String prioridad;

    private String notas;

    private List<CrearPedidoDetalleDTO> detalles =
            new ArrayList<>();

    public CrearPedidoRequest() {
    }

    public Integer getClienteId() {
        return clienteId;
    }

    public void setClienteId(Integer clienteId) {
        this.clienteId = clienteId;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public List<CrearPedidoDetalleDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<CrearPedidoDetalleDTO> detalles) {
        this.detalles = detalles;
    }

}