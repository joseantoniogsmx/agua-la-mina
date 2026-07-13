import { useEffect, useMemo, useState } from "react";

import ProductCard from "../../components/common/ProductCard/ProductCard";
import { obtenerProductos } from "../../services/productoService";

import "./Productos.css";

export default function Productos() {

    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [marcaSeleccionada, setMarcaSeleccionada] = useState("TODOS");

    useEffect(() => {

        async function cargar() {

            try {

                const datos = await obtenerProductos();
                setProductos(datos);

            } catch (error) {

                console.error("Error al cargar productos:", error);

            }

        }

        cargar();

    }, []);

    const productosFiltrados = useMemo(() => {

        return productos.filter((producto) => {

            const coincideMarca =
                marcaSeleccionada === "TODOS" ||
                producto.marca === marcaSeleccionada;

            const texto = (
                producto.nombre +
                " " +
                producto.marca
            ).toLowerCase();

            const coincideBusqueda =
                texto.includes(busqueda.toLowerCase());

            return coincideMarca && coincideBusqueda;

        });

    }, [productos, busqueda, marcaSeleccionada]);

    return (

        <div className="productos-page">

            <div className="productos-header">

                <div>

                    <h1>Productos</h1>

                    <p>Catálogo de Agua La Mina</p>

                </div>

                <button className="btn-primary">

                    + Nuevo producto

                </button>

            </div>

            <div className="productos-toolbar">

                <input
                    className="buscador"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <div className="filtros">

                    <button
                        className={marcaSeleccionada === "TODOS" ? "activo" : ""}
                        onClick={() => setMarcaSeleccionada("TODOS")}
                    >
                        Todos
                    </button>

                    <button
                        className={marcaSeleccionada === "CIEL" ? "activo cielo" : "cielo"}
                        onClick={() => setMarcaSeleccionada("CIEL")}
                    >
                        Ciel
                    </button>

                    <button
                        className={marcaSeleccionada === "ELECTROPURA" ? "activo electropura" : "electropura"}
                        onClick={() => setMarcaSeleccionada("ELECTROPURA")}
                    >
                        Electropura
                    </button>

                    <button
                        className={marcaSeleccionada === "BONAFONT" ? "activo bonafont" : "bonafont"}
                        onClick={() => setMarcaSeleccionada("BONAFONT")}
                    >
                        Bonafont
                    </button>

                </div>

            </div>

            <div className="productos-grid">

                {productosFiltrados.map((producto) => (

                    <ProductCard
                        key={producto.id}
                        producto={producto}
                    />

                ))}

            </div>

        </div>

    );

}