export default function ClienteSelector({

    clientes,

    clienteSeleccionado,

    setClienteSeleccionado,

    prioridad,

    setPrioridad

}) {

    return (

        <div className="controles">

            <div>

                <label>Cliente</label>

                <select

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

            <div>

                <label>Prioridad</label>

                <select

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