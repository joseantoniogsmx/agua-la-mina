import "./Modal.css";

export default function Modal({

    abierto,

    titulo,

    children,

    onCerrar,

    ancho = "500px"

}) {

    if (!abierto)

        return null;

    return (

        <div

            className="modal-overlay"

            onClick={onCerrar}

        >

            <div

                className="modal"

                style={{

                    maxWidth: ancho

                }}

                onClick={(e) => e.stopPropagation()}

            >

                <div className="modal-header">

                    <h2>

                        {titulo}

                    </h2>

                    <button

                        type="button"

                        className="modal-close"

                        onClick={onCerrar}

                    >

                        ✕

                    </button>

                </div>

                <div className="modal-body">

                    {children}

                </div>

            </div>

        </div>

    );

}