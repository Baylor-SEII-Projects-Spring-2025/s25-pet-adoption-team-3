package petadoption.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring Web configuration class for the Pet Adoption API.
 * <p>
 * Configures global CORS (Cross-Origin Resource Sharing) policy
 * for the application, enabling the frontend (typically on localhost:3000)
 * to access backend APIs.
 * </p>
 */
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    /**
     * Configures CORS settings for the Spring MVC application.
     * <p>
     * Allows requests from the specified frontend origin and enables credentials.
     * Supports standard HTTP methods and all headers.
     * </p>
     *
     * @return a WebMvcConfigurer bean with the specified CORS configuration
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
