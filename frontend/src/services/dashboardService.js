import { get } from "./api";

export async function obtenerDashboard() {

    return await get("/dashboard");

}