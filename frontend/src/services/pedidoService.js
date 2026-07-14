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
 * MODELO ANTIGUO
 * (Se conservará temporalmente)
 * ============================
 */

export async function crearPedido(pedido) {

    return await post("/pedidos", pedido);

}

/*
 * ============================
 * NUEVO MODELO
 * (Pedido con múltiples productos)
 * ============================
 */

export async function crearPedidoV2(pedido) {

    return await post("/pedidos/v2", pedido);

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