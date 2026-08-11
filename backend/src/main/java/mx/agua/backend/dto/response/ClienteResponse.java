package mx.agua.backend.dto.response;

public class ClienteResponse {

    private Integer id;

    private String nombre;

    private String direccion;

    private Double latitud;

    private Double longitud;


    public ClienteResponse() {
    }


    public ClienteResponse(
            Integer id,
            String nombre) {

        this.id = id;

        this.nombre = nombre;

    }


    public ClienteResponse(
            Integer id,
            String nombre,
            String direccion,
            Double latitud,
            Double longitud) {

        this.id = id;

        this.nombre = nombre;

        this.direccion = direccion;

        this.latitud = latitud;

        this.longitud = longitud;

    }


    public Integer getId() {

        return id;

    }


    public void setId(Integer id) {

        this.id = id;

    }


    public String getNombre() {

        return nombre;

    }


    public void setNombre(String nombre) {

        this.nombre = nombre;

    }


    public String getDireccion() {

        return direccion;

    }


    public void setDireccion(String direccion) {

        this.direccion = direccion;

    }


    public Double getLatitud() {

        return latitud;

    }


    public void setLatitud(Double latitud) {

        this.latitud = latitud;

    }


    public Double getLongitud() {

        return longitud;

    }


    public void setLongitud(Double longitud) {

        this.longitud = longitud;

    }

}