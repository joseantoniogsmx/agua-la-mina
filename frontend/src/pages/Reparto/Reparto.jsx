import { useEffect, useRef, useState } from "react";

import {
    loadMapsLibrary,
    loadCoreLibrary,
    loadMarkerLibrary,
    loadRoutesLibrary
} from "../../services/googleMaps/GoogleMapsLoader";

import {
    obtenerEnviosEnRuta,
    obtenerEnvio
} from "../../services/envioService";

import {
    marcarPedidoComoEntregado
} from "../../services/pedidoService";

import "./Reparto.css";


const PURIFICADORA = {
    lat: 19.893916,
    lng: -100.984136,
    nombre: "Agua La Mina"
};


function obtenerPedidos(envio) {

    return Array.isArray(envio?.pedidos)
        ? envio.pedidos
        : [];
}


function obtenerCoordenadasPedido(pedido) {

    const lat = Number(
        pedido?.cliente?.latitud
    );

    const lng = Number(
        pedido?.cliente?.longitud
    );

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        return null;
    }

    return {
        lat,
        lng
    };
}


function formatearDistancia(distancia) {

    if (
        distancia === null ||
        distancia === undefined
    ) {
        return "—";
    }

    return `${Number(distancia).toFixed(2)} km`;
}


function formatearDuracion(duracion) {

    if (
        duracion === null ||
        duracion === undefined
    ) {
        return "—";
    }

    return `${duracion} min`;
}


function formatearMoneda(valor) {

    return `$${Number(
        valor ?? 0
    ).toFixed(2)}`;
}


function formatearDireccion(cliente) {

    if (!cliente) {
        return "Sin dirección registrada";
    }

    return cliente.direccion ||
        "Sin dirección registrada";
}


export default function Reparto() {

    const mapaRef = useRef(null);
    const mapaInstanceRef = useRef(null);

    const markersRef = useRef([]);
    const polylinesRef = useRef([]);

    const [envios, setEnvios] = useState([]);

    const [envioSeleccionado, setEnvioSeleccionado] =
        useState(null);

    const [cargando, setCargando] =
        useState(true);

    const [cargandoRuta, setCargandoRuta] =
        useState(false);

    const [entregandoPedido, setEntregandoPedido] =
        useState(null);

    const [error, setError] =
        useState("");


    /*
     * ==========================================================
     * CARGAR ENVÍOS EN RUTA
     * ==========================================================
     */

    useEffect(() => {

        async function cargarEnvios() {

            try {

                setCargando(true);
                setError("");

                const datos =
                    await obtenerEnviosEnRuta();

                setEnvios(
                    Array.isArray(datos)
                        ? datos
                        : []
                );

            } catch (err) {

                console.error(
                    "Error al cargar los envíos:",
                    err
                );

                setError(
                    "No fue posible cargar los envíos en ruta."
                );

            } finally {

                setCargando(false);
            }
        }

        cargarEnvios();

    }, []);


    /*
     * ==========================================================
     * INICIALIZAR GOOGLE MAPS
     * ==========================================================
     */

    useEffect(() => {

        let cancelado = false;

        async function inicializarMapa() {

            try {

                const [
                    { Map },
                    { LatLngBounds }
                ] = await Promise.all([
                    loadMapsLibrary(),
                    loadCoreLibrary()
                ]);

                if (
                    cancelado ||
                    !mapaRef.current
                ) {
                    return;
                }

                const map = new Map(
                    mapaRef.current,
                    {
                        center: {
                            lat: PURIFICADORA.lat,
                            lng: PURIFICADORA.lng
                        },
                        zoom: 15,
                        mapId:
                            import.meta.env
                                .VITE_GOOGLE_MAP_ID,
                        mapTypeControl: true,
                        streetViewControl: true,
                        fullscreenControl: true
                    }
                );

                mapaInstanceRef.current = map;

                map.__LatLngBounds =
                    LatLngBounds;

            } catch (err) {

                console.error(
                    "Error al inicializar Google Maps:",
                    err
                );

                if (!cancelado) {

                    setError(
                        "No fue posible cargar Google Maps."
                    );
                }
            }
        }

        inicializarMapa();

        return () => {

            cancelado = true;

            limpiarMarcadores();
            limpiarRuta();

            mapaInstanceRef.current = null;
        };

    }, []);


    /*
     * ==========================================================
     * SELECCIONAR PRIMER ENVÍO
     * ==========================================================
     */

    useEffect(() => {

        if (
            envios.length === 0 ||
            envioSeleccionado
        ) {
            return;
        }

        seleccionarEnvio(
            envios[0]
        );

    }, [envios]);


    /*
     * ==========================================================
     * SELECCIONAR ENVÍO
     * ==========================================================
     */

    async function seleccionarEnvio(
        envio
    ) {

        try {

            setError("");
            setEnvioSeleccionado(envio);

            let envioCompleto = envio;


            if (
                !Array.isArray(envio?.pedidos) ||
                envio.pedidos.length === 0
            ) {

                envioCompleto =
                    await obtenerEnvio(
                        envio.id
                    );
            }


            setEnvioSeleccionado(
                envioCompleto
            );


            await dibujarEnvio(
                envioCompleto
            );

        } catch (err) {

            console.error(
                "Error al seleccionar el envío:",
                err
            );

            setError(
                "No fue posible cargar el detalle del envío."
            );
        }
    }


    /*
     * ==========================================================
     * MARCAR PEDIDO COMO ENTREGADO
     * ==========================================================
     */

    async function entregarPedido(
        pedido
    ) {

        if (
            !pedido?.id ||
            pedido.estado !== "EN_RUTA"
        ) {
            return;
        }


        try {

            setError("");

            setEntregandoPedido(
                pedido.id
            );


            await marcarPedidoComoEntregado(
                pedido.id
            );


            /*
             * Volvemos a consultar el envío
             * para obtener los estados reales
             * del backend.
             */
            const envioActualizado =
                await obtenerEnvio(
                    envioSeleccionado.id
                );


            setEnvioSeleccionado(
                envioActualizado
            );


            /*
             * Actualizamos la lista lateral.
             *
             * Si el envío ya fue completado,
             * deja de pertenecer a EN_RUTA.
             */
            if (
                envioActualizado.estado ===
                "COMPLETADO"
            ) {

                setEnvios(
                    listaActual =>
                        listaActual.filter(
                            envio =>
                                envio.id !==
                                envioActualizado.id
                        )
                );

            } else {

                setEnvios(
                    listaActual =>
                        listaActual.map(
                            envio =>
                                envio.id ===
                                envioActualizado.id
                                    ? envioActualizado
                                    : envio
                        )
                );
            }


            /*
             * Volvemos a dibujar el envío
             * para conservar los marcadores
             * y la ruta.
             */
            if (
                envioActualizado.estado ===
                "EN_RUTA"
            ) {

                await dibujarEnvio(
                    envioActualizado
                );
            }

        } catch (err) {

            console.error(
                "Error al entregar el pedido:",
                err
            );

            setError(
                err?.message ||
                "No fue posible registrar la entrega."
            );

        } finally {

            setEntregandoPedido(
                null
            );
        }
    }


    /*
     * ==========================================================
     * LIMPIAR MARCADORES
     * ==========================================================
     */

    function limpiarMarcadores() {

        markersRef.current.forEach(
            marker => {

                marker.map = null;
            }
        );

        markersRef.current = [];
    }


    /*
     * ==========================================================
     * LIMPIAR RUTA
     * ==========================================================
     */

    function limpiarRuta() {

        polylinesRef.current.forEach(
            polyline => {

                polyline.setMap(null);
            }
        );

        polylinesRef.current = [];
    }


    /*
     * ==========================================================
     * MARCADORES
     * ==========================================================
     */

    async function dibujarMarcadores(
        pedidos
    ) {

        const {
            AdvancedMarkerElement,
            PinElement
        } = await loadMarkerLibrary();

        const map =
            mapaInstanceRef.current;

        if (!map) {
            return;
        }


        limpiarMarcadores();


        /*
         * Purificadora.
         */
        const pinOrigen =
            new PinElement({
                glyphText: "A"
            });


        const marcadorOrigen =
            new AdvancedMarkerElement({
                map,
                position: {
                    lat: PURIFICADORA.lat,
                    lng: PURIFICADORA.lng
                },
                title:
                    PURIFICADORA.nombre,
                content:
                    pinOrigen
            });


        markersRef.current.push(
            marcadorOrigen
        );


        /*
         * Clientes.
         */
        pedidos.forEach(
            (pedido, indice) => {

                const coordenadas =
                    obtenerCoordenadasPedido(
                        pedido
                    );


                if (!coordenadas) {
                    return;
                }


                const numero =
                    pedido?.ordenRuta ??
                    indice + 1;


                const pinCliente =
                    new PinElement({
                        glyphText:
                            String(numero)
                    });


                const marcador =
                    new AdvancedMarkerElement({
                        map,
                        position:
                            coordenadas,
                        title:
                            pedido?.cliente?.nombre ||
                            `Cliente ${numero}`,
                        content:
                            pinCliente
                    });


                markersRef.current.push(
                    marcador
                );
            }
        );
    }


    /*
     * ==========================================================
     * AJUSTAR VISTA
     * ==========================================================
     */

    function ajustarVista(
        pedidos,
        ruta
    ) {

        const map =
            mapaInstanceRef.current;

        if (!map) {
            return;
        }


        const LatLngBounds =
            map.__LatLngBounds;


        if (!LatLngBounds) {
            return;
        }


        const bounds =
            new LatLngBounds();


        bounds.extend({
            lat: PURIFICADORA.lat,
            lng: PURIFICADORA.lng
        });


        pedidos.forEach(
            pedido => {

                const coordenadas =
                    obtenerCoordenadasPedido(
                        pedido
                    );


                if (coordenadas) {

                    bounds.extend(
                        coordenadas
                    );
                }
            }
        );


        if (ruta?.viewport) {

            map.fitBounds(
                ruta.viewport
            );

        } else {

            map.fitBounds(
                bounds
            );
        }
    }


    /*
     * ==========================================================
     * CALCULAR RUTA
     * ==========================================================
     */

    async function calcularRuta(
        pedidos
    ) {

        const map =
            mapaInstanceRef.current;


        if (
            !map ||
            pedidos.length === 0
        ) {
            return null;
        }


        const {
            Route
        } = await loadRoutesLibrary();


        const pedidosOrdenados =
            [...pedidos].sort(
                (a, b) =>
                    (a.ordenRuta ?? 9999) -
                    (b.ordenRuta ?? 9999)
            );


        const ultimoPedido =
            pedidosOrdenados[
                pedidosOrdenados.length - 1
            ];


        const destino =
            obtenerCoordenadasPedido(
                ultimoPedido
            );


        if (!destino) {

            throw new Error(
                "El último pedido no tiene coordenadas válidas."
            );
        }


        const intermediates =
            pedidosOrdenados
                .slice(0, -1)
                .map(
                    pedido => {

                        const coordenadas =
                            obtenerCoordenadasPedido(
                                pedido
                            );


                        if (!coordenadas) {
                            return null;
                        }


                        return {
                            location:
                                coordenadas,
                            vehicleStopover:
                                true
                        };
                    }
                )
                .filter(Boolean);


        const request = {

            origin: {
                lat:
                    Number(
                        PURIFICADORA.lat
                    ),
                lng:
                    Number(
                        PURIFICADORA.lng
                    )
            },


            destination: {
                lat:
                    Number(
                        destino.lat
                    ),
                lng:
                    Number(
                        destino.lng
                    )
            },


            intermediates,


            travelMode:
                "DRIVING",


            fields: [
                "path",
                "legs",
                "viewport",
                "distanceMeters",
                "durationMillis"
            ]
        };


        try {

            const resultado =
                await Route.computeRoutes(
                    request
                );


            if (
                !resultado?.routes ||
                resultado.routes.length === 0
            ) {

                console.warn(
                    "Google Routes no devolvió ninguna ruta."
                );

                return null;
            }


            const ruta =
                resultado.routes[0];


            limpiarRuta();


            const polylines =
                ruta.createPolylines();


            polylines.forEach(
                polyline => {

                    polyline.setMap(
                        map
                    );
                }
            );


            polylinesRef.current =
                polylines;


            ajustarVista(
                pedidosOrdenados,
                ruta
            );


            return ruta;

        } catch (err) {

            console.error(
                "Error al calcular la ruta con Google:",
                err
            );

            throw err;
        }
    }


    /*
     * ==========================================================
     * DIBUJAR ENVÍO
     * ==========================================================
     */

    async function dibujarEnvio(
        envio
    ) {

        const map =
            mapaInstanceRef.current;


        if (!map) {
            return;
        }


        const pedidos =
            obtenerPedidos(envio);


        setCargandoRuta(
            true
        );

        setError("");


        try {

            limpiarMarcadores();
            limpiarRuta();


            await dibujarMarcadores(
                pedidos
            );


            if (pedidos.length === 0) {

                ajustarVista(
                    [],
                    null
                );

                return;
            }


            const ruta =
                await calcularRuta(
                    pedidos
                );


            if (!ruta) {

                setError(
                    "Google Maps no encontró una ruta para este envío."
                );


                ajustarVista(
                    pedidos,
                    null
                );


                return;
            }

        } catch (err) {

            console.error(
                "Error al dibujar el envío:",
                err
            );


            setError(
                "No fue posible calcular la ruta del envío."
            );

        } finally {

            setCargandoRuta(
                false
            );
        }
    }


    /*
     * ==========================================================
     * RENDER
     * ==========================================================
     */

    return (
        <div className="reparto-page">

            <div className="reparto-header">

                <h1>
                    Reparto
                </h1>

                <p>
                    Gestión de entregas y seguimiento de rutas
                </p>

            </div>


            {error && (

                <div className="reparto-error">
                    {error}
                </div>

            )}


            <div className="reparto-content">

                <aside className="reparto-panel">

                    <h2>
                        Envíos en ruta
                    </h2>


                    {cargando ? (

                        <div className="sin-envios">
                            Cargando envíos...
                        </div>

                    ) : envios.length === 0 ? (

                        <div className="sin-envios">
                            No hay envíos actualmente en ruta.
                        </div>

                    ) : (

                        <div className="envios-lista">

                            {envios.map(
                                envio => (

                                    <button
                                        key={
                                            envio.id
                                        }
                                        type="button"
                                        className={
                                            `envio-card ${
                                                envioSeleccionado?.id ===
                                                envio.id
                                                    ? "envio-card-seleccionado"
                                                    : ""
                                            }`
                                        }
                                        onClick={() =>
                                            seleccionarEnvio(
                                                envio
                                            )
                                        }
                                    >

                                        <strong>
                                            {
                                                envio.folio
                                            }
                                        </strong>


                                        <span>
                                            {
                                                envio.pedidos
                                                    ?.length ??
                                                0
                                            }{" "}

                                            {
                                                (
                                                    envio.pedidos
                                                        ?.length ??
                                                    0
                                                ) === 1
                                                    ? "pedido"
                                                    : "pedidos"
                                            }
                                        </span>


                                        <span>
                                            Estado:{" "}
                                            {
                                                envio.estado
                                            }
                                        </span>

                                    </button>
                                )
                            )}

                        </div>
                    )}

                </aside>


                <main className="reparto-main">

                    <div className="reparto-map-container">

                        <div
                            ref={mapaRef}
                            className="reparto-map"
                        />


                        {cargandoRuta && (

                            <div className="mapa-ruta-cargando">
                                Calculando ruta...
                            </div>

                        )}

                    </div>


                    {envioSeleccionado && (

                        <div className="reparto-detalle">

                            <div>

                                <span className="detalle-label">
                                    Envío seleccionado
                                </span>


                                <h2>
                                    {
                                        envioSeleccionado.folio
                                    }
                                </h2>

                            </div>


                            <div className="detalle-metricas">

                                <div>

                                    <span>
                                        Pedidos
                                    </span>

                                    <strong>
                                        {
                                            envioSeleccionado
                                                .pedidos
                                                ?.length ??
                                            0
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Estado
                                    </span>

                                    <strong>
                                        {
                                            envioSeleccionado.estado
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Distancia
                                    </span>

                                    <strong>
                                        {
                                            formatearDistancia(
                                                envioSeleccionado
                                                    .distanciaKm
                                            )
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Duración
                                    </span>

                                    <strong>
                                        {
                                            formatearDuracion(
                                                envioSeleccionado
                                                    .duracionMinutos
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                    )}


                    {envioSeleccionado &&
                        obtenerPedidos(
                            envioSeleccionado
                        ).length > 0 && (

                        <section className="reparto-pedidos">

                            <div className="reparto-pedidos-header">

                                <div>

                                    <span className="detalle-label">
                                        Pedidos
                                    </span>

                                    <h2>
                                        Entregas del envío
                                    </h2>

                                </div>

                            </div>


                            <div className="pedidos-reparto-lista">

                                {[
                                    ...obtenerPedidos(
                                        envioSeleccionado
                                    )
                                ]
                                    .sort(
                                        (a, b) =>
                                            (
                                                a.ordenRuta ??
                                                9999
                                            ) -
                                            (
                                                b.ordenRuta ??
                                                9999
                                            )
                                    )
                                    .map(
                                        (pedido, indice) => {

                                            const entregado =
                                                pedido.estado ===
                                                "ENTREGADO";


                                            const numero =
                                                pedido.ordenRuta ??
                                                indice + 1;


                                            return (

                                                <article
                                                    key={
                                                        pedido.id
                                                    }
                                                    className={
                                                        `pedido-reparto-card ${
                                                            entregado
                                                                ? "pedido-reparto-entregado"
                                                                : ""
                                                        }`
                                                    }
                                                >

                                                    <div className="pedido-reparto-numero">

                                                        {numero}

                                                    </div>


                                                    <div className="pedido-reparto-info">

                                                        <div className="pedido-reparto-cabecera">

                                                            <div>

                                                                <h3>
                                                                    {
                                                                        pedido
                                                                            .cliente
                                                                            ?.nombre ||
                                                                        "Cliente sin nombre"
                                                                    }
                                                                </h3>

                                                                <p>
                                                                    {
                                                                        formatearDireccion(
                                                                            pedido.cliente
                                                                        )
                                                                    }
                                                                </p>

                                                            </div>


                                                            <span
                                                                className={
                                                                    `pedido-reparto-estado ${
                                                                        entregado
                                                                            ? "pedido-reparto-estado-entregado"
                                                                            : "pedido-reparto-estado-ruta"
                                                                    }`
                                                                }
                                                            >
                                                                {
                                                                    entregado
                                                                        ? "ENTREGADO"
                                                                        : "EN RUTA"
                                                                }
                                                            </span>

                                                        </div>


                                                        <div className="pedido-reparto-productos">

                                                            {pedido.detalles?.map(
                                                                detalle => (

                                                                    <div
                                                                        key={
                                                                            detalle.id
                                                                        }
                                                                        className="pedido-reparto-producto"
                                                                    >

                                                                        <span>

                                                                            {
                                                                                detalle.marca ||
                                                                                "Producto"
                                                                            }

                                                                            {" "}

                                                                            {
                                                                                detalle.capacidadLitros
                                                                            }{" "}
                                                                            L

                                                                        </span>


                                                                        <strong>

                                                                            ×{" "}
                                                                            {
                                                                                detalle.cantidad
                                                                            }

                                                                        </strong>

                                                                    </div>

                                                                )
                                                            )}

                                                        </div>


                                                        <div className="pedido-reparto-footer">

                                                            <div>

                                                                <span>
                                                                    Total
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        formatearMoneda(
                                                                            pedido.total
                                                                        )
                                                                    }
                                                                </strong>

                                                            </div>


                                                            {!entregado && (

                                                                <button
                                                                    type="button"
                                                                    className="btn-entregar-pedido"
                                                                    disabled={
                                                                        entregandoPedido ===
                                                                        pedido.id
                                                                    }
                                                                    onClick={() =>
                                                                        entregarPedido(
                                                                            pedido
                                                                        )
                                                                    }
                                                                >

                                                                    {
                                                                        entregandoPedido ===
                                                                        pedido.id
                                                                            ? "Registrando..."
                                                                            : "Entregar pedido"
                                                                    }

                                                                </button>

                                                            )}


                                                            {entregado && (

                                                                <span className="pedido-entregado-confirmacion">
                                                                    ✓ Pedido entregado
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>

                                                </article>

                                            );
                                        }
                                    )}

                            </div>

                        </section>

                    )}

                </main>

            </div>

        </div>
    );
}