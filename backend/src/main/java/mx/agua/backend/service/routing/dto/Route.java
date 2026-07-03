package mx.agua.backend.service.routing.dto;

import java.util.List;

public class Route {

    private Double distance;
    private Double duration;
    private String geometry;
    private List<Object> legs;

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public String getGeometry() {
        return geometry;
    }

    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }

    public List<Object> getLegs() {
        return legs;
    }

    public void setLegs(List<Object> legs) {
        this.legs = legs;
    }
}