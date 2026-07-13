import "./ConfirmDialog.css";

export default function ConfirmDialog({

    open,

    title,

    message,

    onConfirm,

    onCancel

}) {

    if (!open) return null;

    return (

        <div className="dialog-overlay">

            <div className="dialog">

                <h2>

                    {title}

                </h2>

                <p>

                    {message}

                </p>

                <div className="dialog-buttons">

                    <button
                        className="dialog-cancel"
                        onClick={onCancel}
                    >

                        Cancelar

                    </button>

                    <button
                        className="dialog-confirm"
                        onClick={onConfirm}
                    >

                        Confirmar

                    </button>

                </div>

            </div>

        </div>

    );

}