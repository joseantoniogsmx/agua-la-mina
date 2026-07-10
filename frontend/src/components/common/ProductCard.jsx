import "./ProductCard.css";

export default function ProductCard({ producto }) {

    const imagen = new URL(
        `../../assets/productos/${producto.imagen}`,
        import.meta.url
    ).href;

    return (

        <div
            className="product-card"
            style={{
                borderTop: `8px solid ${producto.colorPrincipal}`
            }}
        >

            <div className="product-image">

                <img
                    src={imagen}
                    alt={producto.marca}
                />

            </div>

            <div className="product-info">

                <h2>

                    {producto.nombre}

                </h2>

                <h3>

                    {producto.marca}

                </h3>

                <p>

                    {producto.capacidadLitros} L

                </p>

                <h1>

                    ${Number(producto.precio).toFixed(2)}

                </h1>

                <span className="badge">

                    Disponible

                </span>

            </div>

        </div>

    );

}