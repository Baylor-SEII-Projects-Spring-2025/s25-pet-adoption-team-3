package petadoption.api.services;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class GeocodeService {
    public Double[] getCoordinatesFromAddress(String address) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        String URL = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address="+ URLEncoder.encode(address, StandardCharsets.UTF_8)   + "&benchmark=4";
        System.out.println(URL);
        // Build the HttpRequest
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(URL))
                .GET()
                .build();

        // Send the request and get the response
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        int latIdx, longIdx;
        Double latitude, longitude;
        String body;
        if(response.statusCode() != 200) {
            return null;
        }

        body = response.body();

        if(body.contains("No Matches")){
            return null;
        }

        latIdx = body.indexOf("Interpolated Latitude (Y) Coordinates: </b><span>") + "Interpolated Latitude (Y) Coordinates: </b><span>".length();
        longIdx = body.indexOf("Interpolated Longitude (X) Coordinates: </b><span>") + "Interpolated Longitude (X) Coordinates: </b><span>".length();

        latitude = Double.parseDouble(body.substring(latIdx, body.indexOf("<", latIdx)));
        longitude = Double.parseDouble(body.substring(longIdx, body.indexOf("<", longIdx)));

        return new Double[]{latitude, longitude};
    }
}
