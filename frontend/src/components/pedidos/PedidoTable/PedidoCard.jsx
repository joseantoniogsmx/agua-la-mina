import "./PedidoCard.css";

export default function PedidoCard({
    pedido,
    expandido,
    onExpandir,
    onEditar,
    onEliminar,
    onVerRuta
}) {

    const detalles =
        pedido.detalles || [];


    /*
     * ==========================================================
     * ESTADO DEL PEDIDO
     * ==========================================================
     */

    const esPendiente =
        pedido.estado === "PENDIENTE";

    const esEnRuta =
        pedido.estado === "EN_RUTA";


    /*
     * ==========================================================
     * RESUMEN DE PRODUCTOS
     * ==========================================================
     */

    const resumenProductos =

        detalles.length === 0

            ? "Sin productos"

            : detalles
                .slice(0, 2)
                .map(
                    (detalle) =>
                        detalle.marca
                )
                .join(" • ");


    const productosRestantes =

        detalles.length > 2

            ? detalles.length - 2

            : 0;


    /*
     * ==========================================================
     * CLASE DEL ESTADO
     * ==========================================================
     */

    function obtenerClaseEstado(
        estado
    ) {

        if (!estado) {

            return "estado-desconocido";

        }

        return `estado-${estado.toLowerCase()}`;

    }


    /*
     * ==========================================================
     * FORMATEAR FECHA
     * ==========================================================
     */

    function formatearFecha(
        fecha
    ) {

        if (!fecha) {

            return "-";

        }

        const fechaConvertida =
            new Date(fecha);


        if (
            Number.isNaN(
                fechaConvertida.getTime()
            )
        ) {

            return "-";

        }


        return fechaConvertida.toLocaleString();

    }


    /*
     * ==========================================================
     * ABRIR RUTA
     * ==========================================================
     */

    function manejarVerRuta() {

        if (!pedido.envioId) {

            alert(
                "Este pedido está en ruta, pero no tiene un envío asociado."
            );

            return;

        }

        if (onVerRuta) {

            onVerRuta(
                pedido
            );

        }

    }


    /*
     * ==========================================================
     * RENDER
     * ==========================================================
     */

    return (

        <article

            className={

                expandido

                    ? "pedido-card expandido"

                    : "pedido-card"

            }

        >

            <div className="pedido-card-principal">


                {/* ==================================================
                    FOLIO
                ================================================== */}

                <div className="pedido-info folio">

                    <span>
                        Folio
                    </span>

                    <strong>
                        #{pedido.id}
                    </strong>

                </div>


                {/* ==================================================
                    CLIENTE
                ================================================== */}

                <div className="pedido-info cliente">

                    <span>
                        Cliente
                    </span>

                    <strong>

                        {
                            pedido.cliente?.nombre ??
                            "Sin cliente"
                        }

                    </strong>

                </div>


                {/* ==================================================
                    PRODUCTOS
                ================================================== */}

                <div className="pedido-info productos">

                    <span>
                        Productos
                    </span>

                    <strong>

                        {resumenProductos}


                        {
                            productosRestantes > 0 && (

                                <>

                                    <br />

                                    <small>
                                        +{productosRestantes} más
                                    </small>

                                </>

                            )
                        }

                    </strong>

                </div>


                {/* ==================================================
                    TOTAL
                ================================================== */}

                <div className="pedido-info total">

                    <span>
                        Total
                    </span>

                    <strong>

                        $
                        {
                            Number(
                                pedido.total
                            ).toFixed(2)
                        }

                    </strong>

                </div>


                {/* ==================================================
                    ESTADO
                ================================================== */}

                <div className="pedido-info estado-container">

                    <span>
                        Estado
                    </span>

                    <strong

                        className={
                            `estado ${
                                obtenerClaseEstado(
                                    pedido.estado
                                )
                            }`
                        }

                    >

                        {
                            pedido.estado
                        }

                    </strong>

                </div>


                {/* ==================================================
                    FECHA
                ================================================== */}

                <div className="pedido-info fecha">

                    <span>
                        Fecha
                    </span>

                    <strong>

                        {
                            formatearFecha(
                                pedido.fecha
                            )
                        }

                    </strong>

                </div>


                {/* ==================================================
                    ACCIONES
                ================================================== */}

                <div className="pedido-acciones">


                    {/* VER DETALLE */}

                    <button

                        type="button"

                        className="btn-expandir"

                        onClick={() =>
                            onExpandir(
                                pedido.id
                            )
                        }

                        title={
                            expandido
                                ? "Ocultar detalles"
                                : "Ver detalles"
                        }

                    >

                        {
                            expandido
                                ? "▲"
                                : "▼"
                        }

                    </button>


                    {/* ==================================================
                        EDITAR
                    ================================================== */}

                    {
                        esPendiente &&
                        onEditar && (

                            <button

                                type="button"

                                className="btn-editar-pedido"

                                onClick={() =>
                                    onEditar(
                                        pedido
                                    )
                                }

                                title="Editar pedido"

                            >

                                ✏️

                            </button>

                        )
                    }


                    {/* ==================================================
                        ELIMINAR
                    ================================================== */}

                    {
                        esPendiente &&
                        onEliminar && (

                            <button

                                type="button"

                                className="btn-eliminar-pedido"

                                onClick={() =>
                                    onEliminar(
                                        pedido
                                    )
                                }

                                title="Eliminar pedido"

                            >

                                🗑️

                            </button>

                        )
                    }


                    {/* ==================================================
                        VER RUTA
                    ================================================== */}

                    {
                        esEnRuta && (

                            <button

                                type="button"

                                className="btn-ruta-pedido"

                                onClick={
                                    manejarVerRuta
                                }

                                title="Ver ruta de reparto"

                            >

                                🚚

                            </button>

                        )
                    }

                </div>

            </div>


            {/* ==================================================
                DETALLE EXPANDIDO
            ================================================== */}

            {
                expandido && (

                    <div className="pedido-detalle">


                        <div className="pedido-detalle-titulo">

                            Detalle del pedido

                        </div>


                        {
                            detalles.length === 0

                                ? (

                                    <p className="sin-detalles">

                                        Este pedido no tiene productos registrados.

                                    </p>

                                )

                                : (

                                    <div className="detalles-lista">

                                        {
                                            detalles.map(
                                                (
                                                    detalle,
                                                    index
                                                ) => (

                                                    <div

                                                        key={
                                                            detalle.id ??
                                                            index
                                                        }

                                                        className="detalle-producto"

                                                    >

                                                        <div className="detalle-producto-nombre">

                                                            <strong>

                                                                {
                                                                    detalle.marca ??
                                                                    "Producto"
                                                                }

                                                            </strong>

                                                            {
                                                                detalle.capacidadLitros && (

                                                                    <span>

                                                                        {
                                                                            detalle.capacidadLitros
                                                                        }{" "}
                                                                        L

                                                                    </span>

                                                                )
                                                            }

                                                        </div>


                                                        <div className="detalle-dato">

                                                            <span>
                                                                Cantidad
                                                            </span>

                                                            <strong>

                                                                {
                                                                    detalle.cantidad ??
                                                                    0
                                                                }

                                                            </strong>

                                                        </div>


                                                        <div className="detalle-dato">

                                                            <span>
                                                                Prestados
                                                            </span>

                                                            <strong>

                                                                {
                                                                    detalle.prestados ??
                                                                    0
                                                                }

                                                            </strong>

                                                        </div>


                                                        <div className="detalle-dato">

                                                            <span>
                                                                Precio
                                                            </span>

                                                            <strong>

                                                                $

                                                                {
                                                                    Number(
                                                                        detalle.precioUnitario ??
                                                                        0
                                                                    ).toFixed(2)
                                                                }

                                                            </strong>

                                                        </div>


                                                        <div className="detalle-dato subtotal">

                                                            <span>
                                                                Subtotal
                                                            </span>

                                                            <strong>

                                                                $

                                                                {
                                                                    Number(
                                                                        detalle.subtotal ??
                                                                        0
                                                                    ).toFixed(2)
                                                                }

                                                            </strong>

                                                        </div>

                                                    </div>

                                                )
                                            )
                                        }

                                    </div>

                                )
                        }


                        <div className="detalle-total">

                            <span>
                                Total del pedido
                            </span>

                            <strong>

                                $
                                {
                                    Number(
                                        pedido.total
                                    ).toFixed(2)
                                }

                            </strong>

                        </div>


                        {
                            pedido.notas && (

                                <div className="detalle-notas">

                                    <strong>
                                        Observaciones
                                    </strong>

                                    <p>
                                        {
                                            pedido.notas
                                        }
                                    </p>

                                </div>

                            )
                        }

                    </div>

                )
            }

        </article>

    );

}