import { useMemo, useState } from "react";

import ClienteSelector from "./ClienteSelector";
import ProductoSelector from "./ProductoSelector";
import PedidoActual from "./PedidoActual";

export default function PedidoForm({

    clientes,
    productos,
    onGuardar

}) {

    const [clienteSeleccionado, setClienteSeleccionado] = useState("");

    const [prioridad, setPrioridad] = useState("NORMAL");

    const [notas, setNotas] = useState("");

    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const [cantidad, setCantidad] = useState(1);

    const [prestados, setPrestados] = useState(0);

    const [pedidoActual, setPedidoActual] = useState([]);

    function agregarProducto() {

        if (!productoSeleccionado) {

            alert("Selecciona un producto.");

            return;

        }

        if (cantidad <= 0) {

            alert("La cantidad debe ser mayor que cero.");

            return;

        }

        if (prestados < 0) {

            alert("Los garrafones prestados no pueden ser negativos.");

            return;

        }

        if (prestados > cantidad) {

            alert(
                "No puedes prestar más garrafones de los que se están comprando."
            );

            return;

        }

        const subtotal =
            Number(productoSeleccionado.precio) * cantidad;

        setPedidoActual(prev => [

            ...prev,

            {

                producto: productoSeleccionado,

                cantidad,

                prestados,

                subtotal

            }

        ]);

        setCantidad(1);

        setPrestados(0);

        setProductoSeleccionado(null);

    }

    function eliminarLinea(index) {

        setPedidoActual(

            pedidoActual.filter((_, i) => i !== index)

        );

    }

    function vaciarPedido() {

        setPedidoActual([]);

    }

    const totalPedido = useMemo(() => {

        return pedidoActual.reduce(

            (total, item) => total + item.subtotal,

            0

        );

    }, [pedidoActual]);

    async function guardarPedido() {

        if (!clienteSeleccionado) {

            alert("Selecciona un cliente.");

            return;

        }

        if (pedidoActual.length === 0) {

            alert("Agrega al menos un producto.");

            return;

        }

        const request = {

            clienteId: Number(clienteSeleccionado),

            prioridad,

            notas,

            detalles: pedidoActual.map(item => ({

                productoId: item.producto.id,

                cantidad: item.cantidad,

                prestados: item.prestados

            }))

        };

        try {

            await onGuardar(request);

            setPedidoActual([]);

            setClienteSeleccionado("");

            setPrioridad("NORMAL");

            setNotas("");

            setCantidad(1);

            setPrestados(0);

            setProductoSeleccionado(null);

        } catch (error) {

            console.error(error);

            alert(

                error?.response?.data ||

                "No fue posible guardar el pedido."

            );

        }

    }

    return (

        <section className="nuevo-pedido">

            <h2>Nuevo pedido</h2>

            <ClienteSelector

                clientes={clientes}

                clienteSeleccionado={clienteSeleccionado}

                setClienteSeleccionado={setClienteSeleccionado}

                prioridad={prioridad}

                setPrioridad={setPrioridad}

            />

            <div style={{ marginTop: "15px" }}>

                <label>Observaciones</label>

                <textarea

                    rows={3}

                    value={notas}

                    onChange={(e) =>
                        setNotas(e.target.value)
                    }

                />

            </div>

            <ProductoSelector

                productos={productos}

                productoSeleccionado={productoSeleccionado}

                setProductoSeleccionado={setProductoSeleccionado}

                cantidad={cantidad}

                setCantidad={setCantidad}

                prestados={prestados}

                setPrestados={setPrestados}

                onAgregarProducto={agregarProducto}

            />

            <PedidoActual

                pedidoActual={pedidoActual}

                totalPedido={totalPedido}

                onEliminarLinea={eliminarLinea}

                onVaciarPedido={vaciarPedido}

                onGuardarPedido={guardarPedido}

            />

        </section>

    );

}