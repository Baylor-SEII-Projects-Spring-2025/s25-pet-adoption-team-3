package petadoption.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;

@Component
public class SecretConfigVerifier {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @PostConstruct
    public void verifySecrets() {
        googleClientId = googleClientId.trim();
        googleClientSecret = googleClientSecret.trim();

        System.out.println("✅ Retrieved Google Client ID: " + googleClientId);
        System.out.println("✅ Retrieved Google Client Secret: " + googleClientSecret);
    }
}
