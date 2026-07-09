import { Outlet } from "react-router-dom";

import "./../../styles/layout/Layout.css";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {

    return (

        <div className="layout">

            <Sidebar />

            <div className="layout-content">

                <Navbar />

                <main className="main-content">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}