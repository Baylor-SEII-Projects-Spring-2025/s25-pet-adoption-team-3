package petadoption.api.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Spring Security configuration for the Pet Adoption API.
 * <p>
 * This class configures password encoding, CORS policy, session management,
 * endpoint security rules, OAuth2 login, and the HTTP firewall for the application.
 * </p>
 */
@Configuration
public class SecurityConfig {
    /**
     * Provides a BCrypt password encoder bean for encoding user passwords.
     *
     * @return a BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures the Spring Security filter chain for HTTP requests.
     * <p>
     * - Enables CORS with a custom configuration source<br>
     * - Disables CSRF (for API use cases)<br>
     * - Configures public and authenticated endpoint rules<br>
     * - Sets up OAuth2 login handlers and session management policy
     * </p>
     *
     * @param http the HttpSecurity object provided by Spring Security
     * @return the configured SecurityFilterChain
     * @throws Exception in case of configuration errors
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <-- FIXED THIS
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/", "/oauth2/**", "/login/oauth2/**", "/ws-chat/**").permitAll()
                        .requestMatchers("/api/users/**", "/api/adoption-center/**", "/api/pet/**", "/api/event/**", "/api/swipe/**", "/chat/**", "/api/chat/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/oauth/google/success", true)
                        .failureUrl("/login?error=true"))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.ALWAYS));

        return http.build();
    }

    /**
     * Configures the CORS (Cross-Origin Resource Sharing) policy for the application.
     * <p>
     * Allows requests from specified frontend domains and configures allowed/exposed headers and credentials.
     * </p>
     *
     * @return a CorsConfigurationSource with the configured CORS policy
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() { // <-- FIXED THIS
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://adoptdontshop.duckdns.org", "http://localhost:3000", "http://35.226.72.131:3000")); // Only allow your frontend domain
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Set-Cookie", "Cache-Control"));
        config.setExposedHeaders(List.of("Authorization", "Content-Type", "Set-Cookie"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Configures the HTTP firewall to allow semicolons in URLs.
     * <p>
     * This is useful for supporting encoded parameters and some legacy browser requests.
     * </p>
     *
     * @return an HttpFirewall that allows semicolons in URLs
     */
    @Bean
    public HttpFirewall allowSemicolonHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowSemicolon(true);
        return firewall;
    }
}
