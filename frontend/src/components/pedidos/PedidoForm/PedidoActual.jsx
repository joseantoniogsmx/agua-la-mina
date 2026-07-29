export default function PedidoActual({

    pedidoActual,

    totalPedido,

    onEliminarLinea,

    onVaciarPedido,

    onGuardarPedido

}) {

    return (

        <section className="pedido-actual">

            <h2>Pedido actual</h2>

            {

                pedidoActual.length === 0

                    ?

                    <p>No hay productos agregados.</p>

                    :

                    pedidoActual.map((item, index) => (

                        <div

                            key={index}

                            className="linea-pedido"

                        >

                            <div>

                                <strong>

                                    {item.producto.marca}

                                </strong>

                                {

                                    item.producto.capacidadLitros && (

                                        <div>

                                            {item.producto.capacidadLitros} L

                                        </div>

                                    )

                                }

                            </div>

                            <div>

                                Cantidad: {item.cantidad}

                            </div>

                            <div>

                                Prestados: {item.prestados}

                            </div>

                            <div>

                                ${Number(item.subtotal).toFixed(2)}

                            </div>

                            <button

                                type="button"

                                className="btn-danger"

                                onClick={() =>
                                    onEliminarLinea(index)
                                }

                            >

                                ❌

                            </button>

                        </div>

                    ))

            }

            <hr />

            <h3>

                Total: ${Number(totalPedido).toFixed(2)}

            </h3>

            <div

                style={{

                    display: "flex",

                    gap: "12px",

                    marginTop: "15px"

                }}

            >

                <button

                    type="button"

                    className="btn-primary"

                    disabled={pedidoActual.length === 0}

                    onClick={onGuardarPedido}

                >

                    Guardar pedido

                </button>

                <button

                    type="button"

                    className="btn-secondary"

                    disabled={pedidoActual.length === 0}

                    onClick={onVaciarPedido}

                >

                    Vaciar pedido

                </button>

            </div>

        </section>

    );

}