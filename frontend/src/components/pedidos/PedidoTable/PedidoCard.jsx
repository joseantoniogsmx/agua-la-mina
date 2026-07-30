import PedidoDetalle from "./PedidoDetalle";

import {
    formatearFecha,
    formatearMoneda,
    obtenerClaseEstado,
    obtenerResumenMarcas
} from "./pedidoUtils";

export default function PedidoCard({

    pedido,

    expandido,

    onExpandir,

    onEditar,

    onEliminar

}) {

    return (

        <div className="pedido-item">

            <div className="pedido-resumen">

                <div className="pedido-folio">

                    <small>Folio</small>

                    <strong>

                        #{pedido.id}

                    </strong>

                </div>

                <div className="pedido-cliente">

                    <small>Cliente</small>

                    <strong>

                        {

                            pedido.cliente

                                ? pedido.cliente.nombre

                                : "-"

                        }

                    </strong>

                </div>

                <div className="pedido-productos">

                    <small>Productos</small>

                    <strong>

                        {

                            obtenerResumenMarcas(

                                pedido

                            )

                        }

                    </strong>

                </div>

                <div className="pedido-total">

                    <small>Total</small>

                    <strong>

                        {

                            formatearMoneda(

                                pedido.total

                            )

                        }

                    </strong>

                </div>

                <div className="pedido-estado">

                    <span

                        className={

                            obtenerClaseEstado(

                                pedido.estado

                            )

                        }

                    >

                        {pedido.estado}

                    </span>

                </div>

                <div className="pedido-fecha">

                    <small>Fecha</small>

                    <strong>

                        {

                            formatearFecha(

                                pedido.fecha

                            )

                        }

                    </strong>

                </div>

                <div className="pedido-acciones">

                    <button

                        type="button"

                        className="btn-ver"

                        title="Ver detalle"

                        onClick={() =>

                            onExpandir(

                                pedido.id

                            )

                        }

                    >

                        {

                            expandido

                                ? "▲"

                                : "▼"

                        }

                    </button>

                    <button

                        type="button"

                        className="btn-editar"

                        title="Editar pedido"

                        onClick={() =>

                            onEditar(

                                pedido

                            )

                        }

                    >

                        ✏

                    </button>

                    <button

                        type="button"

                        className="btn-eliminar"

                        title="Eliminar pedido"

                        onClick={() =>

                            onEliminar(

                                pedido

                            )

                        }

                    >

                        🗑

                    </button>

                </div>

            </div>

            {

                expandido && (

                    <PedidoDetalle

                        pedido={pedido}

                    />

                )

            }

        </div>

    );

}