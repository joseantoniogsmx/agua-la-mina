package mx.agua.backend.controller;

import mx.agua.backend.dto.DashboardDTO;
import mx.agua.backend.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    public DashboardDTO obtenerDashboard() {

        return dashboardService.obtenerDashboard();

    }

}