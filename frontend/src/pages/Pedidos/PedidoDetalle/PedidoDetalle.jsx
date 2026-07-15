import "./PedidoDetalle.css";

export default function PedidoDetalle({

    abierto,
    pedido,
    onCerrar

}) {

    if (!abierto || !pedido) {

        return null;

    }

    return (

        <div className="modal-overlay">

            <div className="pedido-modal">

                <div className="pedido-modal-header">

                    <h2>

                        Pedido #{pedido.id}

                    </h2>

                    <button
                        className="cerrar"
                        onClick={onCerrar}
                    >

                        ✕

                    </button>

                </div>

                <div className="pedido-info">

                    <p>

                        <strong>Cliente:</strong>{" "}

                        {pedido.cliente?.nombre}

                    </p>

                    <p>

                        <strong>Estado:</strong>{" "}

                        {pedido.estado}

                    </p>

                    <p>

                        <strong>Prioridad:</strong>{" "}

                        {pedido.prioridad}

                    </p>

                    <p>

                        <strong>Total:</strong>{" "}

                        ${Number(pedido.total).toFixed(2)}

                    </p>

                    <p>

                        <strong>Observaciones:</strong>

                    </p>

                    <p>

                        {pedido.notas || "Sin observaciones"}

                    </p>

                </div>

                <h3>

                    Productos

                </h3>

                <table className="detalle-tabla">

                    <thead>

                        <tr>

                            <th>Producto</th>

                            <th>Cantidad</th>

                            <th>Prestados</th>

                            <th>Subtotal</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            pedido.detalles?.map(detalle => (

                                <tr key={detalle.id}>

                                    <td>

                                        {detalle.producto?.marca}

                                    </td>

                                    <td>

                                        {detalle.cantidad}

                                    </td>

                                    <td>

                                        {detalle.prestados}

                                    </td>

                                    <td>

                                        ${Number(detalle.subtotal).toFixed(2)}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}