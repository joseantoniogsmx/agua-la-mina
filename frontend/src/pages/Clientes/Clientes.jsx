import { useEffect, useMemo, useState } from "react";

import { buscarClientes } from "../../services/clienteService";

import "./Clientes.css";

export default function Clientes() {

    const [clientes, setClientes] = useState([]);

    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {

        cargarClientes("");

    }, []);

    async function cargarClientes(texto) {

        try {

            const datos = await buscarClientes(texto);

            setClientes(datos);

        } catch (error) {

            console.error(error);

        }

    }

    const clientesFiltrados = useMemo(() => {

        if (!busqueda) return clientes;

        const filtro = busqueda.toLowerCase();

        return clientes.filter(cliente =>

            cliente.nombre.toLowerCase().includes(filtro)

            ||

            cliente.telefono?.includes(busqueda)

            ||

            cliente.direccion?.toLowerCase().includes(filtro)

        );

    }, [clientes, busqueda]);

    return (

        <div className="clientes-page">

            <div className="clientes-header">

                <div>

                    <h1>Clientes</h1>

                    <p>Administración de clientes</p>

                </div>

                <button className="btn-primary">

                    + Nuevo cliente

                </button>

            </div>

            <div className="clientes-toolbar">

                <input

                    className="buscador"

                    placeholder="Buscar cliente..."

                    value={busqueda}

                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }

                />

            </div>

            <div className="clientes-grid">

                {

                    clientesFiltrados.map(cliente => (

                        <div

                            key={cliente.id}

                            className="cliente-card"

                        >

                            <h3>

                                {cliente.nombre}

                            </h3>

                            <p>

                                📞 {cliente.telefono}

                            </p>

                            <p>

                                📍 {cliente.direccion}

                            </p>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}