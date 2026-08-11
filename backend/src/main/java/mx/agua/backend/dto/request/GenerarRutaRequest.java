package mx.agua.backend.dto.request;

import java.util.List;

public class GenerarRutaRequest {

    private List<Integer> pedidoIds;

    public GenerarRutaRequest() {
    }

    public List<Integer> getPedidoIds() {
        return pedidoIds;
    }

    public void setPedidoIds(List<Integer> pedidoIds) {
        this.pedidoIds = pedidoIds;
    }

}