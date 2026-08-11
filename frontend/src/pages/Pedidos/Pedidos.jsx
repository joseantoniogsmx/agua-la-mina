import { useEffect, useState } from "react";

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

    const [pedidos, setPedidos] = useState([]);

    const [productos, setProductos] = useState([]);

    const [clientes, setClientes] = useState([]);

    const [cargando, setCargando] = useState(true);


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

            setPedidos(listaPedidos);

            setProductos(listaProductos);

            setClientes(listaClientes);

        } catch (error) {

            console.error(error);

            alert(

                "No fue posible cargar la información."

            );

        } finally {

            setCargando(false);

        }

    }


    async function guardarPedido(request) {

        try {

            await crearPedido(request);

            alert(

                "Pedido registrado correctamente."

            );

            await cargarInformacion();

        } catch (error) {

            console.error(error);

            alert(

                error?.response?.data?.message ||

                error?.response?.data ||

                error.message ||

                "No fue posible guardar el pedido."

            );

            throw error;

        }

    }


    return (

        <div className="pedidos-page">

            <div className="pedidos-header">

                <div>

                    <h1>Pedidos</h1>

                    <p>

                        Administración de pedidos

                    </p>

                </div>

            </div>


            <PedidoForm

                clientes={clientes}

                productos={productos}

                onGuardar={guardarPedido}

            />


            <section className="pedidos-lista">

                <h2>

                    Pedidos registrados

                </h2>

                {

                    cargando

                        ?

                        <p>

                            Cargando pedidos...

                        </p>

                        :

                        <PedidoTable

                            pedidos={pedidos}

                            onActualizar={cargarInformacion}

                        />

                }

            </section>

        </div>

    );

}