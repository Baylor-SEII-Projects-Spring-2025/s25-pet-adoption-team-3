package petadoption.api.userTesting;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import petadoption.api.DTO.UserDTO;
import petadoption.api.controllers.UsersController;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.EmailService;
import petadoption.api.services.UserService;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UsersController userController;

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
        userDTO.setEmail("newemail@example.com");
        userDTO.setFirstName("NewFirstName");
        userDTO.setLastName("NewLastName");

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

        doNothing().when(emailService).sendVerificationEmail(any(User.class));

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
        assertEquals("An account already exists with this email.", response.getBody());
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

        doNothing().when(emailService).sendVerificationEmail(any(User.class));

        ResponseEntity<?> response = userService.registerUser(userDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("User: newemail@example.com created successfully", response.getBody().toString());
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

    //User controller testing

    //Test First Name Update
    @Test
    void testChangeFirstNameSuccess() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ResponseEntity<String> response = userController.changeFirstName(1L, userDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("First name updated to: " + userDTO.getFirstName(), response.getBody());
        verify(userRepository, times(1)).save(any(User.class));
    }

    //Test Last Name Update
    @Test
    void testChangeLastNameSuccess() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ResponseEntity<String> response = userController.changeLastName(1L, userDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Last name updated to: " + userDTO.getLastName(), response.getBody());
        verify(userRepository, times(1)).save(any(User.class));
    }

    // Test Email Update
    @Test
    void testChangeEmailSuccess() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ResponseEntity<String> response = userController.changeEmail(1L, userDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Email updated to: " + userDTO.getEmail(), response.getBody());
        verify(userRepository, times(1)).save(any(User.class));
    }

    //Test User Not Found (First Name)
    @Test
    void testChangeFirstNameUserNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<String> response = userController.changeFirstName(1L, userDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User not found.", response.getBody());
    }

    //Test User Not Found (Last Name)
    @Test
    void testChangeLastNameUserNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<String> response = userController.changeLastName(1L, userDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User not found.", response.getBody());
    }

    //Test User Not Found (Email)
    @Test
    void testChangeEmailUserNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<String> response = userController.changeEmail(1L, userDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User not found.", response.getBody());
    }

    //Test Empty First Name
    @Test
    void testChangeFirstNameEmpty() {
        userDTO.setFirstName("");

        ResponseEntity<String> response = userController.changeFirstName(1L, userDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("First name cannot be empty.", response.getBody());
    }

    //Test Empty Last Name
    @Test
    void testChangeLastNameEmpty() {
        userDTO.setLastName("");

        ResponseEntity<String> response = userController.changeLastName(1L, userDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Last name cannot be empty.", response.getBody());
    }

    //Test Empty Email
    @Test
    void testChangeEmailEmpty() {
        userDTO.setEmail("");

        ResponseEntity<String> response = userController.changeEmail(1L, userDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email cannot be empty.", response.getBody());
    }
}
