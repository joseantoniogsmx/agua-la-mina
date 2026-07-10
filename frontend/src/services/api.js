const API = import.meta.env.VITE_API_URL;

export async function get(endpoint) {

    const response = await fetch(`${API}${endpoint}`);

    if (!response.ok) {

        throw new Error("Error al consultar el servidor.");

    }

    return await response.json();

}

export async function post(endpoint, body) {

    const response = await fetch(`${API}${endpoint}`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(body)

    });

    if (!response.ok) {

        throw new Error("Error al enviar información.");

    }

    return await response.json();

}

export async function put(endpoint, body) {

    const response = await fetch(`${API}${endpoint}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(body)

    });

    if (!response.ok) {

        throw new Error("Error al actualizar información.");

    }

    return await response.json();

}