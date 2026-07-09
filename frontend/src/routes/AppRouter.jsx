import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Clientes from "../pages/Clientes/Clientes";
import Productos from "../pages/Productos/Productos";
import Pedidos from "../pages/Pedidos/Pedidos";
import Ruta from "../pages/Ruta/Ruta";
import Configuracion from "../pages/Configuracion/Configuracion";

export default function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route element={<Layout />}>

                    <Route path="/" element={<Dashboard />} />

                    <Route path="/clientes" element={<Clientes />} />

                    <Route path="/productos" element={<Productos />} />

                    <Route path="/pedidos" element={<Pedidos />} />

                    <Route path="/ruta" element={<Ruta />} />

                    <Route path="/configuracion" element={<Configuracion />} />

                </Route>

            </Routes>

        </BrowserRouter>

    );

}