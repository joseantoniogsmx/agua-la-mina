import {
    useEffect,
    useMemo,
    useState
} from "react";

import ClienteSelector from "./ClienteSelector";
import ProductoSelector from "./ProductoSelector";
import PedidoActual from "./PedidoActual";

import {
    actualizarPedido
} from "../../../services/pedidoService";


export default function PedidoForm({

    clientes,
    productos,
    onGuardar,
    pedidoEditando,
    onCancelarEdicion

}) {

    const [clienteSeleccionado, setClienteSeleccionado] =
        useState("");

    const [prioridad, setPrioridad] =
        useState("NORMAL");

    const [notas, setNotas] =
        useState("");

    const [productoSeleccionado, setProductoSeleccionado] =
        useState(null);

    const [cantidad, setCantidad] =
        useState(1);

    const [prestados, setPrestados] =
        useState(0);

    const [pedidoActual, setPedidoActual] =
        useState([]);

    const [guardando, setGuardando] =
        useState(false);


    const modoEdicion =
        pedidoEditando !== null &&
        pedidoEditando !== undefined;


    /*
     * ==========================================================
     * CARGAR PEDIDO PARA EDICIÓN
     * ==========================================================
     */

    useEffect(() => {

        if (!modoEdicion) {
            return;
        }

        setClienteSeleccionado(
            pedidoEditando.cliente?.id
                ? String(
                    pedidoEditando.cliente.id
                )
                : ""
        );

        setPrioridad(
            pedidoEditando.prioridad ||
            "NORMAL"
        );

        setNotas(
            pedidoEditando.notas ||
            ""
        );

        const detalles =
            pedidoEditando.detalles || [];

        const detallesEditados =
            detalles.map((detalle) => {

                const producto =
                    productos.find(
                        (item) =>
                            Number(item.id) ===
                            Number(
                                detalle.productoId
                            )
                    );

                return {

                    producto:
                        producto || {
                            id: detalle.productoId,
                            marca: detalle.marca,
                            capacidadLitros:
                                detalle.capacidadLitros,
                            precio:
                                detalle.precioUnitario
                        },

                    cantidad:
                        Number(
                            detalle.cantidad || 0
                        ),

                    prestados:
                        Number(
                            detalle.prestados || 0
                        ),

                    subtotal:
                        Number(
                            detalle.subtotal || 0
                        )

                };

            });

        setPedidoActual(
            detallesEditados
        );

        setProductoSeleccionado(null);

        setCantidad(1);

        setPrestados(0);

    }, [
        pedidoEditando,
        productos,
        modoEdicion
    ]);


    /*
     * ==========================================================
     * AGREGAR PRODUCTO
     * ==========================================================
     */

    function agregarProducto() {

        if (!productoSeleccionado) {

            alert(
                "Selecciona un producto."
            );

            return;
        }

        if (cantidad <= 0) {

            alert(
                "La cantidad debe ser mayor que cero."
            );

            return;
        }

        if (prestados < 0) {

            alert(
                "Los garrafones prestados no pueden ser negativos."
            );

            return;
        }

        if (prestados > cantidad) {

            alert(
                "No puedes prestar más garrafones de los que se están comprando."
            );

            return;
        }

        const subtotal =
            Number(
                productoSeleccionado.precio
            ) * Number(cantidad);

        setPedidoActual((prev) => [

            ...prev,

            {
                producto:
                    productoSeleccionado,

                cantidad:
                    Number(cantidad),

                prestados:
                    Number(prestados),

                subtotal
            }

        ]);

        setCantidad(1);

        setPrestados(0);

        setProductoSeleccionado(null);
    }


    /*
     * ==========================================================
     * ELIMINAR LÍNEA
     * ==========================================================
     */

    function eliminarLinea(index) {

        setPedidoActual(
            (prev) =>
                prev.filter(
                    (_, i) =>
                        i !== index
                )
        );
    }


    /*
     * ==========================================================
     * VACIAR PEDIDO
     * ==========================================================
     */

    function vaciarPedido() {

        setPedidoActual([]);

    }


    /*
     * ==========================================================
     * TOTAL
     * ==========================================================
     */

    const totalPedido =
        useMemo(() => {

            return pedidoActual.reduce(

                (total, item) =>
                    total +
                    Number(
                        item.subtotal || 0
                    ),

                0

            );

        }, [
            pedidoActual
        ]);


    /*
     * ==========================================================
     * LIMPIAR FORMULARIO
     * ==========================================================
     */

    function limpiarFormulario() {

        setPedidoActual([]);

        setClienteSeleccionado("");

        setPrioridad("NORMAL");

        setNotas("");

        setCantidad(1);

        setPrestados(0);

        setProductoSeleccionado(null);
    }


    /*
     * ==========================================================
     * CANCELAR EDICIÓN
     * ==========================================================
     */

    function cancelarEdicion() {

        limpiarFormulario();

        if (onCancelarEdicion) {

            onCancelarEdicion();

        }
    }


    /*
     * ==========================================================
     * GUARDAR
     * ==========================================================
     */

    async function guardarPedido() {

        if (!clienteSeleccionado) {

            alert(
                "Selecciona un cliente."
            );

            return;
        }

        if (pedidoActual.length === 0) {

            alert(
                "Agrega al menos un producto."
            );

            return;
        }


        const request = {

            clienteId:
                Number(
                    clienteSeleccionado
                ),

            prioridad,

            notas,

            detalles:
                pedidoActual.map(
                    (item) => ({

                        productoId:
                            Number(
                                item.producto.id
                            ),

                        cantidad:
                            Number(
                                item.cantidad
                            ),

                        prestados:
                            Number(
                                item.prestados || 0
                            )

                    })
                )

        };


        try {

            setGuardando(true);


            /*
             * ==================================================
             * EDICIÓN
             * ==================================================
             */

            if (modoEdicion) {

                await actualizarPedido(

                    pedidoEditando.id,

                    request

                );

                alert(
                    "Pedido actualizado correctamente."
                );

            }

            /*
             * ==================================================
             * CREACIÓN
             * ==================================================
             */

            else {

                await onGuardar(
                    request
                );

            }


            limpiarFormulario();


            if (onCancelarEdicion) {

                onCancelarEdicion();

            }

        } catch (error) {

            console.error(
                "Error al guardar el pedido:",
                error
            );

            alert(

                error?.message ||

                "No fue posible guardar el pedido."

            );

        } finally {

            setGuardando(false);

        }

    }


    return (

        <section className="nuevo-pedido">

            <div className="pedido-form-header">

                <h2>

                    {
                        modoEdicion
                            ? `Editar pedido #${pedidoEditando.id}`
                            : "Nuevo pedido"
                    }

                </h2>

                {
                    modoEdicion && (

                        <span className="pedido-form-modo-edicion">

                            Pedido pendiente

                        </span>

                    )
                }

            </div>


            <ClienteSelector

                clientes={
                    clientes
                }

                clienteSeleccionado={
                    clienteSeleccionado
                }

                setClienteSeleccionado={
                    setClienteSeleccionado
                }

                prioridad={
                    prioridad
                }

                setPrioridad={
                    setPrioridad
                }

            />


            <div
                style={{
                    marginTop: "15px"
                }}
            >

                <label>
                    Observaciones
                </label>

                <textarea

                    rows={3}

                    value={
                        notas
                    }

                    onChange={(e) =>
                        setNotas(
                            e.target.value
                        )
                    }

                />

            </div>


            <ProductoSelector

                productos={
                    productos
                }

                productoSeleccionado={
                    productoSeleccionado
                }

                setProductoSeleccionado={
                    setProductoSeleccionado
                }

                cantidad={
                    cantidad
                }

                setCantidad={
                    setCantidad
                }

                prestados={
                    prestados
                }

                setPrestados={
                    setPrestados
                }

                onAgregarProducto={
                    agregarProducto
                }

            />


            <PedidoActual

                pedidoActual={
                    pedidoActual
                }

                totalPedido={
                    totalPedido
                }

                onEliminarLinea={
                    eliminarLinea
                }

                onVaciarPedido={
                    vaciarPedido
                }

                onGuardarPedido={
                    guardarPedido
                }

                modoEdicion={
                    modoEdicion
                }

                guardando={
                    guardando
                }

            />

        </section>

    );

}