import Modal from "../Modal/Modal";

import "./ConfirmDialog.css";

export default function ConfirmDialog({

    abierto,

    titulo = "Confirmar",

    mensaje,

    children,

    textoCancelar = "Cancelar",

    textoAceptar = "Aceptar",

    variante = "danger",

    cargando = false,

    onCancelar,

    onAceptar

}) {

    return (

        <Modal

            abierto={abierto}

            titulo={titulo}

            onCerrar={onCancelar}

            ancho="480px"

        >

            <div className="confirm-dialog">

                {

                    mensaje && (

                        <p className="confirm-dialog-mensaje">

                            {mensaje}

                        </p>

                    )

                }

                {

                    children && (

                        <div className="confirm-dialog-contenido">

                            {children}

                        </div>

                    )

                }

                <div className="confirm-dialog-botones">

                    <button

                        type="button"

                        className="btn-secundario"

                        onClick={onCancelar}

                        disabled={cargando}

                    >

                        {textoCancelar}

                    </button>

                    <button

                        type="button"

                        className={`btn-${variante}`}

                        onClick={onAceptar}

                        disabled={cargando}

                    >

                        {

                            cargando

                                ? "Procesando..."

                                : textoAceptar

                        }

                    </button>

                </div>

            </div>

        </Modal>

    );

}
