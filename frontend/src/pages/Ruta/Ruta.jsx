import { useEffect, useState } from "react";

import { obtenerPedidos } from "../../services/pedidoService";
import { post } from "../../services/api";

import "./Ruta.css";

export default function Ruta() {

    const [pedidos, setPedidos] = useState([]);

    const [pedidosSeleccionados, setPedidosSeleccionados] = useState([]);

    const [ruta, setRuta] = useState(null);

    const [cargando, setCargando] = useState(true);

    const [generando, setGenerando] = useState(false);

    const [iniciando, setIniciando] = useState(false);

    const [error, setError] = useState(null);


    useEffect(() => {

        cargarPedidos();

    }, []);


    async function cargarPedidos() {

        try {

            setCargando(true);

            setError(null);

            const datos = await obtenerPedidos();

            const pendientes = datos.filter(

                pedido =>
                    pedido.estado === "PENDIENTE"

            );

            setPedidos(pendientes);

        } catch (error) {

            console.error(
                "Error al cargar pedidos:",
                error
            );

            setError(
                "No fue posible cargar los pedidos."
            );

        } finally {

            setCargando(false);

        }

    }


    function alternarPedido(id) {

        setPedidosSeleccionados(

            anteriores => {

                if (anteriores.includes(id)) {

                    return anteriores.filter(
                        pedidoId => pedidoId !== id
                    );

                }

                return [
                    ...anteriores,
                    id
                ];

            }

        );

    }


    function seleccionarTodos() {

        setPedidosSeleccionados(

            pedidos.map(
                pedido => pedido.id
            )

        );

    }


    function limpiarSeleccion() {

        setPedidosSeleccionados([]);

        setRuta(null);

    }


    async function generarRuta() {

        if (!pedidosSeleccionados.length) {

            alert(
                "Selecciona al menos un pedido."
            );

            return;

        }


        try {

            setGenerando(true);

            setError(null);

            const resultado = await post(
                "/ruta/generar",
                {
                    pedidoIds:
                        pedidosSeleccionados
                }
            );

            setRuta(resultado);

        } catch (error) {

            console.error(
                "Error al generar la ruta:",
                error
            );

            setError(
                obtenerMensajeError(
                    error
                )
            );

        } finally {

            setGenerando(false);

        }

    }


    async function iniciarRuta() {

        if (!ruta) {

            return;

        }


        const confirmar =
            window.confirm(
                "¿Deseas iniciar esta ruta?"
            );


        if (!confirmar) {

            return;

        }


        try {

            setIniciando(true);

            setError(null);

            await post(
                "/ruta/iniciar",
                {
                    pedidoIds:
                        pedidosSeleccionados
                }
            );

            alert(
                "Ruta iniciada correctamente."
            );

            setRuta(null);

            setPedidosSeleccionados([]);

            await cargarPedidos();

        } catch (error) {

            console.error(
                "Error al iniciar la ruta:",
                error
            );

            setError(
                obtenerMensajeError(
                    error
                )
            );

        } finally {

            setIniciando(false);

        }

    }


    function obtenerMensajeError(error) {

        if (
            error?.message
        ) {

            return error.message;

        }

        return (
            "No fue posible realizar la operación."
        );

    }


    function obtenerResumenProductos(
        pedido
    ) {

        if (
            !pedido.detalles ||
            !pedido.detalles.length
        ) {

            return "Sin productos";

        }


        return pedido.detalles
            .map(
                detalle =>
                    `${detalle.marca} × ${detalle.cantidad}`
            )
            .join(", ");

    }


    function formatearFecha(fecha) {

        if (!fecha) {

            return "";

        }


        return new Date(fecha)
            .toLocaleDateString(
                "es-MX",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );

    }


    return (

        <div className="ruta-page">

            <div className="ruta-header">

                <div>

                    <h1>Ruta</h1>

                    <p>
                        Selecciona los pedidos que deseas
                        incluir en la ruta.
                    </p>

                </div>

            </div>


            {
                error && (

                    <div className="ruta-error">

                        {error}

                    </div>

                )
            }


            <section className="ruta-panel">

                <div className="ruta-panel-header">

                    <div>

                        <h2>
                            Pedidos pendientes
                        </h2>

                        <p>

                            {
                                pedidos.length
                            }

                            {" "}

                            pedidos disponibles

                        </p>

                    </div>


                    <div className="ruta-acciones">

                        <button
                            type="button"
                            className="btn-secundario"
                            onClick={
                                seleccionarTodos
                            }
                            disabled={
                                !pedidos.length
                            }
                        >

                            Seleccionar todos

                        </button>


                        <button
                            type="button"
                            className="btn-secundario"
                            onClick={
                                limpiarSeleccion
                            }
                            disabled={
                                !pedidosSeleccionados.length
                            }
                        >

                            Limpiar selección

                        </button>

                    </div>

                </div>


                {
                    cargando ? (

                        <div className="ruta-cargando">

                            Cargando pedidos...

                        </div>

                    ) : pedidos.length === 0 ? (

                        <div className="ruta-vacio">

                            No hay pedidos pendientes.

                        </div>

                    ) : (

                        <div className="ruta-pedidos">

                            {
                                pedidos.map(
                                    pedido => {

                                        const seleccionado =
                                            pedidosSeleccionados
                                                .includes(
                                                    pedido.id
                                                );

                                        return (

                                            <div

                                                key={
                                                    pedido.id
                                                }

                                                className={
                                                    seleccionado
                                                        ? "ruta-pedido seleccionado"
                                                        : "ruta-pedido"
                                                }

                                                onClick={() =>
                                                    alternarPedido(
                                                        pedido.id
                                                    )
                                                }

                                            >

                                                <div className="ruta-pedido-check">

                                                    <input

                                                        type="checkbox"

                                                        checked={
                                                            seleccionado
                                                        }

                                                        onChange={() =>
                                                            alternarPedido(
                                                                pedido.id
                                                            )
                                                        }

                                                        onClick={e =>
                                                            e.stopPropagation()
                                                        }

                                                    />

                                                </div>


                                                <div className="ruta-pedido-info">

                                                    <div className="ruta-pedido-titulo">

                                                        <strong>

                                                            Pedido #
                                                            {
                                                                pedido.id
                                                            }

                                                        </strong>


                                                        {
                                                            pedido.prioridad ===
                                                                "URGENTE" && (

                                                                <span className="ruta-prioridad urgente">

                                                                    URGENTE

                                                                </span>

                                                            )
                                                        }

                                                    </div>


                                                    <div className="ruta-cliente">

                                                        {
                                                            pedido.cliente
                                                                ?.nombre
                                                                ||
                                                                "Sin cliente"
                                                        }

                                                    </div>


                                                    <div className="ruta-direccion">

                                                        {
                                                            pedido.cliente
                                                                ?.direccion
                                                                ||
                                                                "Sin dirección"
                                                        }

                                                    </div>


                                                    <div className="ruta-productos">

                                                        {
                                                            obtenerResumenProductos(
                                                                pedido
                                                            )
                                                        }

                                                    </div>


                                                    <div className="ruta-pedido-meta">

                                                        <span>

                                                            {
                                                                formatearFecha(
                                                                    pedido.fecha
                                                                )
                                                            }

                                                        </span>


                                                        <span>

                                                            $

                                                            {
                                                                Number(
                                                                    pedido.total
                                                                ).toFixed(2)
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    }

                                )

                            }

                        </div>

                    )
                }


                <div className="ruta-panel-footer">

                    <span>

                        {
                            pedidosSeleccionados.length
                        }

                        {" "}

                        pedido(s) seleccionado(s)

                    </span>


                    <button

                        type="button"

                        className="btn-primary"

                        onClick={
                            generarRuta
                        }

                        disabled={
                            !pedidosSeleccionados.length
                            ||
                            generando
                        }

                    >

                        {
                            generando
                                ? "Calculando ruta..."
                                : "Generar ruta"
                        }

                    </button>

                </div>

            </section>


            {
                ruta && (

                    <section className="ruta-panel ruta-propuesta">

                        <div className="ruta-panel-header">

                            <div>

                                <h2>
                                    Ruta propuesta
                                </h2>

                                <p>
                                    Revisa el orden antes
                                    de iniciar la ruta.
                                </p>

                            </div>

                        </div>


                        <div className="ruta-resumen">

                            <div className="ruta-resumen-item">

                                <strong>
                                    {ruta.pedidos?.length || 0}
                                </strong>

                                <span>
                                    pedidos
                                </span>

                            </div>


                            <div className="ruta-resumen-item">

                                <strong>
                                    {
                                        ruta.distanciaKm
                                    }
                                    {" km"}
                                </strong>

                                <span>
                                    distancia
                                </span>

                            </div>


                            <div className="ruta-resumen-item">

                                <strong>
                                    {
                                        ruta.duracionMinutos
                                    }
                                    {" min"}
                                </strong>

                                <span>
                                    tiempo estimado
                                </span>

                            </div>

                        </div>


                        <div className="ruta-recorrido">

                            <div className="ruta-punto inicio">

                                <div className="ruta-punto-numero">

                                    🚚

                                </div>

                                <div>

                                    <strong>
                                        Purificadora
                                    </strong>

                                    <span>
                                        Punto de salida
                                    </span>

                                </div>

                            </div>


                            {
                                ruta.pedidos?.map(
                                    (pedido, indice) => (

                                        <div
                                            className="ruta-punto"
                                            key={
                                                pedido.id
                                            }
                                        >

                                            <div className="ruta-punto-numero">

                                                {
                                                    indice + 1
                                                }

                                            </div>


                                            <div>

                                                <strong>

                                                    {
                                                        pedido.cliente
                                                            ?.nombre
                                                    }

                                                </strong>


                                                <span>

                                                    {
                                                        pedido.cliente
                                                            ?.direccion
                                                    }

                                                </span>


                                                <small>

                                                    {
                                                        obtenerResumenProductos(
                                                            pedido
                                                        )
                                                    }

                                                </small>

                                            </div>

                                        </div>

                                    )
                                )

                            }

                        </div>


                        <div className="ruta-propuesta-footer">

                            <button

                                type="button"

                                className="btn-secundario"

                                onClick={
                                    limpiarSeleccion
                                }

                                disabled={
                                    iniciando
                                }

                            >

                                Cancelar

                            </button>


                            <button

                                type="button"

                                className="btn-primary"

                                onClick={
                                    iniciarRuta
                                }

                                disabled={
                                    iniciando
                                }

                            >

                                {
                                    iniciando
                                        ? "Iniciando..."
                                        : "Iniciar ruta"
                                }

                            </button>

                        </div>

                    </section>

                )
            }

        </div>

    );

}