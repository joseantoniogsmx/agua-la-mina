import "./Toast.css";

export default function Toast({

    show,
    type = "success",
    message

}) {

    if (!show) return null;

    return (

        <div className={`toast ${type}`}>

            {message}

        </div>

    );

}