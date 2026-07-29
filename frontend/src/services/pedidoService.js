import { get, post, put } from "./api";

/*
 * ============================
 * CONSULTAS
 * ============================
 */

export async function obtenerPedidos() {

    return await get("/pedidos");

}

/*
 * ============================
 * PEDIDOS
 * ============================
 */

export async function crearPedido(pedido) {

    return await post("/pedidos", pedido);

}

/*
 * ============================
 * RUTA
 * ============================
 */

export async function iniciarRuta() {

    return await post("/pedidos/iniciar-ruta", {});

}

export async function entregarPedido(id) {

    return await put(`/pedidos/${id}/entregado`, {});

}