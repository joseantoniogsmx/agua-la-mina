import "./ProductCard.css";

export default function ProductCard({ producto }) {

    const imagen = `/productos/${producto.imagen}`;

    return (

        <div
            className="product-card"
            style={{
                borderTop: `8px solid ${producto.colorPrincipal}`
            }}
        >

            <div
                className="product-image"
                style={{
                    background: `linear-gradient(180deg, ${producto.colorPrincipal}15 0%, #FFFFFF 100%)`
                }}
            >

                <img
                    src={imagen}
                    alt={producto.nombre}
                />

            </div>

            <div className="product-content">

                <span
                    className="marca-badge"
                    style={{
                        background: producto.colorPrincipal
                    }}
                >
                    {producto.marca}
                </span>

                <h2>

                    {producto.nombre}

                </h2>

                <p className="capacidad">

                    {producto.capacidadLitros} Litros

                </p>

                <div className="precio">

                    ${Number(producto.precio).toFixed(2)}

                </div>

                <div className="estado">

                    <span className="punto"></span>

                    Disponible

                </div>

                <div className="acciones">

                    <button className="btn-editar">

                        Editar

                    </button>

                    <button className="btn-desactivar">

                        Desactivar

                    </button>

                </div>

            </div>

        </div>

    );

}