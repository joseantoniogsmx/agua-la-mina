import { loadPlacesLibrary } from "./GoogleMapsLoader";

let initialized = false;

async function initialize() {
    if (initialized) return;

    await loadPlacesLibrary();

    initialized = true;
}

/**
 * Busca sugerencias de direcciones.
 * @param {string} text
 * @returns {Promise<Array>}
 */
export async function searchPlaces(text) {

    await initialize();

    if (!text || text.trim().length < 3) {
        return [];
    }

    try {

        const request = {
            input: text,
            includedRegionCodes: ["mx"]
        };

        const { suggestions } =
            await google.maps.places.AutocompleteSuggestion
                .fetchAutocompleteSuggestions(request);

        return suggestions.map((item) => ({

            placePrediction: item.placePrediction,

            placeId: item.placePrediction.placeId,

            texto:
                item.placePrediction.text?.text ??
                item.placePrediction.mainText?.text ??
                "",

            principal:
                item.placePrediction.mainText?.text ??
                "",

            secundaria:
                item.placePrediction.secondaryText?.text ??
                ""

        }));

    } catch (error) {

        console.error(error);

        return [];

    }

}

/**
 * Obtiene toda la información de una sugerencia.
 *
 * @param {Object} prediction
 * @returns {Promise<Object|null>}
 */
export async function getPlaceDetails(prediction) {

    await initialize();

    try {

        const place = prediction.toPlace();

        await place.fetchFields({

            fields: [
                "displayName",
                "formattedAddress",
                "location",
                "addressComponents"
            ]

        });

        let ciudad = "";
        let estado = "";
        let codigoPostal = "";

        (place.addressComponents || []).forEach(component => {

            if (component.types.includes("locality")) {
                ciudad = component.longText;
            }

            if (component.types.includes("administrative_area_level_1")) {
                estado = component.longText;
            }

            if (component.types.includes("postal_code")) {
                codigoPostal = component.longText;
            }

        });

        return {

            placeId: place.id,

            texto: place.formattedAddress,

            nombre: place.displayName,

            lat: place.location.lat(),

            lng: place.location.lng(),

            ciudad,

            estado,

            codigoPostal

        };

    } catch (error) {

        console.error(error);

        return null;

    }

}