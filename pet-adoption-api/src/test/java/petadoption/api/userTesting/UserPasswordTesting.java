package petadoption.api.userTesting;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import petadoption.api.models.Token;
import petadoption.api.models.User;
import petadoption.api.repository.TokenRepository;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.EmailService;
import petadoption.api.services.UserService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Optional;

class UserPasswordTesting {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Token testToken;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("hashedPassword");
        testUser.setEmailVerified(true);

        testToken = new Token();
        testToken.setToken("valid-token");
        testToken.setUser(testUser);
        testToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        testToken.setTokenType(Token.TokenType.PASSWORD_RESET);
    }

    @Test
    void testForgotPassword_Success() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = userService.forgotPasswordLink(testUser.getEmail());

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Password reset link sent to your email.", response.getBody());
        verify(emailService, times(1)).sendPasswordResetEmail(testUser);
    }

    @Test
    void testForgotPassword_EmailNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        ResponseEntity<String> response = userService.forgotPasswordLink("nonexistent@example.com");

        assertEquals(400, response.getStatusCode().value());
        assertEquals("User with this email does not exist.", response.getBody());
    }

    @Test
    void testResetPassword_Success() {
        when(tokenRepository.findByTokenAndTokenType("valid-token", Token.TokenType.PASSWORD_RESET))
                .thenReturn(Optional.of(testToken));
        when(passwordEncoder.encode(anyString())).thenReturn("newHashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ResponseEntity<String> response = userService.resetPassword("valid-token", "newSecurePassword123");

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Password reset successful.", response.getBody());
        verify(tokenRepository, times(1)).delete(testToken);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testResetPassword_InvalidToken() {
        when(tokenRepository.findByTokenAndTokenType("invalid-token", Token.TokenType.PASSWORD_RESET))
                .thenReturn(Optional.empty());

        ResponseEntity<String> response = userService.resetPassword("invalid-token", "newSecurePassword123");

        assertEquals(401, response.getStatusCode().value());
        assertEquals("Invalid or Expired Token", response.getBody());
    }

    @Test
    void testResetPassword_ExpiredToken() {
        testToken.setExpiryDate(LocalDateTime.now().minusHours(1)); // Expired token
        when(tokenRepository.findByTokenAndTokenType("expired-token", Token.TokenType.PASSWORD_RESET))
                .thenReturn(Optional.of(testToken));

        ResponseEntity<String> response = userService.resetPassword("expired-token", "newSecurePassword123");

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Token expired", response.getBody());
        verify(tokenRepository, times(1)).delete(testToken);
    }
}
