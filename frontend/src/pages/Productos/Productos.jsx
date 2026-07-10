import { useEffect, useState } from "react";

import ProductCard from "../../components/common/ProductCard";

import { obtenerProductos } from "../../services/productoService";

import "./Productos.css";

export default function Productos() {

    const [productos, setProductos] = useState([]);

    useEffect(() => {

        async function cargar() {

            const datos = await obtenerProductos();

            setProductos(datos);

        }

        cargar();

    }, []);

    return (

        <>

            <div className="productos-header">

                <h1>

                    Productos

                </h1>

                <p>

                    Catálogo de Agua La Mina

                </p>

            </div>

            <div className="productos-grid">

                {

                    productos.map(producto => (

                        <ProductCard

                            key={producto.id}

                            producto={producto}

                        />

                    ))

                }

            </div>

        </>

    );

}