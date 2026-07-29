import { useEffect, useMemo, useState } from "react";

import {
    buscarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} from "../../services/clienteService";

import ClienteForm from "../../components/clientes/ClienteForm/ClienteForm";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";

import "./Clientes.css";

export default function Clientes() {

    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [clienteEditar, setClienteEditar] = useState(null);
    const [mostrarEliminar, setMostrarEliminar] = useState(false);
    const [clienteEliminar, setClienteEliminar] = useState(null);

    useEffect(() => {
        cargarClientes();
    }, []);

    async function cargarClientes() {

        try {

            const datos = await buscarClientes("");

            setClientes(datos);

        } catch (error) {

            console.error(error);

        }

    }

    async function guardarCliente(cliente) {

        try {

            if (cliente.id) {
                await actualizarCliente(cliente.id, cliente);
            } else {
                await crearCliente(cliente);
            }

            setMostrarModal(false);
            setClienteEditar(null);

            await cargarClientes();

        } catch (error) {

            console.error(error);

            alert(
                error?.response?.data ||
                "No fue posible guardar el cliente."
            );

        }

    }

    function editarCliente(cliente) {

        setClienteEditar(cliente);

        setMostrarModal(true);

    }

    function solicitarEliminar(cliente) {

        setClienteEliminar(cliente);

        setMostrarEliminar(true);

    }

    async function confirmarEliminar() {

        try {

            await eliminarCliente(clienteEliminar.id);

            setMostrarEliminar(false);
            setClienteEliminar(null);

            await cargarClientes();

        } catch (error) {

            console.error(error);

            alert(
                error?.response?.data ||
                "No fue posible eliminar el cliente."
            );

        }

    }

    function cancelarEliminar() {

        setMostrarEliminar(false);

        setClienteEliminar(null);

    }

    const clientesFiltrados = useMemo(() => {

        if (!busqueda) return clientes;

        const filtro = busqueda.toLowerCase();

        return clientes.filter(cliente =>

            cliente.nombre?.toLowerCase().includes(filtro)

            ||

            cliente.alias?.toLowerCase().includes(filtro)

            ||

            cliente.telefono?.includes(busqueda)

            ||

            cliente.direccion?.toLowerCase().includes(filtro)

        );

    }, [clientes, busqueda]);

    function direccionCorta(cliente) {

        const partes = [];

        if (cliente.calle)
            partes.push(cliente.calle);

        if (cliente.numeroExterior)
            partes.push(cliente.numeroExterior);

        if (cliente.colonia)
            partes.push(cliente.colonia);

        if (partes.length > 0)
            return partes.join(", ");

        return cliente.direccion || "Sin dirección";

    }

    return (

        <div className="clientes-page">

            <div className="clientes-header">

                <div>

                    <h1>Clientes</h1>

                    <p>Administración de clientes</p>

                </div>

                <button
                    className="btn-primary"
                    onClick={() => {

                        setClienteEditar(null);

                        setMostrarModal(true);

                    }}
                >
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

                            {
                                cliente.alias &&
                                <p>🏷️ {cliente.alias}</p>
                            }

                            {
                                cliente.tipoCliente &&
                                <p>👤 {cliente.tipoCliente}</p>
                            }

                            <p>
                                📞 {cliente.telefono}
                            </p>

                            <p>
                                📍 {direccionCorta(cliente)}
                            </p>

                            {
                                (cliente.municipio || cliente.estado) &&

                                <p>
                                    🗺️ {cliente.municipio}
                                    {cliente.municipio && cliente.estado ? ", " : ""}
                                    {cliente.estado}
                                </p>

                            }

                            <div className="cliente-acciones">

                                <button
                                    className="btn-secondary"
                                    onClick={() => editarCliente(cliente)}
                                >
                                    ✏ Editar
                                </button>

                                <button
                                    className="btn-danger"
                                    onClick={() => solicitarEliminar(cliente)}
                                >
                                    🗑 Eliminar
                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

            <ClienteForm

                abierto={mostrarModal}

                clienteEditar={clienteEditar}

                onCerrar={() => {

                    setMostrarModal(false);

                    setClienteEditar(null);

                }}

                onGuardar={guardarCliente}

            />

            <ConfirmDialog

                abierto={mostrarEliminar}

                titulo="Eliminar cliente"

                mensaje={
                    clienteEliminar
                        ? `¿Desea eliminar a ${clienteEliminar.nombre}?`
                        : ""
                }

                onCancelar={cancelarEliminar}

                onConfirmar={confirmarEliminar}

            />

        </div>

    );

}