import { useState } from "react";

import PedidoCard from "./PedidoCard";

import ConfirmDialog from "../../common/ConfirmDialog/ConfirmDialog";

import { eliminarPedido } from "../../../services/pedidoService";

import "./PedidoTable.css";

export default function PedidoTable({

    pedidos,

    onActualizar

}) {

    const [pedidoExpandido, setPedidoExpandido] = useState(null);

    const [pedidoAEliminar, setPedidoAEliminar] = useState(null);

    const [eliminando, setEliminando] = useState(false);

    function alternarPedido(id) {

        setPedidoExpandido(

            pedidoExpandido === id

                ? null

                : id

        );

    }

    function editarPedido(pedido) {

        console.log(

            "Editar pedido:",

            pedido

        );

    }

    function solicitarEliminacion(pedido) {

        setPedidoAEliminar(pedido);

    }

    function cancelarEliminacion() {

        if (eliminando)

            return;

        setPedidoAEliminar(null);

    }

    async function confirmarEliminacion() {

        if (!pedidoAEliminar)

            return;

        try {

            setEliminando(true);

            await eliminarPedido(

                pedidoAEliminar.id

            );

            setPedidoAEliminar(null);

            if (onActualizar) {

                await onActualizar();

            }

        }

        catch (error) {

            console.error(

                "Error al eliminar el pedido:",

                error

            );

            alert(

                "No fue posible eliminar el pedido."

            );

        }

        finally {

            setEliminando(false);

        }

    }

    if (!pedidos.length) {

        return (

            <div className="pedido-table-vacio">

                No hay pedidos registrados.

            </div>

        );

    }

    return (

        <>

            <div className="pedido-listado">

                {

                    pedidos.map((pedido) => (

                        <PedidoCard

                            key={pedido.id}

                            pedido={pedido}

                            expandido={

                                pedidoExpandido === pedido.id

                            }

                            onExpandir={alternarPedido}

                            onEditar={editarPedido}

                            onEliminar={solicitarEliminacion}

                        />

                    ))

                }

            </div>

            <ConfirmDialog

                abierto={

                    pedidoAEliminar !== null

                }

                titulo="Eliminar pedido"

                mensaje="¿Deseas eliminar este pedido? Esta acción no puede deshacerse."

                textoAceptar="Eliminar"

                textoCancelar="Cancelar"

                variante="danger"

                cargando={eliminando}

                onCancelar={cancelarEliminacion}

                onAceptar={confirmarEliminacion}

            >

                {

                    pedidoAEliminar && (

                        <>

                            <strong>

                                Cliente

                            </strong>

                            <p>

                                {

                                    pedidoAEliminar.cliente

                                        ?.nombre ??

                                    "Sin cliente"

                                }

                            </p>

                            <strong>

                                Total

                            </strong>

                            <p>

                                $

                                {

                                    Number(

                                        pedidoAEliminar.total

                                    ).toFixed(2)

                                }

                            </p>

                            <strong>

                                Estado

                            </strong>

                            <p>

                                {

                                    pedidoAEliminar.estado

                                }

                            </p>

                        </>

                    )

                }

            </ConfirmDialog>

        </>

    );

}