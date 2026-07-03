package mx.agua.backend.service.routing.dto;

import java.util.List;

public class OsrmResponse {

    private String code;

    private List<Route> routes;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<Route> getRoutes() {
        return routes;
    }

    public void setRoutes(List<Route> routes) {
        this.routes = routes;
    }
}