package petadoption.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Pet Adoption API Spring Boot application.
 * <p>
 * This class bootstraps and launches the Spring Boot application.
 * </p>
 */
@SpringBootApplication
public class PetAdoptionApplication {
	/**
	 * Main method for starting the Pet Adoption application.
	 *
	 * @param args Command-line arguments passed to the application.
	 */
	public static void main(String[] args) {
		SpringApplication.run(PetAdoptionApplication.class, args);
	}
}
