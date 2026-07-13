import { get, post, put } from "./api";

export async function obtenerPedidos() {

    return await get("/pedidos");

}

export async function crearPedido(pedido) {

    return await post("/pedidos", pedido);

}

export async function iniciarRuta() {

    return await post("/pedidos/iniciar-ruta", {});

}

export async function entregarPedido(id) {

    return await put(`/pedidos/${id}/entregado`, {});

}