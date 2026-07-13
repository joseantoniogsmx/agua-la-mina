import { get, put } from "./api";

export async function obtenerConfiguracion() {

    return await get("/configuracion");

}

export async function guardarConfiguracion(configuracion) {

    return await put("/configuracion", configuracion);

}