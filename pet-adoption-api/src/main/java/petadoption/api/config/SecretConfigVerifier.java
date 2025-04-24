package petadoption.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;

/**
 * Verifies and trims Google OAuth client secrets loaded from application properties.
 * <p>
 * This component ensures that the Google OAuth client ID and secret are loaded
 * from the Spring configuration, trimmed, and available for use in the application.
 * </p>
 */
@Component
public class SecretConfigVerifier {

    /**
     * The Google OAuth 2.0 client ID loaded from application properties.
     */
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    /**
     * The Google OAuth 2.0 client secret loaded from application properties.
     */
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    /**
     * Post-construction method that trims whitespace from the Google client ID and secret.
     * <p>
     * This method is called automatically by Spring after dependency injection is complete.
     * </p>
     */
    @PostConstruct
    public void verifySecrets() {
        googleClientId = googleClientId.trim();
        googleClientSecret = googleClientSecret.trim();
    }
}
