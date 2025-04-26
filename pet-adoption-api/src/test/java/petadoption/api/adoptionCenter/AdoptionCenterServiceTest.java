package petadoption.api.adoptionCenter;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import petadoption.api.DTO.AdoptionCenterDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.AdoptionCenterService;
import petadoption.api.services.EmailService;
import petadoption.api.services.GeocodeService;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AdoptionCenterService}.
 * This test class uses Mockito to mock dependencies and JUnit for assertions.
 * <p>
 * It verifies that the registration logic for adoption centers works as intended,
 * including correct population of User entity fields, handling of email sending,
 * and proper handling of coordinates lookup via GeocodeService.
 * </p>
 */
class AdoptionCenterServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private GeocodeService geocodeService;

    @InjectMocks
    private AdoptionCenterService adoptionCenterService;

    private AdoptionCenterDTO testCenterDTO;
    private User testUser;

    /**
     * Initializes mocks and sets up test data before each test.
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testCenterDTO = new AdoptionCenterDTO();
        testCenterDTO.setAdoptionCenterName("Happy Paws Rescue");
        testCenterDTO.setEmail("happypaws@example.com");
        testCenterDTO.setPassword("securePass123");
        testCenterDTO.setPhoneNumber("555-123-4567");
        testCenterDTO.setWebsite("https://happypaws.org");
        testCenterDTO.setBio("We rescue abandoned pets and find them new homes.");
        testCenterDTO.setProfilePhoto("https://storage.example.com/happypaws-logo.png");

        testUser = new User();
        testUser.setEmail(testCenterDTO.getEmail());
        testUser.setPassword("hashedPassword");
        testUser.setRole(User.Role.ADOPTION_CENTER);
        testUser.setAdoptionCenterName(testCenterDTO.getAdoptionCenterName());
        testUser.setPhoneNumber(testCenterDTO.getPhoneNumber());
        testUser.setWebsite(testCenterDTO.getWebsite());
        testUser.setBio(testCenterDTO.getBio());
        testUser.setProfilePhoto(testCenterDTO.getProfilePhoto());
        testCenterDTO = new AdoptionCenterDTO();
        testCenterDTO.setAdoptionCenterName("Happy Paws Rescue");
        testCenterDTO.setEmail("happypaws@example.com");
        testCenterDTO.setPassword("securePass123");
        testCenterDTO.setPhoneNumber("555-123-4567");
        testCenterDTO.setWebsite("https://happypaws.org");
        testCenterDTO.setBio("We rescue abandoned pets and find them new homes.");
        testCenterDTO.setProfilePhoto("https://storage.example.com/happypaws-logo.png");
        testCenterDTO.setAddress("123 Main Street");


        testUser = new User();
        testUser.setEmail(testCenterDTO.getEmail());
        testUser.setPassword("hashedPassword");
        testUser.setRole(User.Role.ADOPTION_CENTER);
        testUser.setAdoptionCenterName(testCenterDTO.getAdoptionCenterName());
        testUser.setPhoneNumber(testCenterDTO.getPhoneNumber());
        testUser.setWebsite(testCenterDTO.getWebsite());
        testUser.setBio(testCenterDTO.getBio());
        testUser.setProfilePhoto(testCenterDTO.getProfilePhoto());
        testUser.setAddress(testCenterDTO.getAddress());

    }

    /**
     * Test the successful registration of an adoption center.
     * <p>
     * This test verifies:
     * <ul>
     *     <li>No existing user with the same email.</li>
     *     <li>Password is encoded.</li>
     *     <li>Email service is called once.</li>
     *     <li>Returned User object has correct fields.</li>
     *     <li>Coordinates are set via GeocodeService.</li>
     * </ul>
     * </p>
     * @throws IOException If GeocodeService throws.
     * @throws InterruptedException If GeocodeService throws.
     */
    @Test
    void testRegisterAdoptionCenter_Success() throws IOException, InterruptedException {
        when(userRepository.findByEmail(testCenterDTO.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(testCenterDTO.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setProfilePhoto(testCenterDTO.getProfilePhoto());
            return savedUser;
        });

        doNothing().when(emailService).sendVerificationEmail(any(User.class));
        when(userRepository.findByEmail(testCenterDTO.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(testCenterDTO.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setProfilePhoto(testCenterDTO.getProfilePhoto());
            return savedUser;
        });

        when(geocodeService.getCoordinatesFromAddress(any())).thenReturn(new Double[]{1d,1d});

        ResponseEntity<?> response = adoptionCenterService.registerAdoptionCenter(testCenterDTO);

        assertEquals(201, response.getStatusCode().value());
        assertNotNull(response.getBody(), "Response body is null!");

        assertInstanceOf(User.class, response.getBody());
        User registeredCenter = (User) response.getBody();

        assertEquals("Happy Paws Rescue", registeredCenter.getAdoptionCenterName());
        assertEquals("happypaws@example.com", registeredCenter.getEmail());
        assertEquals("hashedPassword", registeredCenter.getPassword());
        assertEquals("555-123-4567", registeredCenter.getPhoneNumber());
        assertEquals("https://happypaws.org", registeredCenter.getWebsite());
        assertEquals("We rescue abandoned pets and find them new homes.", registeredCenter.getBio());
        assertEquals("https://storage.example.com/happypaws-logo.png", registeredCenter.getProfilePhoto());
        assertEquals("123 Main Street", registeredCenter.getAddress());


        verify(emailService, times(1)).sendVerificationEmail(any(User.class));
    }




}
