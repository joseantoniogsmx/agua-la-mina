import { useState } from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const icono = new L.Icon({

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41]

});

function Selector({ posicion, setPosicion }) {

    useMapEvents({

        click(e) {

            setPosicion(e.latlng);

        }

    });

    return posicion ? (

        <Marker

            position={posicion}

            icon={icono}

            draggable={true}

            eventHandlers={{

                dragend(e) {

                    setPosicion(e.target.getLatLng());

                }

            }}

        />

    ) : null;

}

export default function AddressPicker({ onChange }) {

    const [posicion, setPosicion] = useState({

        lat: 19.290,

        lng: -99.170

    });

    function actualizar(pos) {

        setPosicion(pos);

        if (onChange) {

            onChange({

                latitud: pos.lat,

                longitud: pos.lng

            });

        }

    }

    return (

        <MapContainer

            center={posicion}

            zoom={15}

            style={{

                height: "420px",

                width: "100%",

                borderRadius: "12px"

            }}

        >

            <TileLayer

                attribution='&copy; OpenStreetMap'

                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

            />

            <Selector

                posicion={posicion}

                setPosicion={actualizar}

            />

        </MapContainer>

    );

}