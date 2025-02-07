package petadoption.api.userTesting;
import petadoption.api.DTO.LoginRequestsDTO;
import petadoption.api.DTO.UserDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import petadoption.api.controllers.AuthenticationController;
import petadoption.api.models.User;
import petadoption.api.services.UserService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthenticationController authController;

    private User testUser;
    private UserDTO userDTO;
    private LoginRequestsDTO loginRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setEmail("testuser@example.com");
        testUser.setFirstName("David");
        testUser.setLastName("R");
        testUser.setPassword("password");
        testUser.setRole(User.Role.ADOPTER);

        userDTO = new UserDTO();
        userDTO.setEmail("testuser@example.com");
        userDTO.setFirstName("David");
        userDTO.setLastName("R");
        userDTO.setPassword("password");
        userDTO.setRole(User.Role.ADOPTER);

        loginRequest = new LoginRequestsDTO();
        loginRequest.setEmail("testuser@example.com");
        loginRequest.setPassword("SecurePass123");
    }

    @Test
    void testRegisterUserSuccess() {
        when(userService.registerUser(any(UserDTO.class))).thenReturn(testUser);
        ResponseEntity<String> response = authController.registerUser(userDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("User registered successfully.", response.getBody());
        verify(userService, times(1)).registerUser(any(UserDTO.class));
    }

    @Test
    void testLoginUserSuccess() {
        when(userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword())).thenReturn(testUser);
        ResponseEntity<String> response = authController.loginUser(loginRequest);
        assertEquals(200, response.getStatusCodeValue());

        assertEquals("Login successful: " + testUser.getFirstName(), response.getBody());
    }


    @Test
    void testLoginUserInvalidCredentials() {
        when(userService.authenticateUser(anyString(), anyString())).thenThrow(new RuntimeException("Invalid credentials"));
        Exception exception = assertThrows(RuntimeException.class, () ->
                authController.loginUser(loginRequest));

        assertEquals("Invalid credentials", exception.getMessage());
    }
}
