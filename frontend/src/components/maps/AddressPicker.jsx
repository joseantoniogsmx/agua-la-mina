import { useEffect, useState } from "react";
import AddressSearch from "./AddressSearch";
import GoogleMapView from "./GoogleMapView";
import "./AddressPicker.css";

export default function AddressPicker({
    value = null,
    onChange
}) {

    const defaultCenter = {
        lat: 19.432608,
        lng: -99.133209
    };

    const [direccion, setDireccion] = useState(value);

    useEffect(() => {
        setDireccion(value);
    }, [value]);

    const coordenadasValidas =
        direccion &&
        typeof direccion.lat === "number" &&
        Number.isFinite(direccion.lat) &&
        typeof direccion.lng === "number" &&
        Number.isFinite(direccion.lng);

    function seleccionarDireccion(datos) {

        setDireccion(datos);

        if (onChange) {
            onChange(datos);
        }

    }

    function moverMarcador(posicion) {

        if (!direccion) {

            const nuevaDireccion = {
                texto: "",
                nombre: "",
                ciudad: "",
                estado: "",
                codigoPostal: "",
                placeId: "",
                lat: posicion.lat,
                lng: posicion.lng
            };

            setDireccion(nuevaDireccion);

            onChange?.(nuevaDireccion);

            return;

        }

        const actualizada = {
            ...direccion,
            lat: posicion.lat,
            lng: posicion.lng
        };

        setDireccion(actualizada);

        onChange?.(actualizada);

    }

    return (

        <div className="address-picker">

            <AddressSearch
                placeholder="Buscar dirección..."
                onSelect={seleccionarDireccion}
            />

            <GoogleMapView

                center={
                    coordenadasValidas
                        ? {
                              lat: direccion.lat,
                              lng: direccion.lng
                          }
                        : defaultCenter
                }

                markerPosition={
                    coordenadasValidas
                        ? {
                              lat: direccion.lat,
                              lng: direccion.lng
                          }
                        : null
                }

                onMapClick={moverMarcador}

            />

            {

                direccion && (

                    <div className="address-summary">

                        <h4>Dirección seleccionada</h4>

                        <p>
                            <strong>Dirección:</strong>{" "}
                            {direccion.texto || "No disponible"}
                        </p>

                        <p>
                            <strong>Ciudad:</strong>{" "}
                            {direccion.ciudad || "-"}
                        </p>

                        <p>
                            <strong>Estado:</strong>{" "}
                            {direccion.estado || "-"}
                        </p>

                        <p>
                            <strong>Código Postal:</strong>{" "}
                            {direccion.codigoPostal || "-"}
                        </p>

                        <p>
                            <strong>Latitud:</strong>{" "}
                            {coordenadasValidas
                                ? direccion.lat.toFixed(6)
                                : "-"}
                        </p>

                        <p>
                            <strong>Longitud:</strong>{" "}
                            {coordenadasValidas
                                ? direccion.lng.toFixed(6)
                                : "-"}
                        </p>

                    </div>

                )

            }

        </div>

    );

}