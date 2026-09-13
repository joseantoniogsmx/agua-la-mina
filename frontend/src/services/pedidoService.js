import {
    get,
    post,
    put,
    del
} from "./api";


/*
 * ==========================================================
 * CONSULTAS
 * ==========================================================
 */

export async function obtenerPedidos() {

    return await get("/pedidos");

}


export async function obtenerPedido(id) {

    return await get(`/pedidos/${id}`);

}


/*
 * ==========================================================
 * CREACIÓN
 * ==========================================================
 */

export async function crearPedido(datos) {

    return await post("/pedidos", datos);

}


/*
 * ==========================================================
 * ACTUALIZACIÓN
 * ==========================================================
 */

export async function actualizarPedido(
    id,
    datos
) {

    return await put(
        `/pedidos/${id}`,
        datos
    );

}


/*
 * ==========================================================
 * ENTREGA
 * ==========================================================
 */

/**
 * Marca un pedido EN_RUTA como ENTREGADO.
 *
 * El backend se encarga de:
 *
 * EN_RUTA -> ENTREGADO
 *
 * y de comprobar si el envío puede pasar
 * a COMPLETADO.
 */
export async function marcarPedidoComoEntregado(
    id
) {

    return await put(
        `/pedidos/${id}/entregado`
    );

}


/*
 * ==========================================================
 * ELIMINACIÓN
 * ==========================================================
 */

export async function eliminarPedido(id) {

    return await del(
        `/pedidos/${id}`
    );

}