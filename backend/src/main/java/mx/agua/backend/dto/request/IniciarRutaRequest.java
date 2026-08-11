package mx.agua.backend.dto.request;

import java.util.List;

public class IniciarRutaRequest {

    private List<Integer> pedidoIds;

    public IniciarRutaRequest() {
    }

    public List<Integer> getPedidoIds() {
        return pedidoIds;
    }

    public void setPedidoIds(List<Integer> pedidoIds) {
        this.pedidoIds = pedidoIds;
    }

}