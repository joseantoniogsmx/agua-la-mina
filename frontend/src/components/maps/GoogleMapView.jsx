import { useEffect, useRef } from "react";
import {
    loadMapsLibrary,
    loadMarkerLibrary
} from "../../services/googleMaps/GoogleMapsLoader";

export default function GoogleMapView({
    center = { lat: 19.432608, lng: -99.133209 },
    zoom = 15,
    markerPosition = null,
    onMapClick = null
}) {

    const DEFAULT_CENTER = {
        lat: 19.432608,
        lng: -99.133209
    };

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    function coordenadasValidas(posicion) {

        return (
            posicion &&
            typeof posicion.lat === "number" &&
            Number.isFinite(posicion.lat) &&
            typeof posicion.lng === "number" &&
            Number.isFinite(posicion.lng)
        );

    }

    useEffect(() => {

        let mounted = true;

        async function initializeMap() {

            const { Map } = await loadMapsLibrary();
            const { AdvancedMarkerElement } =
                await loadMarkerLibrary();

            if (!mounted) return;

            const centroInicial =
                coordenadasValidas(center)
                    ? center
                    : DEFAULT_CENTER;

            mapRef.current = new Map(
                mapContainerRef.current,
                {
                    center: centroInicial,
                    zoom,
                    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
                    disableDefaultUI: false,
                    clickableIcons: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                    mapTypeControl: false
                }
            );

            markerRef.current = new AdvancedMarkerElement({

                map: mapRef.current,

                position:
                    coordenadasValidas(markerPosition)
                        ? markerPosition
                        : centroInicial

            });

            mapRef.current.addListener("click", (event) => {

                const posicion = {

                    lat: event.latLng.lat(),

                    lng: event.latLng.lng()

                };

                markerRef.current.position = posicion;

                mapRef.current.panTo(posicion);

                onMapClick?.(posicion);

            });

        }

        initializeMap();

        return () => {
            mounted = false;
        };

    }, []);

    useEffect(() => {

        if (!mapRef.current) return;

        if (!coordenadasValidas(center)) return;

        mapRef.current.panTo(center);

    }, [center]);

    useEffect(() => {

        if (!mapRef.current) return;

        if (!markerRef.current) return;

        if (!coordenadasValidas(markerPosition)) return;

        markerRef.current.position = markerPosition;

        markerRef.current.map = mapRef.current;

        mapRef.current.panTo(markerPosition);

    }, [markerPosition]);

    return (

        <div

            ref={mapContainerRef}

            style={{

                width: "100%",

                height: "450px",

                borderRadius: "12px",

                overflow: "hidden"

            }}

        />

    );

}