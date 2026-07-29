const API_URL = "http://localhost:8080";

async function request(url, options = {}) {

    const response = await fetch(`${API_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();
}

export function get(url) {
    return request(url);
}

export function post(url, data) {
    return request(url, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export function put(url, data) {
    return request(url, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}

export function del(url) {
    return request(url, {
        method: "DELETE"
    });
}