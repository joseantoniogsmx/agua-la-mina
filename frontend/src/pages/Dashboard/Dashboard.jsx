import {
    FaUsers,
    FaBottleWater,
    FaTruck,
    FaClock,
    FaCircleCheck,
    FaDollarSign
} from "react-icons/fa6";

import { useEffect, useState } from "react";

import StatCard from "../../components/common/StatCard/StatCard";

import { obtenerDashboard } from "../../services/dashboardService";

import "./Dashboard.css";

export default function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        async function cargarDashboard() {

            try {

                const datos = await obtenerDashboard();

                setDashboard(datos);

            } catch (error) {

                console.error(error);

            }

        }

        cargarDashboard();

    }, []);

    if (!dashboard) {

        return <h2>Cargando...</h2>;

    }

    return (

        <>

            <div className="dashboard-header">

                <div>

                    <h1>💧 Agua La Mina</h1>

                    <p>Sistema Integral de Gestión</p>

                </div>

            </div>

            <div className="dashboard-grid">

                <StatCard
                    title="Clientes"
                    value={dashboard.clientes}
                    icon={<FaUsers />}
                    color="#0078D4"
                />

                <StatCard
                    title="Productos"
                    value={dashboard.productos}
                    icon={<FaBottleWater />}
                    color="#005A9C"
                />

                <StatCard
                    title="Pendientes"
                    value={dashboard.pedidosPendientes}
                    icon={<FaClock />}
                    color="#F59E0B"
                />

                <StatCard
                    title="En Ruta"
                    value={dashboard.pedidosEnRuta}
                    icon={<FaTruck />}
                    color="#007A53"
                />

                <StatCard
                    title="Entregados"
                    value={dashboard.pedidosEntregados}
                    icon={<FaCircleCheck />}
                    color="#10B981"
                />

                <StatCard
                    title="Ventas"
                    value={`$${Number(dashboard.ventasTotales).toFixed(2)}`}
                    icon={<FaDollarSign />}
                    color="#F58220"
                />

            </div>

        </>

    );

}