import "./PedidoTable.css";

export default function PedidoTable({ pedidos }) {

    if (pedidos.length === 0) {

        return (

            <div className="pedido-table-vacio">

                No hay pedidos registrados.

            </div>

        );

    }

    return (

        <table className="pedido-table">

            <thead>

                <tr>

                    <th>Folio</th>

                    <th>Cliente</th>

                    <th>Productos</th>

                    <th>Total</th>

                    <th>Estado</th>

                    <th>Fecha</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

                {pedidos.map((pedido) => (

                    <tr key={pedido.id}>

                        <td>{pedido.id}</td>

                        <td>

                            {pedido.cliente
                                ? pedido.cliente.nombre
                                : "-"}

                        </td>

                        <td>

                            {pedido.detalles
                                ? pedido.detalles.length
                                : 0}

                        </td>

                        <td>

                            ${Number(pedido.total).toFixed(2)}

                        </td>

                        <td>

                            <span
                                className={`estado estado-${pedido.estado?.toLowerCase()}`}
                            >

                                {pedido.estado}

                            </span>

                        </td>

                        <td>

                            {

                                pedido.fecha
                                    ? new Date(pedido.fecha).toLocaleString()
                                    : ""

                            }

                        </td>

                        <td>

                            <button className="btn-ver">

                                👁

                            </button>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}