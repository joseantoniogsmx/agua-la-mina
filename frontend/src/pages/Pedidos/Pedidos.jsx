import { useEffect, useState } from "react";

import { obtenerPedidos } from "../../services/pedidoService";

import "./Pedidos.css";

export default function Pedidos() {

    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {

        async function cargarPedidos() {

            try{

                const datos = await obtenerPedidos();

                setPedidos(datos);

            }catch(error){

                console.error(error);

            }

        }

        cargarPedidos();

    }, []);

    return(

        <div className="pedidos-page">

            <div className="pedidos-header">

                <div>

                    <h1>Pedidos</h1>

                    <p>Administración de pedidos</p>

                </div>

                <button className="btn-primary">

                    + Nuevo Pedido

                </button>

            </div>

            <pre>

                {JSON.stringify(pedidos,null,2)}

            </pre>

        </div>

    );

}