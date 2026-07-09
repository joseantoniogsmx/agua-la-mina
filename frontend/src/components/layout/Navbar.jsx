import "./../../styles/layout/Navbar.css";

export default function Navbar(){

    const fecha = new Date().toLocaleDateString("es-MX",{
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
    });

    return(

        <header className="navbar">

            <div className="navbar-left">

                <div className="navbar-title">

                    Bienvenido

                </div>

                <div className="navbar-date">

                    {fecha}

                </div>

            </div>

            <div className="navbar-right">

                <div className="user-box">

                    <div className="user-avatar">

                        A

                    </div>

                    <div className="user-name">

                        Administrador

                    </div>

                </div>

            </div>

        </header>

    );

}