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

export async function actualizarPedido(id, datos) {

    return await put(`/pedidos/${id}`, datos);

}


/*
 * ==========================================================
 * ELIMINACIÓN
 * ==========================================================
 */

export async function eliminarPedido(id) {

    return await del(`/pedidos/${id}`);

}