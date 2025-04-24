package petadoption.api.config;

import com.google.cloud.secretmanager.v1.AccessSecretVersionResponse;
import com.google.cloud.secretmanager.v1.SecretManagerServiceClient;
import com.google.cloud.secretmanager.v1.SecretVersionName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;


/**
 * Configuration class for loading secrets from Google Cloud Secret Manager.
 * <p>
 * This class retrieves sensitive credentials (such as Google OAuth client ID and secret)
 * from GCP Secret Manager at application startup and sets them as system properties.
 * </p>
 */
@Configuration
public class GcpSecretManagerConfig {

    /**
     * The GCP project ID, injected from application properties.
     */
    @Value("${spring.cloud.gcp.project-id}")
    private String projectId;

    /**
     * Initializes and loads Google client secrets from GCP Secret Manager after bean construction.
     * <p>
     * The loaded secrets are trimmed and set as system properties:
     * <ul>
     *     <li>googleClientId</li>
     *     <li>googleClientSecret</li>
     * </ul>
     * </p>
     */
    @PostConstruct
    public void init() {
        String googleClientId = getSecret("google-client-id");
        String googleClientSecret = getSecret("google-client-secret");

        googleClientId = googleClientId.trim();
        googleClientSecret = googleClientSecret.trim();

        System.setProperty("googleClientId", googleClientId);
        System.setProperty("googleClientSecret", googleClientSecret);
    }

    /**
     * Retrieves the secret value from Google Cloud Secret Manager.
     *
     * @param secretId the ID of the secret to retrieve (e.g., "google-client-id")
     * @return the secret value as a String
     * @throws RuntimeException if there is an error accessing the secret
     */
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
