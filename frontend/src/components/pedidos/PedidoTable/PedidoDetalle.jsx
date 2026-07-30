import {
    formatearMoneda
} from "./pedidoUtils";

export default function PedidoDetalle({ pedido }) {

    return (

        <div className="pedido-detalle">

            <h4>Detalle del pedido</h4>

            {

                pedido.detalles?.length > 0

                    ?

                    pedido.detalles.map((detalle) => (

                        <div
                            key={detalle.id}
                            className="detalle-item"
                        >

                            <div className="detalle-producto">

                                <strong>

                                    {detalle.marca}

                                </strong>

                                <small>

                                    {Number(
                                        detalle.capacidadLitros ?? 0
                                    )} L

                                </small>

                            </div>

                            <div>

                                Cantidad

                                <br />

                                <strong>

                                    {detalle.cantidad}

                                </strong>

                            </div>

                            <div>

                                Prestados

                                <br />

                                <strong>

                                    {detalle.prestados}

                                </strong>

                            </div>

                            <div>

                                Precio

                                <br />

                                <strong>

                                    {

                                        formatearMoneda(

                                            detalle.precioUnitario

                                        )

                                    }

                                </strong>

                            </div>

                            <div>

                                Subtotal

                                <br />

                                <strong>

                                    {

                                        formatearMoneda(

                                            detalle.subtotal

                                        )

                                    }

                                </strong>

                            </div>

                        </div>

                    ))

                    :

                    (

                        <p>

                            Este pedido no tiene productos.

                        </p>

                    )

            }

            {

                pedido.notas && (

                    <div className="pedido-notas">

                        <strong>

                            Observaciones

                        </strong>

                        <p>

                            {pedido.notas}

                        </p>

                    </div>

                )

            }

            <div className="pedido-total-final">

                <span>

                    Total del pedido

                </span>

                <strong>

                    {

                        formatearMoneda(

                            pedido.total

                        )

                    }

                </strong>

            </div>

        </div>

    );

}