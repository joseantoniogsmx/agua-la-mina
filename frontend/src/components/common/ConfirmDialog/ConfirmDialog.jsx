import "./ConfirmDialog.css";

export default function ConfirmDialog({
    abierto,
    titulo,
    mensaje,
    onCancelar,
    onConfirmar
}) {

    if (!abierto) return null;

    return (

        <div className="confirm-overlay">

            <div className="confirm-dialog">

                <h2>{titulo}</h2>

                <p>{mensaje}</p>

                <div className="confirm-buttons">

                    <button
                        className="btn-secondary"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn-danger"
                        onClick={onConfirmar}
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        </div>

    );

}