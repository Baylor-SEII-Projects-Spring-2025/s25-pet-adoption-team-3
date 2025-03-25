package petadoption.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import petadoption.api.DTO.AdoptionCenterDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.AdoptionCenterService;
import petadoption.api.services.SessionValidation;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdoptionCenterControllerTest {

    @InjectMocks
    private AdoptionCenterController controller;

    @Mock
    private AdoptionCenterService adoptionCenterService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SessionValidation sessionValidation;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpSession session;

    private User testUser;
    private AdoptionCenterDTO dto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setAdoptionCenterName("Old Name");
        testUser.setWebsite("http://oldsite.com");
        testUser.setBio("Old bio");
        testUser.setPhoneNumber("1234567890");

        dto = new AdoptionCenterDTO();
        when(request.getSession()).thenReturn(session);
        when(request.getSession(true)).thenReturn(session);
    }

    @Test
    void testChangeAdoptionCenterName_Success() {
        dto.setAdoptionCenterName("New Name");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = controller.changeAdoptionCenterName(1L, dto, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("First name updated to: " + dto.getAdoptionCenterName(), response.getBody());

        verify(userRepository).saveAndFlush(any(User.class));
        verify(session).invalidate();
        verify(session).setAttribute(eq("user"), any(User.class));
    }

    @Test
    void testUpdateWebsiteLink_Success() {
        dto.setWebsite("http://newsite.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = controller.updateWebsiteLink(1L, dto, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Website updated to: " + dto.getWebsite(), response.getBody());
    }

    @Test
    void testUpdateBio_Success() {
        dto.setBio("New bio!");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = controller.updateBio(1L, dto, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Bio updated to: " + dto.getBio(), response.getBody());
    }

    @Test
    void testUpdatePhoneNumber_Success() {
        dto.setPhoneNumber("9876543210");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = controller.updatePhoneNumber(1L, dto, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Phone number updated to: " + dto.getPhoneNumber(), response.getBody());
    }


    @Test
    void testChangeAdoptionCenterName_UserNotFound() {
        dto.setAdoptionCenterName("New Name");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller.changeAdoptionCenterName(1L, dto, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }

    @Test
    void testUpdateWebsiteLink_UserNotFound() {
        dto.setWebsite("http://newsite.com");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller.updateWebsiteLink(1L, dto, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }

    @Test
    void testUpdateBio_UserNotFound() {
        dto.setBio("New bio!");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller.updateBio(1L, dto, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }

    @Test
    void testUpdatePhoneNumber_UserNotFound() {
        dto.setPhoneNumber("9876543210");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller.updatePhoneNumber(1L, dto, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }
}
