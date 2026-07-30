import {

    get,

    post,

    put,

    del

} from "./api";

export async function obtenerPedidos() {

    return await get("/pedidos");

}

export async function obtenerPedido(id) {

    return await get(`/pedidos/${id}`);

}

export async function crearPedido(datos) {

    return await post("/pedidos", datos);

}

export async function actualizarPedido(id, datos) {

    return await put(`/pedidos/${id}`, datos);

}

export async function eliminarPedido(id) {

    return await del(`/pedidos/${id}`);

}