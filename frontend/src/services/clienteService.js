import { get, post, put } from "./api";

export async function obtenerClientes() {

    return await get("/clientes");

}

export async function crearCliente(cliente) {

    return await post("/clientes", cliente);

}

export async function actualizarCliente(id, cliente) {

    return await put(`/clientes/${id}`, cliente);

}