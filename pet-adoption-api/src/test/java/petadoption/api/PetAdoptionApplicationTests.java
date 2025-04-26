package petadoption.api;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Smoke test class for PetAdoptionApplication.
 * <p>
 * This class is annotated with {@link SpringBootTest}, which will bootstrap the full application context
 * using the "prod" profile. It can be used to verify that the main application context loads
 * successfully without throwing exceptions.
 * <p>
 * Note: No test methods are defined here; this is commonly used as a context-loading check.
 */
@SpringBootTest
@ActiveProfiles("prod")
class PetAdoptionApplicationTests {

}
