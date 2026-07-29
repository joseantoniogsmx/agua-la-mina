import { useEffect, useState } from "react";

import DatosCliente from "./DatosCliente";
import DireccionCliente from "./DireccionCliente";
import UbicacionCliente from "./UbicacionCliente";
import ObservacionesCliente from "./ObservacionesCliente";

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
        alias: "",
        telefono: "",
        tipoCliente: "",

        direccion: "",

        calle: "",
        numeroExterior: "",
        numeroInterior: "",

        colonia: "",
        localidad: "",
        municipio: "",
        estado: "",
        codigoPostal: "",

        referencias: "",

        latitud: null,
        longitud: null,

        observaciones: "",

        activo: true
    };

    const [cliente, setCliente] = useState(clienteVacio);

    useEffect(() => {

        if (!abierto) return;

        if (clienteEditar) {

            setCliente({
                id: clienteEditar.id,

                nombre: clienteEditar.nombre || "",
                alias: clienteEditar.alias || "",
                telefono: clienteEditar.telefono || "",
                tipoCliente: clienteEditar.tipoCliente || "",

                direccion: clienteEditar.direccion || "",

                calle: clienteEditar.calle || "",
                numeroExterior: clienteEditar.numeroExterior || "",
                numeroInterior: clienteEditar.numeroInterior || "",

                colonia: clienteEditar.colonia || "",
                localidad: clienteEditar.localidad || "",
                municipio: clienteEditar.municipio || "",
                estado: clienteEditar.estado || "",
                codigoPostal: clienteEditar.codigoPostal || "",

                referencias: clienteEditar.referencias || "",

                latitud: clienteEditar.latitud,
                longitud: clienteEditar.longitud,

                observaciones: clienteEditar.observaciones || "",

                activo: clienteEditar.activo ?? true
            });

        } else {

            setCliente(clienteVacio);

        }

    }, [clienteEditar, abierto]);

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

    if (!abierto) {
        return null;
    }

    return (

        <div className="cliente-modal-overlay">

            <div className="cliente-modal">

                <div className="cliente-modal-header">

                    <h2>
                        {cliente.id
                            ? "Editar Cliente"
                            : "Nuevo Cliente"}
                    </h2>

                    <button
                        className="cerrar"
                        onClick={onCerrar}
                    >
                        ✕
                    </button>

                </div>

                <div className="cliente-form">

                    <DatosCliente
                        cliente={cliente}
                        actualizar={actualizar}
                    />

                    <DireccionCliente
                        cliente={cliente}
                        actualizar={actualizar}
                    />

                    <UbicacionCliente
                        cliente={cliente}
                        actualizarUbicacion={actualizarUbicacion}
                    />

                    <ObservacionesCliente
                        cliente={cliente}
                        actualizar={actualizar}
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