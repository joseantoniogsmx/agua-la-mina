/*
 * ==========================================================
 * UTILIDADES DEL MÓDULO DE PEDIDOS
 * ==========================================================
 */

/**
 * Formatea un número como moneda.
 */
export function formatearMoneda(valor) {

    return `$${Number(valor ?? 0).toFixed(2)}`;

}

/**
 * Formatea una fecha.
 */
export function formatearFecha(fecha) {

    if (!fecha) {

        return "";

    }

    return new Date(fecha).toLocaleString();

}

/**
 * Devuelve la clase CSS para el estado.
 */
export function obtenerClaseEstado(estado) {

    if (!estado) {

        return "estado";

    }

    return `estado estado-${estado.toLowerCase()}`;

}

/**
 * Devuelve una lista única de marcas del pedido.
 */
export function obtenerMarcas(pedido) {

    if (!pedido?.detalles?.length) {

        return [];

    }

    return [...new Set(

        pedido.detalles

            .map(detalle => detalle.marca)

            .filter(Boolean)

    )];

}

/**
 * Texto resumido de las marcas.
 *
 * Ejemplo:
 *
 * Ciel • Bonafont
 *
 * o
 *
 * Ciel • Bonafont +2 más
 */
export function obtenerResumenMarcas(pedido) {

    const marcas = obtenerMarcas(pedido);

    if (marcas.length === 0) {

        return "Sin productos";

    }

    if (marcas.length <= 2) {

        return marcas.join(" • ");

    }

    return `${marcas[0]} • ${marcas[1]} +${marcas.length - 2} más`;

}

/**
 * Total de productos (cantidad de líneas).
 */
export function totalProductos(pedido) {

    return pedido?.detalles?.length ?? 0;

}

/**
 * Total de garrafones solicitados.
 */
export function totalGarrafones(pedido) {

    if (!pedido?.detalles?.length) {

        return 0;

    }

    return pedido.detalles.reduce(

        (total, detalle) => total + (detalle.cantidad ?? 0),

        0

    );

}