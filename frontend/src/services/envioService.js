import { get } from "./api";


/**
 * Obtiene todos los envíos.
 */
export function obtenerEnvios() {

    return get("/envios");

}


/**
 * Obtiene los envíos que actualmente
 * están en ruta.
 */
export function obtenerEnviosEnRuta() {

    return get("/envios/estado/EN_RUTA");

}


/**
 * Obtiene el detalle completo de un envío.
 */
export function obtenerEnvio(id) {

    return get(`/envios/${id}`);

}
