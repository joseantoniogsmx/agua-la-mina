const API_URL = "http://localhost:8080";


async function request(url, options = {}) {

    const response = await fetch(
        `${API_URL}${url}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },

            ...options
        }
    );


    /*
     * Leemos primero como texto.
     *
     * Esto permite manejar correctamente respuestas
     * vacías o respuestas que no sean JSON válido.
     */
    const texto = await response.text();


    if (!response.ok) {

        let mensaje = `Error ${response.status}`;


        if (texto) {

            try {

                const datos = JSON.parse(texto);

                mensaje =
                    datos?.message ||
                    datos?.error ||
                    texto;

            } catch {

                mensaje = texto;

            }

        }


        throw new Error(mensaje);

    }


    /*
     * Respuesta sin contenido.
     */
    if (!texto) {

        return null;

    }


    /*
     * Intentamos convertir la respuesta a JSON.
     */
    try {

        return JSON.parse(texto);

    } catch (error) {

        console.error(
            "El servidor devolvió una respuesta que no es JSON válido:",
            texto
        );

        throw new Error(
            "El servidor devolvió una respuesta inválida."
        );

    }

}


export function get(url) {

    return request(url);

}


export function post(url, data) {

    return request(
        url,
        {
            method: "POST",

            body: JSON.stringify(data)
        }
    );

}


export function put(url, data) {

    return request(
        url,
        {
            method: "PUT",

            body: JSON.stringify(data)
        }
    );

}


export function del(url) {

    return request(
        url,
        {
            method: "DELETE"
        }
    );

}