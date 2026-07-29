import { useEffect, useState } from "react";

import "./LocationSearch.css";

export default function LocationSearch({

    onSelect

}) {

    const [texto, setTexto] = useState("");

    const [resultados, setResultados] = useState([]);

    useEffect(() => {

        if (texto.length < 3) {

            setResultados([]);

            return;

        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {

            try {

                const response = await fetch(

                    `https://photon.komoot.io/api/?q=${encodeURIComponent(texto)}&limit=5`,

                    {

                        signal: controller.signal

                    }

                );

                const data = await response.json();

                setResultados(data.features || []);

            }

            catch (e) {

                if (e.name !== "AbortError") {

                    console.error(e);

                }

            }

        }, 350);

        return () => {

            controller.abort();

            clearTimeout(timer);

        };

    }, [texto]);

    function seleccionar(feature) {

        setTexto(feature.properties.name || "");

        setResultados([]);

        if (!onSelect) return;

        onSelect({

            direccion:

                feature.properties.name,

            ciudad:

                feature.properties.city,

            estado:

                feature.properties.state,

            codigoPostal:

                feature.properties.postcode,

            latitud:

                feature.geometry.coordinates[1],

            longitud:

                feature.geometry.coordinates[0]

        });

    }

    return (

        <div className="location-search">

            <input

                type="text"

                placeholder="Buscar dirección..."

                value={texto}

                onChange={(e) =>

                    setTexto(e.target.value)

                }

            />

            {

                resultados.length > 0 && (

                    <div className="location-results">

                        {

                            resultados.map((item, index) => (

                                <button

                                    key={index}

                                    type="button"

                                    onClick={() =>

                                        seleccionar(item)

                                    }

                                >

                                    <strong>

                                        {

                                            item.properties.name

                                        }

                                    </strong>

                                    <small>

                                        {

                                            item.properties.city

                                        }

                                        {" · "}

                                        {

                                            item.properties.state

                                        }

                                    </small>

                                </button>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}
