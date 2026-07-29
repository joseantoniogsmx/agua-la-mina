import { useEffect, useRef, useState } from "react";
import {
    searchPlaces,
    getPlaceDetails
} from "../../services/googleMaps/GooglePlacesService";

export default function AddressSearch({
    placeholder = "Buscar dirección...",
    onSelect
}) {

    const [texto, setTexto] = useState("");
    const [resultados, setResultados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mostrarLista, setMostrarLista] = useState(false);

    const debounceRef = useRef(null);

    async function buscar(valor) {

        if (valor.trim().length < 3) {
            setResultados([]);
            setMostrarLista(false);
            return;
        }

        try {

            setCargando(true);

            const datos = await searchPlaces(valor);

            setResultados(datos || []);
            setMostrarLista((datos || []).length > 0);

        } catch (error) {

            console.error("Error buscando direcciones:", error);

            setResultados([]);
            setMostrarLista(false);

        } finally {

            setCargando(false);

        }

    }

    useEffect(() => {

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            buscar(texto);
        }, 400);

        return () => clearTimeout(debounceRef.current);

    }, [texto]);

    async function seleccionar(item) {

        try {

            setTexto(item.texto);
            setMostrarLista(false);
            setResultados([]);

            const direccion =
                await getPlaceDetails(item.placePrediction);

            console.log("Dirección seleccionada:", direccion);

            if (direccion && onSelect) {
                onSelect(direccion);
            }

        } catch (error) {

            console.error("Error obteniendo detalles:", error);

        }

    }

    return (

        <div className="address-search">

            <input
                type="text"
                value={texto}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => setTexto(e.target.value)}
            />

            {
                cargando &&
                <div className="address-loading">
                    Buscando...
                </div>
            }

            {
                mostrarLista &&
                resultados.length > 0 &&

                <ul className="address-results">

                    {
                        resultados.map(item => (

                            <li
                                key={item.placeId}
                                onClick={() => seleccionar(item)}
                            >

                                <div className="principal">
                                    {item.principal}
                                </div>

                                <div className="secundaria">
                                    {item.secundaria}
                                </div>

                            </li>

                        ))
                    }

                </ul>

            }

        </div>

    );

}