package petadoption.api.config;

import com.google.cloud.secretmanager.v1.AccessSecretVersionResponse;
import com.google.cloud.secretmanager.v1.SecretManagerServiceClient;
import com.google.cloud.secretmanager.v1.SecretVersionName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
public class GcpSecretManagerConfig {

    @Value("${spring.cloud.gcp.project-id}")
    private String projectId;

    @PostConstruct
    public void init() {
        String googleClientId = getSecret("google-client-id");
        String googleClientSecret = getSecret("google-client-secret");

        googleClientId = googleClientId.trim();
        googleClientSecret = googleClientSecret.trim();

        System.setProperty("googleClientId", googleClientId);
        System.setProperty("googleClientSecret", googleClientSecret);

        System.out.println("✅ Google Client ID: " + googleClientId);
        System.out.println("✅ Google Client Secret: " + googleClientSecret);
    }

    private String getSecret(String secretId) {
        try (SecretManagerServiceClient client = SecretManagerServiceClient.create()) {
            SecretVersionName secretVersionName = SecretVersionName.of(projectId, secretId, "latest");
            AccessSecretVersionResponse response = client.accessSecretVersion(secretVersionName);
            return response.getPayload().getData().toStringUtf8();
        } catch (IOException e) {
            throw new RuntimeException("Error accessing secret: " + secretId, e);
        }
    }
}
