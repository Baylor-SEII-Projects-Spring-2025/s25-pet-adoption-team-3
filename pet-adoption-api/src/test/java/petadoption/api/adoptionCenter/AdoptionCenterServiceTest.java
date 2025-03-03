package petadoption.api.adoptionCenter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import petadoption.api.models.AdoptionCenter;
import petadoption.api.repository.AdoptionCenterRepository;
import petadoption.api.services.AdoptionCenterService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdoptionCenterServiceTest {

    @Mock
    private AdoptionCenterRepository adoptionCenterRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdoptionCenterService adoptionCenterService;

    private AdoptionCenter testCenter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testCenter = new AdoptionCenter();
        testCenter.setAdoptionCenterName("Happy Paws Rescue");
        testCenter.setEmail("happypaws@example.com");
        testCenter.setPassword("securePass123");
        testCenter.setPhone("555-123-4567");
        testCenter.setWebsite("https://happypaws.org");
        testCenter.setBio("We rescue abandoned pets and find them new homes.");
        testCenter.setPhoto("https://storage.example.com/happypaws-logo.png");
    }

    @Test
    void testRegisterAdoptionCenter_Success() {
        when(adoptionCenterRepository.findByEmail(testCenter.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(testCenter.getPassword())).thenReturn("hashedPassword");
        when(adoptionCenterRepository.save(any(AdoptionCenter.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = adoptionCenterService.registerAdoptionCenter(testCenter);

        System.out.println("Actual Response Body: " + response.getBody());

        assertEquals(201, response.getStatusCode().value());
        assertNotNull(response.getBody(), "Response body is null!");
        assertTrue(response.getBody().toString().contains("Adoption Center: Happy Paws Rescue registered successfully"));
    }


    @Test
    void testRegisterAdoptionCenter_EmailAlreadyExists() {
        when(adoptionCenterRepository.findByEmail(testCenter.getEmail())).thenReturn(Optional.of(testCenter));

        ResponseEntity<?> response = adoptionCenterService.registerAdoptionCenter(testCenter);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Email already in use.", response.getBody());
    }
}
