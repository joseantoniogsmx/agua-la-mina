import { get, post, put, del } from "./api";

export async function obtenerClientes() {
    return await get("/clientes");
}

export async function crearCliente(cliente) {
    return await post("/clientes", cliente);
}

export async function actualizarCliente(id, cliente) {
    return await put(`/clientes/${id}`, cliente);
}

export async function eliminarCliente(id) {
    return await del(`/clientes/${id}`);
}

export async function buscarClientes(texto) {

    const clientes = await obtenerClientes();

    if (!texto) return clientes;

    const filtro = texto.toLowerCase();

    return clientes.filter(cliente =>

        cliente.nombre.toLowerCase().includes(filtro) ||

        cliente.telefono?.includes(texto) ||

        cliente.direccion?.toLowerCase().includes(filtro)

    );

}