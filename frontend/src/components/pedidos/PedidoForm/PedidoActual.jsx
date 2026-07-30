import "./PedidoActual.css";

export default function PedidoActual({

    pedidoActual,

    totalPedido,

    onEliminarLinea,

    onVaciarPedido,

    onGuardarPedido

}) {

    return (

        <section className="pedido-actual">

            <div className="pedido-header">

                <h2>🛒 Pedido actual</h2>

                {

                    pedidoActual.length > 0 &&

                    <span className="pedido-badge">

                        {pedidoActual.length}

                        {

                            pedidoActual.length === 1

                                ? " producto"

                                : " productos"

                        }

                    </span>

                }

            </div>

            {

                pedidoActual.length === 0

                    ?

                    <div className="pedido-vacio">

                        <div className="pedido-vacio-icono">

                            📦

                        </div>

                        <h3>

                            Aún no hay productos

                        </h3>

                        <p>

                            Selecciona un producto para comenzar el pedido.

                        </p>

                    </div>

                    :

                    <>

                        <div className="pedido-lista">

                            {

                                pedidoActual.map((item, index) => (

                                    <div

                                        key={index}

                                        className="pedido-card"

                                    >

                                        <div className="pedido-info">

                                            <div>

                                                <h4>

                                                    {item.producto.marca}

                                                </h4>

                                                <span>

                                                    {item.producto.capacidadLitros} L

                                                </span>

                                            </div>

                                            <button

                                                type="button"

                                                className="btn-eliminar"

                                                onClick={() =>
                                                    onEliminarLinea(index)
                                                }

                                                title="Eliminar producto"

                                            >

                                                🗑️

                                            </button>

                                        </div>

                                        <div className="pedido-detalles">

                                            <div>

                                                <span className="etiqueta">

                                                    Cantidad

                                                </span>

                                                <strong>

                                                    {item.cantidad}

                                                </strong>

                                            </div>

                                            <div>

                                                <span className="etiqueta">

                                                    Prestados

                                                </span>

                                                <strong>

                                                    {item.prestados}

                                                </strong>

                                            </div>

                                            <div>

                                                <span className="etiqueta">

                                                    Subtotal

                                                </span>

                                                <strong className="subtotal">

                                                    $

                                                    {Number(item.subtotal).toFixed(2)}

                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                        <div className="pedido-total">

                            <span>

                                Total del pedido

                            </span>

                            <strong>

                                $

                                {Number(totalPedido).toFixed(2)}

                            </strong>

                        </div>

                        <div className="pedido-botones">

                            <button

                                type="button"

                                className="btn-secondary"

                                onClick={onVaciarPedido}

                            >

                                Vaciar pedido

                            </button>

                            <button

                                type="button"

                                className="btn-primary"

                                onClick={onGuardarPedido}

                            >

                                Guardar pedido

                            </button>

                        </div>

                    </>

            }

        </section>

    );

}