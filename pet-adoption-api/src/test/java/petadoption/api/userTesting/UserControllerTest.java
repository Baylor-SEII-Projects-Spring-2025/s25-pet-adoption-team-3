package petadoption.api.userTesting;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import petadoption.api.DTO.UserDTO;
import petadoption.api.controllers.UsersController;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @InjectMocks
    private UsersController userController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpSession session;

    private UserDTO userDTO;
    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");

        userDTO = new UserDTO();
        userDTO.setFirstName("UpdatedFirstName");
        userDTO.setLastName("UpdatedLastName");

        when(request.getSession()).thenReturn(session);
        when(request.getSession(true)).thenReturn(session);
    }

    @Test
    void testChangeFirstName_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = userController.changeFirstName(1L, userDTO, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("First name updated to: " + userDTO.getFirstName(), response.getBody());

        verify(session).invalidate();
        verify(session).setAttribute(eq("user"), any(User.class));
        verify(userRepository).saveAndFlush(any(User.class));
    }

    @Test
    void testChangeLastName_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = userController.changeLastName(1L, userDTO, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Last name updated to: " + userDTO.getLastName(), response.getBody());

        verify(session).invalidate();
        verify(session).setAttribute(eq("user"), any(User.class));
        verify(userRepository).saveAndFlush(any(User.class));
    }

    @Test
    void testChangeFirstName_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = userController.changeFirstName(1L, userDTO, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }

    @Test
    void testChangeLastName_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = userController.changeLastName(1L, userDTO, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }
}
