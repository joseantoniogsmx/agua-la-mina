export default function ObservacionesCliente({
    cliente,
    actualizar
}) {

    return (

        <section className="cliente-seccion">

            <h3>📝 Observaciones</h3>

            <div className="cliente-grid">

                <div className="campo campo-completo">

                    <label>Observaciones</label>

                    <textarea
                        rows={4}
                        value={cliente.observaciones}
                        onChange={(e) =>
                            actualizar(
                                "observaciones",
                                e.target.value
                            )
                        }
                        placeholder="Información adicional del cliente..."
                    />

                </div>

            </div>

        </section>

    );

}