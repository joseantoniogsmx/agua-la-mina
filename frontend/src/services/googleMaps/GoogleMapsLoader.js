import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initialized = false;

function initialize() {
    if (initialized) return;

    setOptions({
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        v: "weekly",
        language: "es",
        region: "MX",
        mapIds: [import.meta.env.VITE_GOOGLE_MAP_ID]
    });

    initialized = true;
}

export async function loadMapsLibrary() {
    initialize();
    return await importLibrary("maps");
}

export async function loadMarkerLibrary() {
    initialize();
    return await importLibrary("marker");
}

export async function loadPlacesLibrary() {
    initialize();
    return await importLibrary("places");
}

export async function loadGeocodingLibrary() {
    initialize();
    return await importLibrary("geocoding");
}