package petadoption.api.userTesting;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import petadoption.api.DTO.UserDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.UserService;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.UserService;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserDTO userDTO;
    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        userDTO = new UserDTO();
        userDTO.setEmail("testuser@example.com");
        userDTO.setFirstName("Dan");
        userDTO.setLastName("R");
        userDTO.setPassword("password");
        userDTO.setRole(User.Role.ADOPTER);

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("testuser@example.com");
        testUser.setFirstName("Dan");
        testUser.setLastName("R");
        testUser.setPassword("hashedPassword");
        testUser.setRole(User.Role.ADOPTER);
        testUser.setEmailVerified(true);
    }


    @Test
    void testRegisterUserSuccess() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(userDTO.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(1L);
            return savedUser;
        });

        ResponseEntity<?> response = userService.registerUser(userDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());

        String expectedResponse = "User: " + userDTO.getEmail() + " created successfully";
        assertEquals(expectedResponse, response.getBody());

        verify(userRepository, times(1)).save(any(User.class));
    }


    @Test
    void testRegisterUserEmailAlreadyExists() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.of(testUser));

        ResponseEntity<?> response = userService.registerUser(userDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email already exists", response.getBody());
    }

    @Test
    void testAuthenticateUserSuccess() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(userDTO.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(1L);
            return savedUser;
        });

        ResponseEntity<?> response = userService.registerUser(userDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("User: testuser@example.com created successfully"));
        verify(userRepository, times(1)).save(any(User.class));
    }


    @Test
    void testAuthenticateUserInvalidPassword() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", testUser.getPassword())).thenReturn(false);

        ResponseEntity<?> response = userService.authenticateUser(testUser.getEmail(), "wrongPassword");

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid Password", response.getBody());
    }

    @Test
    void testAuthenticateUserEmailNotVerified() {
        testUser.setEmailVerified(false);
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", testUser.getPassword())).thenReturn(true);

        ResponseEntity<?> response = userService.authenticateUser(testUser.getEmail(), "password");

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Email not verified. Please verify your email before logging in.", response.getBody());
    }
}
