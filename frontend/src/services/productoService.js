import { get } from "./api";

export async function obtenerProductos() {

    const productos = await get("/productos");

    return productos.sort((a, b) => a.ordenVisual - b.ordenVisual);

}