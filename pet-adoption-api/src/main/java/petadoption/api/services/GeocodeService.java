package petadoption.api.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

        String url = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"
                + "?address=" + URLEncoder.encode(address, StandardCharsets.UTF_8)
                + "&benchmark=4&format=json";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            System.err.println("Non-200 from geocoder: " + response.statusCode());
            return null;
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response.body());

        JsonNode addressMatches = root.path("result").path("addressMatches");

        if (addressMatches.isEmpty() || addressMatches.get(0) == null) {
            System.out.println("No address matches found for: " + address);
            return null;
        }

        JsonNode coordinates = addressMatches.get(0).path("coordinates");
        double longitude = coordinates.path("x").asDouble();
        double latitude = coordinates.path("y").asDouble();

        return new Double[]{latitude, longitude};
    }
}
