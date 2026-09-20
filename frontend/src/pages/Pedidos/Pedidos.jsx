import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    obtenerPedidos,
    crearPedido
} from "../../services/pedidoService";

import { obtenerProductos } from "../../services/productoService";
import { obtenerClientes } from "../../services/clienteService";

import PedidoForm from "../../components/pedidos/PedidoForm/PedidoForm";
import PedidoTable from "../../components/pedidos/PedidoTable/PedidoTable";

import "./Pedidos.css";


export default function Pedidos() {

    const navigate = useNavigate();


    const [pedidos, setPedidos] =
        useState([]);

    const [productos, setProductos] =
        useState([]);

    const [clientes, setClientes] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [pedidoEditando, setPedidoEditando] =
        useState(null);


    /*
     * ==========================================================
     * CARGAR INFORMACIÓN
     * ==========================================================
     */

    useEffect(() => {

        cargarInformacion();

    }, []);


    async function cargarInformacion() {

        try {

            setCargando(true);

            const [
                listaPedidos,
                listaProductos,
                listaClientes
            ] = await Promise.all([

                obtenerPedidos(),

                obtenerProductos(),

                obtenerClientes()

            ]);


            setPedidos(
                listaPedidos
            );

            setProductos(
                listaProductos
            );

            setClientes(
                listaClientes
            );

        } catch (error) {

            console.error(
                "Error al cargar información:",
                error
            );

            alert(
                "No fue posible cargar la información."
            );

        } finally {

            setCargando(false);

        }

    }


    /*
     * ==========================================================
     * GUARDAR NUEVO PEDIDO
     * ==========================================================
     */

    async function guardarPedido(request) {

        try {

            await crearPedido(
                request
            );

            alert(
                "Pedido registrado correctamente."
            );

            await cargarInformacion();

        } catch (error) {

            console.error(
                "Error al guardar el pedido:",
                error
            );

            alert(

                error?.response?.data?.message ||

                error?.response?.data ||

                error?.message ||

                "No fue posible guardar el pedido."

            );

            throw error;

        }

    }


    /*
     * ==========================================================
     * INICIAR EDICIÓN
     * ==========================================================
     */

    function iniciarEdicion(pedido) {

        if (
            !pedido ||
            pedido.estado !== "PENDIENTE"
        ) {

            return;

        }

        setPedidoEditando(
            pedido
        );


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /*
     * ==========================================================
     * CANCELAR EDICIÓN
     * ==========================================================
     */

    function cancelarEdicion() {

        setPedidoEditando(
            null
        );

    }


    /*
     * ==========================================================
     * VER RUTA DEL PEDIDO
     * ==========================================================
     */

    function verRuta(pedido) {

        if (
            !pedido ||
            pedido.estado !== "EN_RUTA"
        ) {

            return;

        }


        if (!pedido.envioId) {

            alert(
                "Este pedido está en ruta, pero no tiene un envío asociado."
            );

            return;

        }


        navigate(
            "/reparto",
            {
                state: {
                    envioId: pedido.envioId
                }
            }
        );

    }


    return (

        <div className="pedidos-page">


            <div className="pedidos-header">

                <div>

                    <h1>
                        Pedidos
                    </h1>

                    <p>
                        Administración de pedidos
                    </p>

                </div>

            </div>


            <PedidoForm

                clientes={
                    clientes
                }

                productos={
                    productos
                }

                onGuardar={
                    guardarPedido
                }

                pedidoEditando={
                    pedidoEditando
                }

                onCancelarEdicion={
                    cancelarEdicion
                }

            />


            <section className="pedidos-lista">

                <h2>
                    Pedidos registrados
                </h2>


                {
                    cargando

                        ? (

                            <p>
                                Cargando pedidos...
                            </p>

                        )

                        : (

                            <PedidoTable

                                pedidos={
                                    pedidos
                                }

                                onActualizar={
                                    cargarInformacion
                                }

                                onEditar={
                                    iniciarEdicion
                                }

                                onVerRuta={
                                    verRuta
                                }

                            />

                        )
                }

            </section>

        </div>

    );

}