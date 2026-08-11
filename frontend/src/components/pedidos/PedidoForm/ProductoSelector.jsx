import "./ProductoSelector.css";

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

    const datosValidos =
        productoSeleccionado &&
        Number(cantidad) >= 1 &&
        Number(prestados) >= 0 &&
        Number(prestados) <= Number(cantidad);


    function seleccionarProducto(producto) {

        setProductoSeleccionado(producto);

        setCantidad(1);

        setPrestados(0);

    }


    function cambiarCantidad(valor) {

        const nuevaCantidad = Math.max(

            1,

            Number(valor) || 1

        );

        setCantidad(nuevaCantidad);

        if (Number(prestados) > nuevaCantidad) {

            setPrestados(nuevaCantidad);

        }

    }


    function cambiarPrestados(valor) {

        const nuevosPrestados = Math.max(

            0,

            Number(valor) || 0

        );

        setPrestados(

            Math.min(

                nuevosPrestados,

                Number(cantidad)

            )

        );

    }


    return (

        <>

            <hr className="separador-productos" />

            <h3 className="titulo-productos">

                Selecciona un producto

            </h3>


            <div className="selector-productos">

                {

                    productos.map((producto) => {

                        const seleccionado =

                            productoSeleccionado?.id ===

                            producto.id;


                        return (

                            <div

                                key={producto.id}

                                className={

                                    seleccionado

                                        ? "producto-card seleccionado"

                                        : "producto-card"

                                }

                                onClick={() =>

                                    seleccionarProducto(

                                        producto

                                    )

                                }

                            >

                                {

                                    seleccionado && (

                                        <div className="check">

                                            ✓

                                        </div>

                                    )

                                }


                                <img

                                    src={`/productos/${producto.imagen}`}

                                    alt={producto.marca}

                                    className="producto-imagen"

                                />


                                <h4>

                                    {producto.marca}

                                </h4>


                                <p>

                                    {producto.capacidadLitros} L

                                </p>


                                <div className="precio">

                                    $

                                    {

                                        Number(

                                            producto.precio

                                        ).toFixed(2)

                                    }

                                </div>


                                {

                                    seleccionado && (

                                        <div

                                            className="producto-configuracion"

                                            onClick={(e) =>

                                                e.stopPropagation()

                                            }

                                        >

                                            <div className="inputs-card">

                                                <div>

                                                    <label>

                                                        Cantidad

                                                    </label>

                                                    <input

                                                        type="number"

                                                        min="1"

                                                        value={cantidad}

                                                        onChange={(e) =>

                                                            cambiarCantidad(

                                                                e.target.value

                                                            )

                                                        }

                                                    />

                                                </div>


                                                <div>

                                                    <label>

                                                        Garrafones prestados

                                                    </label>

                                                    <input

                                                        type="number"

                                                        min="0"

                                                        max={cantidad}

                                                        value={prestados}

                                                        onChange={(e) =>

                                                            cambiarPrestados(

                                                                e.target.value

                                                            )

                                                        }

                                                    />


                                                    {

                                                        prestados >

                                                            cantidad && (

                                                            <small className="input-error">

                                                                Los prestados no pueden ser mayores que la cantidad comprada.

                                                            </small>

                                                        )

                                                    }

                                                </div>

                                            </div>


                                            <button

                                                type="button"

                                                className="btn-agregar"

                                                disabled={!datosValidos}

                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    onAgregarProducto();

                                                }}

                                            >

                                                + Agregar al pedido

                                            </button>

                                        </div>

                                    )

                                }

                            </div>

                        );

                    })

                }

            </div>

        </>

    );

}