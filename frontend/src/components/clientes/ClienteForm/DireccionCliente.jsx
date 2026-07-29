export default function DireccionCliente({ cliente, actualizar }) {

    return (

        <section className="cliente-seccion">

            <h3>📍 Dirección</h3>

            <div className="cliente-grid">

                <div className="campo">
                    <label>Calle</label>

                    <input
                        type="text"
                        value={cliente.calle}
                        onChange={(e) =>
                            actualizar("calle", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Número exterior</label>

                    <input
                        type="text"
                        value={cliente.numeroExterior}
                        onChange={(e) =>
                            actualizar("numeroExterior", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Número interior</label>

                    <input
                        type="text"
                        value={cliente.numeroInterior}
                        onChange={(e) =>
                            actualizar("numeroInterior", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Colonia</label>

                    <input
                        type="text"
                        value={cliente.colonia}
                        onChange={(e) =>
                            actualizar("colonia", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Localidad</label>

                    <input
                        type="text"
                        value={cliente.localidad}
                        onChange={(e) =>
                            actualizar("localidad", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Municipio</label>

                    <input
                        type="text"
                        value={cliente.municipio}
                        onChange={(e) =>
                            actualizar("municipio", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Estado</label>

                    <input
                        type="text"
                        value={cliente.estado}
                        onChange={(e) =>
                            actualizar("estado", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Código Postal</label>

                    <input
                        type="text"
                        value={cliente.codigoPostal}
                        onChange={(e) =>
                            actualizar("codigoPostal", e.target.value)
                        }
                    />
                </div>

                <div className="campo campo-completo">
                    <label>Referencias</label>

                    <textarea
                        rows={3}
                        value={cliente.referencias}
                        onChange={(e) =>
                            actualizar("referencias", e.target.value)
                        }
                    />
                </div>

            </div>

        </section>

    );

}