import "./../../styles/layout/Sidebar.css";

import logo from "../../assets/logo/logo.jpeg";

import { NavLink } from "react-router-dom";

import {
    FaHome,
    FaUsers,
    FaShoppingCart,
    FaTruck,
    FaCog,
    FaTint
} from "react-icons/fa";

export default function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="sidebar-header">

                <img
                    src={logo}
                    alt="Agua La Mina"
                    className="sidebar-logo"
                />

                <div className="sidebar-title">
                    Agua La Mina
                </div>

                <div className="sidebar-subtitle">
                    Sistema Administrativo
                </div>

            </div>

            <nav className="sidebar-menu">

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <FaHome />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/clientes"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <FaUsers />
                    <span>Clientes</span>
                </NavLink>

                <NavLink
                    to="/productos"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <FaTint />
                    <span>Productos</span>
                </NavLink>

                <NavLink
                    to="/pedidos"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <FaShoppingCart />
                    <span>Pedidos</span>
                </NavLink>

                <NavLink
                    to="/ruta"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <FaTruck />
                    <span>Ruta</span>
                </NavLink>

                <NavLink
                    to="/configuracion"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    <FaCog />
                    <span>Configuración</span>
                </NavLink>

            </nav>

            <div className="sidebar-footer">

                Agua La Mina

                <br />

                Versión 1.0

            </div>

        </aside>

    );

}