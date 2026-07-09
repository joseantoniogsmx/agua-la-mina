package mx.agua.backend.model;

public final class PedidoEstado {

    private PedidoEstado() {
        // Evita que esta clase pueda instanciarse.
    }

    public static final String PENDIENTE = "PENDIENTE";

    public static final String EN_RUTA = "EN_RUTA";

    public static final String ENTREGADO = "ENTREGADO";

}