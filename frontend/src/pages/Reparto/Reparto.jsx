import { useEffect, useRef, useState } from "react";
import {
    loadMapsLibrary,
    loadMarkerLibrary
} from "../../services/googleMaps/GoogleMapsLoader";
import "./Reparto.css";

export default function Reparto() {

    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    const [error, setError] = useState(null);

    useEffect(() => {

        let activo = true;

        async function inicializarMapa() {

            try {

                const { Map } =
                    await loadMapsLibrary();

                const { AdvancedMarkerElement } =
                    await loadMarkerLibrary();


                if (!activo || !mapRef.current) {
                    return;
                }


                const purificadora = {
                    lat: 19.893916,
                    lng: -100.984136
                };


                const mapa = new Map(
                    mapRef.current,
                    {
                        center: purificadora,
                        zoom: 15,
                        mapId: import.meta.env.VITE_GOOGLE_MAP_ID
                    }
                );


                mapInstance.current = mapa;


                new AdvancedMarkerElement({
                    map: mapa,
                    position: purificadora,
                    title: "Agua La Mina - Purificadora"
                });


            } catch (err) {

                console.error(
                    "Error al cargar Google Maps:",
                    err
                );

                setError(
                    "No fue posible cargar Google Maps."
                );

            }

        }


        inicializarMapa();


        return () => {

            activo = false;

        };

    }, []);


    return (

        <div className="reparto">

            <h1>Reparto</h1>


            {error && (

                <div className="reparto-error">
                    {error}
                </div>

            )}


            <div
                ref={mapRef}
                className="reparto-map"
            />

        </div>

    );

}