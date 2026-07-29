import { useEffect, useState } from "react";

import AddressPicker from "../../maps/AddressPicker";

import "./ClienteForm.css";

export default function ClienteForm({
    abierto,
    onCerrar,
    onGuardar,
    clienteEditar = null
}) {

    const clienteVacio = {
        id: null,
        nombre: "",
        telefono: "",
        direccion: "",
        observaciones: "",
        latitud: null,
        longitud: null,
        activo: true
    };

    const [cliente, setCliente] = useState(clienteVacio);

    useEffect(() => {

        if (!abierto) return;

        if (clienteEditar) {

            setCliente({
                id: clienteEditar.id,
                nombre: clienteEditar.nombre || "",
                telefono: clienteEditar.telefono || "",
                direccion: clienteEditar.direccion || "",
                observaciones: clienteEditar.observaciones || "",
                latitud: clienteEditar.latitud,
                longitud: clienteEditar.longitud,
                activo: clienteEditar.activo ?? true
            });

        } else {

            setCliente(clienteVacio);

        }

    }, [clienteEditar, abierto]);

    if (!abierto) {
        return null;
    }

    function actualizar(campo, valor) {

        setCliente(actual => ({
            ...actual,
            [campo]: valor
        }));

    }

    function actualizarUbicacion(datos) {

        setCliente(actual => ({
            ...actual,
            direccion: datos.texto || "",
            latitud: datos.lat,
            longitud: datos.lng
        }));

    }

    async function guardar() {

        console.log("Cliente enviado:", cliente);

        await onGuardar(cliente);

    }

    return (

        <div className="cliente-modal-overlay">

            <div className="cliente-modal">

                <div className="cliente-modal-header">

                    <h2>
                        {cliente.id ? "Editar Cliente" : "Nuevo Cliente"}
                    </h2>

                    <button
                        className="cerrar"
                        onClick={onCerrar}
                    >
                        ✕
                    </button>

                </div>

                <div className="cliente-form">

                    <label>Nombre</label>

                    <input
                        value={cliente.nombre}
                        onChange={(e) =>
                            actualizar("nombre", e.target.value)
                        }
                    />

                    <label>Teléfono</label>

                    <input
                        value={cliente.telefono}
                        onChange={(e) =>
                            actualizar("telefono", e.target.value)
                        }
                    />

                    <label>Dirección</label>

                    <input
                        value={cliente.direccion}
                        readOnly
                    />

                    <AddressPicker
                        value={{
                            texto: cliente.direccion,
                            lat: cliente.latitud,
                            lng: cliente.longitud
                        }}
                        onChange={actualizarUbicacion}
                    />

                    <label>Observaciones</label>

                    <textarea
                        rows={3}
                        value={cliente.observaciones}
                        onChange={(e) =>
                            actualizar(
                                "observaciones",
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="cliente-modal-footer">

                    <button
                        className="btn-secondary"
                        onClick={onCerrar}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn-primary"
                        onClick={guardar}
                    >
                        {cliente.id
                            ? "Actualizar cliente"
                            : "Guardar cliente"}
                    </button>

                </div>

            </div>

        </div>

    );

}