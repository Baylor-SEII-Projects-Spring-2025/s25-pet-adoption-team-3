package petadoption.api.controllers;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import petadoption.api.DTO.LoginRequestsDTO;
import petadoption.api.DTO.UserDTO;
import petadoption.api.models.User;
import petadoption.api.services.UserService;

/**
 * Unit tests for {@link AuthenticationController} covering user registration and login scenarios.
 * <p>
 * Uses Mockito to mock dependencies and verifies controller responses for success and error cases.
 * </p>
 */
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

    /**
     * Setup test data and mock objects before each test.
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("testuser@example.com");
        testUser.setFirstName("David");
        testUser.setLastName("R");
        testUser.setPassword("hashedPassword");
        testUser.setRole(User.Role.ADOPTER);
        testUser.setEmailVerified(true);


        userDTO = new UserDTO();
        userDTO.setEmail("testuser@example.com");
        userDTO.setFirstName("David");
        userDTO.setLastName("R");
        userDTO.setPassword("password");

        loginRequest = new LoginRequestsDTO();
        loginRequest.setEmail("testuser@example.com");
        loginRequest.setPassword("password");
    }

    /**
     * Tests successful user registration.
     * <p>
     * Asserts that the controller returns a CREATED status and the expected success message.
     * </p>
     */
    @Test
    void testRegisterUserSuccess() {
        when(userService.registerUser(any(UserDTO.class)))
                .thenAnswer(invocation -> ResponseEntity.status(HttpStatus.CREATED)
                        .body("User: testuser@example.com created successfully"));

        ResponseEntity<?> response = authController.registerUser(userDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("User: testuser@example.com created successfully"));
        verify(userService, times(1)).registerUser(any(UserDTO.class));
    }

    /**
     * Tests successful user login.
     * <p>
     * Asserts that the controller returns OK and a body containing login success message and user name.
     * </p>
     */
    @Test
    void testLoginUserSuccess() {
        when(userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword()))
                .thenAnswer(invocation -> ResponseEntity.ok(testUser));

        when(mockRequest.getSession()).thenReturn(mockSession);

        ResponseEntity<?> response = authController.loginUser(loginRequest, mockRequest);

        assertInstanceOf(Map.class, response.getBody());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Login successful", responseBody.get("message"));
        assertEquals("David", responseBody.get("user"));

    }

    /**
     * Tests user login with invalid credentials.
     * <p>
     * Asserts that the controller returns UNAUTHORIZED status and appropriate error message.
     * </p>
     */
    @Test
    void testLoginUserInvalidCredentials() {
        when(userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword()))
                .thenAnswer(invocation -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));

        ResponseEntity<?> response = authController.loginUser(loginRequest, mockRequest);

        String responseBody = (String) response.getBody();

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials", responseBody);
    }

}
