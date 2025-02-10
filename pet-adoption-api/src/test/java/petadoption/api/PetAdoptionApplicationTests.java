package petadoption.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("testdb")
class PetAdoptionApplicationTests {

	@Value("${spring.datasource.url}")
	private String dbUrl;

	@Test
	void printDatabaseUrl() {
		System.out.println("Using Database: " + dbUrl);
	}

	@Test
	void emptyTest() {
	}
}
