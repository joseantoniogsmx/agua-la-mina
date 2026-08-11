import { useEffect, useMemo, useState } from "react";

import PedidoCard from "./PedidoCard";

import ConfirmDialog from "../../common/ConfirmDialog/ConfirmDialog";

import { eliminarPedido } from "../../../services/pedidoService";

import "./PedidoTable.css";

const PEDIDOS_POR_PAGINA = 10;

export default function PedidoTable({

    pedidos,

    onActualizar

}) {

    const [pedidoExpandido, setPedidoExpandido] = useState(null);

    const [pedidoAEliminar, setPedidoAEliminar] = useState(null);

    const [eliminando, setEliminando] = useState(false);

    const [paginaActual, setPaginaActual] = useState(1);

    const [fechaDesde, setFechaDesde] = useState("");

    const [fechaHasta, setFechaHasta] = useState("");


    function obtenerFechaLocal(fecha) {

        if (!fecha) {

            return "";

        }

        const fechaConvertida = new Date(fecha);

        if (Number.isNaN(fechaConvertida.getTime())) {

            return "";

        }

        const year = fechaConvertida.getFullYear();

        const month = String(

            fechaConvertida.getMonth() + 1

        ).padStart(2, "0");

        const day = String(

            fechaConvertida.getDate()

        ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    const pedidosFiltrados = useMemo(() => {

        return [...pedidos]

            .filter((pedido) => {

                const fechaPedido = obtenerFechaLocal(

                    pedido.fecha

                );

                if (!fechaPedido) {

                    return false;

                }

                if (

                    fechaDesde &&

                    fechaPedido < fechaDesde

                ) {

                    return false;

                }

                if (

                    fechaHasta &&

                    fechaPedido > fechaHasta

                ) {

                    return false;

                }

                return true;

            })

            .sort((a, b) => {

                const fechaA = new Date(a.fecha).getTime();

                const fechaB = new Date(b.fecha).getTime();

                return fechaB - fechaA;

            });

    }, [pedidos, fechaDesde, fechaHasta]);


    const totalPedidos = pedidosFiltrados.length;

    const totalPaginas = Math.max(

        1,

        Math.ceil(

            totalPedidos / PEDIDOS_POR_PAGINA

        )

    );


    useEffect(() => {

        if (paginaActual > totalPaginas) {

            setPaginaActual(totalPaginas);

        }

    }, [paginaActual, totalPaginas]);


    useEffect(() => {

        setPaginaActual(1);

    }, [fechaDesde, fechaHasta]);


    const indiceInicial =

        (paginaActual - 1) *

        PEDIDOS_POR_PAGINA;

    const indiceFinal =

        indiceInicial +

        PEDIDOS_POR_PAGINA;

    const pedidosPagina = pedidosFiltrados.slice(

        indiceInicial,

        indiceFinal

    );


    function alternarPedido(id) {

        setPedidoExpandido(

            pedidoExpandido === id

                ? null

                : id

        );

    }


    function solicitarEliminacion(pedido) {

        setPedidoAEliminar(pedido);

    }


    function cancelarEliminacion() {

        if (eliminando) {

            return;

        }

        setPedidoAEliminar(null);

    }


    async function confirmarEliminacion() {

        if (!pedidoAEliminar) {

            return;

        }

        try {

            setEliminando(true);

            await eliminarPedido(

                pedidoAEliminar.id

            );

            setPedidoExpandido(null);

            setPedidoAEliminar(null);

            if (onActualizar) {

                await onActualizar();

            }

        } catch (error) {

            console.error(

                "Error al eliminar el pedido:",

                error

            );

            alert(

                "No fue posible eliminar el pedido."

            );

        } finally {

            setEliminando(false);

        }

    }


    function limpiarFiltros() {

        setFechaDesde("");

        setFechaHasta("");

        setPaginaActual(1);

    }


    function cambiarPagina(pagina) {

        if (

            pagina < 1 ||

            pagina > totalPaginas

        ) {

            return;

        }

        setPaginaActual(pagina);

        setPedidoExpandido(null);

    }


    if (!pedidos.length) {

        return (

            <div className="pedido-table-vacio">

                No hay pedidos registrados.

            </div>

        );

    }


    const primerPedido =

        totalPedidos === 0

            ? 0

            : indiceInicial + 1;

    const ultimoPedido = Math.min(

        indiceFinal,

        totalPedidos

    );


    return (

        <>

            <div className="pedido-filtros">

                <div className="filtro-fecha">

                    <label htmlFor="fecha-desde">

                        Desde

                    </label>

                    <input

                        id="fecha-desde"

                        type="date"

                        value={fechaDesde}

                        max={fechaHasta || undefined}

                        onChange={(e) =>

                            setFechaDesde(

                                e.target.value

                            )

                        }

                    />

                </div>


                <div className="filtro-fecha">

                    <label htmlFor="fecha-hasta">

                        Hasta

                    </label>

                    <input

                        id="fecha-hasta"

                        type="date"

                        value={fechaHasta}

                        min={fechaDesde || undefined}

                        onChange={(e) =>

                            setFechaHasta(

                                e.target.value

                            )

                        }

                    />

                </div>


                <button

                    type="button"

                    className="btn-limpiar-filtros"

                    onClick={limpiarFiltros}

                    disabled={

                        !fechaDesde &&

                        !fechaHasta

                    }

                >

                    Limpiar filtros

                </button>

            </div>


            <div className="pedido-resumen-lista">

                <span>

                    {

                        totalPedidos === 0

                            ? "No hay pedidos para el periodo seleccionado."

                            : `Mostrando ${primerPedido}–${ultimoPedido} de ${totalPedidos} pedidos`

                    }

                </span>

                <span className="orden-pedidos">

                    Más recientes primero

                </span>

            </div>


            {

                totalPedidos === 0

                    ?

                    (

                        <div className="pedido-table-vacio">

                            No hay pedidos para las fechas seleccionadas.

                        </div>

                    )

                    :

                    (

                        <div className="pedido-listado">

                            {

                                pedidosPagina.map(

                                    (pedido) => (

                                        <PedidoCard

                                            key={pedido.id}

                                            pedido={pedido}

                                            expandido={

                                                pedidoExpandido ===

                                                pedido.id

                                            }

                                            onExpandir={

                                                alternarPedido

                                            }

                                            onEliminar={

                                                solicitarEliminacion

                                            }

                                        />

                                    )

                                )

                            }

                        </div>

                    )

            }


            {

                totalPedidos > 0 && (

                    <div className="paginacion-pedidos">

                        <button

                            type="button"

                            className="btn-paginacion"

                            disabled={

                                paginaActual === 1

                            }

                            onClick={() =>

                                cambiarPagina(

                                    paginaActual - 1

                                )

                            }

                        >

                            ← Anterior

                        </button>


                        <div className="paginas">

                            {

                                Array.from(

                                    {

                                        length: totalPaginas

                                    },

                                    (_, index) =>

                                        index + 1

                                ).map((pagina) => (

                                    <button

                                        key={pagina}

                                        type="button"

                                        className={

                                            pagina ===

                                            paginaActual

                                                ? "pagina activa"

                                                : "pagina"

                                        }

                                        onClick={() =>

                                            cambiarPagina(

                                                pagina

                                            )

                                        }

                                    >

                                        {pagina}

                                    </button>

                                ))

                            }

                        </div>


                        <button

                            type="button"

                            className="btn-paginacion"

                            disabled={

                                paginaActual ===

                                totalPaginas

                            }

                            onClick={() =>

                                cambiarPagina(

                                    paginaActual + 1

                                )

                            }

                        >

                            Siguiente →

                        </button>

                    </div>

                )

            }


            <ConfirmDialog

                abierto={

                    pedidoAEliminar !== null

                }

                titulo="Eliminar pedido"

                mensaje="¿Deseas eliminar este pedido? Esta acción no puede deshacerse."

                textoAceptar="Eliminar"

                textoCancelar="Cancelar"

                variante="danger"

                cargando={eliminando}

                onCancelar={cancelarEliminacion}

                onAceptar={confirmarEliminacion}

            >

                {

                    pedidoAEliminar && (

                        <>

                            <strong>

                                Cliente

                            </strong>

                            <p>

                                {

                                    pedidoAEliminar.cliente

                                        ?.nombre ??

                                    "Sin cliente"

                                }

                            </p>


                            <strong>

                                Total

                            </strong>

                            <p>

                                $

                                {

                                    Number(

                                        pedidoAEliminar.total

                                    ).toFixed(2)

                                }

                            </p>


                            <strong>

                                Estado

                            </strong>

                            <p>

                                {

                                    pedidoAEliminar.estado

                                }

                            </p>


                            <strong>

                                Productos

                            </strong>

                            <p>

                                {

                                    pedidoAEliminar.detalles

                                        ?.length ?? 0

                                }

                            </p>

                        </>

                    )

                }

            </ConfirmDialog>

        </>

    );

}