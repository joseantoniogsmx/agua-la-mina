import AddressPicker from "../../maps/AddressPicker";

export default function UbicacionCliente({
    cliente,
    actualizarUbicacion
}) {

    return (

        <section className="cliente-seccion">

            <h3>🗺️ Ubicación</h3>

            <div className="cliente-grid">

                <div className="campo campo-completo">

                    <label>Dirección detectada por Google</label>

                    <input
                        type="text"
                        value={cliente.direccion || ""}
                        readOnly
                    />

                </div>

                <div className="campo campo-completo">

                    <AddressPicker
                        value={{
                            texto: cliente.direccion,
                            lat: cliente.latitud,
                            lng: cliente.longitud
                        }}
                        onChange={actualizarUbicacion}
                    />

                </div>

                <div className="campo">

                    <label>Latitud</label>

                    <input
                        type="text"
                        value={cliente.latitud ?? ""}
                        readOnly
                    />

                </div>

                <div className="campo">

                    <label>Longitud</label>

                    <input
                        type="text"
                        value={cliente.longitud ?? ""}
                        readOnly
                    />

                </div>

            </div>

        </section>

    );

}