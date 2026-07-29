export default function ProductoSelector({

    productos,

    productoSeleccionado,

    setProductoSeleccionado,

    cantidad,

    setCantidad,

    prestados,

    setPrestados,

    onAgregarProducto

}) {

    return (

        <>

            <hr style={{ margin: "20px 0" }} />

            <div className="selector-productos">

                {

                    productos.map(producto => (

                        <button

                            key={producto.id}

                            type="button"

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

                                {producto.capacidadLitros} L

                            </span>

                            <span>

                                ${Number(producto.precio).toFixed(2)}

                            </span>

                        </button>

                    ))

                }

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

                    <label>Garrafones prestados</label>

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

                type="button"

                className="btn-primary"

                disabled={!productoSeleccionado}

                onClick={onAgregarProducto}

            >

                + Agregar al pedido

            </button>

        </>

    );

}