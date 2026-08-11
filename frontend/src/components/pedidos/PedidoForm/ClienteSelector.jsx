export default function ClienteSelector({

    clientes,

    clienteSeleccionado,

    setClienteSeleccionado,

    prioridad,

    setPrioridad

}) {

    return (

        <div className="cliente-prioridad">

            <div className="campo-pedido">

                <label htmlFor="cliente">

                    Cliente

                </label>

                <select

                    id="cliente"

                    value={clienteSeleccionado}

                    onChange={(e) =>
                        setClienteSeleccionado(e.target.value)
                    }

                >

                    <option value="">

                        Selecciona un cliente

                    </option>

                    {

                        clientes.map(cliente => (

                            <option

                                key={cliente.id}

                                value={cliente.id}

                            >

                                {cliente.nombre}

                            </option>

                        ))

                    }

                </select>

            </div>


            <div className="campo-pedido">

                <label htmlFor="prioridad">

                    Prioridad

                </label>

                <select

                    id="prioridad"

                    value={prioridad}

                    onChange={(e) =>
                        setPrioridad(e.target.value)
                    }

                >

                    <option value="NORMAL">

                        Normal

                    </option>

                    <option value="URGENTE">

                        Urgente

                    </option>

                </select>

            </div>

        </div>

    );

}