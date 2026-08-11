package mx.agua.backend.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class RutaResponse {

    private List<PedidoResponse> pedidos;

    private BigDecimal distanciaKm;

    private Long duracionMinutos;


    public RutaResponse() {
    }


    public RutaResponse(
            List<PedidoResponse> pedidos,
            BigDecimal distanciaKm,
            Long duracionMinutos) {

        this.pedidos = pedidos;

        this.distanciaKm = distanciaKm;

        this.duracionMinutos = duracionMinutos;

    }


    public List<PedidoResponse> getPedidos() {

        return pedidos;

    }


    public void setPedidos(
            List<PedidoResponse> pedidos) {

        this.pedidos = pedidos;

    }


    public BigDecimal getDistanciaKm() {

        return distanciaKm;

    }


    public void setDistanciaKm(
            BigDecimal distanciaKm) {

        this.distanciaKm = distanciaKm;

    }


    public Long getDuracionMinutos() {

        return duracionMinutos;

    }


    public void setDuracionMinutos(
            Long duracionMinutos) {

        this.duracionMinutos = duracionMinutos;

    }

}