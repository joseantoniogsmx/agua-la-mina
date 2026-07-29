export default function DatosCliente({ cliente, actualizar }) {
    return (
        <section className="cliente-seccion">

            <h3>👤 Datos del cliente</h3>

            <div className="cliente-grid">

                <div className="campo">
                    <label>Nombre *</label>

                    <input
                        type="text"
                        value={cliente.nombre}
                        onChange={(e) =>
                            actualizar("nombre", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Alias</label>

                    <input
                        type="text"
                        value={cliente.alias}
                        onChange={(e) =>
                            actualizar("alias", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Teléfono *</label>

                    <input
                        type="text"
                        value={cliente.telefono}
                        onChange={(e) =>
                            actualizar("telefono", e.target.value)
                        }
                    />
                </div>

                <div className="campo">
                    <label>Tipo de cliente</label>

                    <select
                        value={cliente.tipoCliente}
                        onChange={(e) =>
                            actualizar("tipoCliente", e.target.value)
                        }
                    >
                        <option value="">Seleccione...</option>
                        <option value="PARTICULAR">Particular</option>
                        <option value="NEGOCIO">Negocio</option>
                        <option value="ESCUELA">Escuela</option>
                        <option value="OFICINA">Oficina</option>
                        <option value="GOBIERNO">Gobierno</option>
                        <option value="OTRO">Otro</option>
                    </select>
                </div>

            </div>

        </section>
    );
}