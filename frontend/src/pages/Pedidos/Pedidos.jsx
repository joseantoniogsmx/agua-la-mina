import { useEffect, useMemo, useState } from "react";

import {
    obtenerPedidos,
    crearPedidoV2
} from "../../services/pedidoService";

import { obtenerProductos } from "../../services/productoService";

import "./Pedidos.css";

export default function Pedidos() {

    const [pedidos, setPedidos] = useState([]);
    const [productos, setProductos] = useState([]);

    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const [cantidad, setCantidad] = useState(1);

    const [prestados, setPrestados] = useState(0);

    const [pedidoActual, setPedidoActual] = useState([]);

    useEffect(() => {

        async function cargar() {

            try {

                const listaPedidos = await obtenerPedidos();
                const listaProductos = await obtenerProductos();

                setPedidos(listaPedidos);
                setProductos(listaProductos);

            } catch (error) {

                console.error(error);

            }

        }

        cargar();

    }, []);

    function agregarProducto() {

        if (!productoSeleccionado) return;

        const subtotal =
            productoSeleccionado.precio * cantidad;

        setPedidoActual([
            ...pedidoActual,
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

        if (pedidoActual.length === 0) {

            alert("Agrega al menos un producto.");

            return;

        }

        const request = {

            // temporalmente fijo hasta construir el selector de clientes
            clienteId: 1,

            prioridad: "NORMAL",

            notas: "",

            detalles: pedidoActual.map(item => ({

                productoId: item.producto.id,

                cantidad: item.cantidad,

                prestados: item.prestados

            }))

        };

        try {

            await crearPedidoV2(request);

            alert("Pedido registrado correctamente.");

            setPedidoActual([]);

            const listaPedidos = await obtenerPedidos();

            setPedidos(listaPedidos);

        } catch (error) {

            console.error(error);

            alert("No fue posible guardar el pedido.");

        }

    }

    return (

        <div className="pedidos-page">

            <div className="pedidos-header">

                <div>

                    <h1>Pedidos</h1>

                    <p>Administración de pedidos</p>

                </div>

            </div>

            <section className="nuevo-pedido">

                <h2>Nuevo pedido</h2>

                <div className="selector-productos">

                    {productos.map((producto) => (

                        <button

                            key={producto.id}

                            className={
                                productoSeleccionado?.id === producto.id
                                    ? "producto seleccionado"
                                    : "producto"
                            }

                            style={{
                                borderColor: producto.colorPrincipal
                            }}

                            onClick={() =>
                                setProductoSeleccionado(producto)
                            }

                        >

                            <img
                                src={`/productos/${producto.imagen}`}
                                alt={producto.marca}
                            />

                            <strong>

                                {producto.marca}

                            </strong>

                            <span>

                                ${producto.precio}

                            </span>

                        </button>

                    ))}

                </div>

                <div className="controles">

                    <div>

                        <label>Cantidad</label>

                        <input

                            type="number"

                            min="1"

                            value={cantidad}

                            onChange={(e) =>
                                setCantidad(Number(e.target.value))
                            }

                        />

                    </div>

                    <div>

                        <label>Prestados</label>

                        <input

                            type="number"

                            min="0"

                            value={prestados}

                            onChange={(e) =>
                                setPrestados(Number(e.target.value))
                            }

                        />

                    </div>

                </div>

                <button
                    className="btn-primary"
                    onClick={agregarProducto}
                >

                    + Agregar al pedido

                </button>

            </section>

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

                                <strong>

                                    {item.producto.marca}

                                </strong>

                                <span>

                                    Cantidad: {item.cantidad}

                                </span>

                                <span>

                                    Prestados: {item.prestados}

                                </span>

                                <span>

                                    ${item.subtotal.toFixed(2)}

                                </span>

                                <button
                                    onClick={() => eliminarLinea(index)}
                                >

                                    ❌

                                </button>

                            </div>

                        ))

                }

                <hr />

                <h3>

                    Total: ${totalPedido.toFixed(2)}

                </h3>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "15px"
                    }}
                >

                    <button
                        className="btn-primary"
                        onClick={guardarPedido}
                    >

                        Guardar pedido

                    </button>

                    <button
                        className="btn-secondary"
                        onClick={vaciarPedido}
                    >

                        Vaciar pedido

                    </button>

                </div>

            </section>

            <section>

                <h2>Pedidos registrados</h2>

                <pre>

                    {JSON.stringify(pedidos, null, 2)}

                </pre>

            </section>

        </div>

    );

}