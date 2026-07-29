import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: "weekly"
});

let initialized = false;

export async function loadGoogleMaps() {
    if (!initialized) {
        await loader.load();
        initialized = true;
    }

    const maps = await google.maps.importLibrary("maps");
    const places = await google.maps.importLibrary("places");
    const marker = await google.maps.importLibrary("marker");

    return {
        google,
        ...maps,
        ...places,
        ...marker
    };
}