package petadoption.api.userTesting;
import petadoption.api.DTO.LoginRequestsDTO;
import petadoption.api.DTO.UserDTO;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import petadoption.api.controllers.AuthenticationController;
import petadoption.api.models.User;
import petadoption.api.services.UserService;

class AuthControllerTesting {

    @Mock
    private UserService userService;

    @Mock
    private HttpServletRequest mockRequest;

    @Mock
    private HttpSession mockSession;

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


        when(mockRequest.getSession()).thenReturn(mockSession);
    }

    @Test
    void testRegisterUserSuccess() {
        when(userService.registerUser(any(UserDTO.class))).thenReturn(testUser);
        ResponseEntity<String> response = authController.registerUser(userDTO);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("User registered successfully.", response.getBody());
        verify(userService, times(1)).registerUser(any(UserDTO.class));
    }

    @Test
    void testLoginUserSuccess() {
        when(userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword()))
                .thenReturn(testUser);


        when(mockRequest.getSession()).thenReturn(mockSession);

        ResponseEntity<Map<String, Object>> response = authController.loginUser(loginRequest, mockRequest);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Login successful", response.getBody().get("message"));
    }

    @Test
    void testLoginUserInvalidCredentials() {
        when(userService.authenticateUser(anyString(), anyString()))
                .thenThrow(new RuntimeException("Invalid credentials"));

        Exception exception = assertThrows(RuntimeException.class,
                () -> authController.loginUser(loginRequest, mockRequest)); // ✅ Pass mockRequest

        assertEquals("Invalid credentials", exception.getMessage());
    }
}
