package petadoption.api.adoptionCenter;

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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdoptionCenterServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AdoptionCenterService adoptionCenterService;

    private AdoptionCenterDTO testCenterDTO;
    private User testUser;

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

    @Test
    void testRegisterAdoptionCenter_Success() {
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

        doNothing().when(emailService).sendVerificationEmail(any(User.class));

        ResponseEntity<?> response = adoptionCenterService.registerAdoptionCenter(testCenterDTO);

        System.out.println("Actual Response Body: " + response.getBody());

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
