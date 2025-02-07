package petadoption.api.userTesting;

import DTO.UserDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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
        testUser.setEmail("testuser@example.com");
        testUser.setFirstName("Dan");
        testUser.setLastName("R");
        testUser.setPassword("hashedPassword");
        testUser.setRole(User.Role.ADOPTER);
    }

    @Test
    void testRegisterUserSuccess() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(userDTO.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User savedUser = userService.registerUser(userDTO);

        assertNotNull(savedUser);
        assertEquals("testuser@example.com", savedUser.getEmail());
        assertEquals("hashedPassword", savedUser.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUserEmailAlreadyExists() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.of(testUser));

        Exception exception = assertThrows(RuntimeException.class, () -> userService.registerUser(userDTO));
        assertEquals("Email already exists.", exception.getMessage());
    }

    @Test
    void testAuthenticateUserSuccess() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", testUser.getPassword())).thenReturn(true); // ✅ Matches hashed password

        User authenticatedUser = userService.authenticateUser(testUser.getEmail(), "password");

        assertNotNull(authenticatedUser);
        assertEquals("testuser@example.com", authenticatedUser.getEmail());
    }

    @Test
    void testAuthenticateUserInvalidPassword() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        Exception exception = assertThrows(RuntimeException.class, () ->
                userService.authenticateUser(testUser.getEmail(), "WrongPassword"));

        assertEquals("Invalid credentials", exception.getMessage());
    }
}
