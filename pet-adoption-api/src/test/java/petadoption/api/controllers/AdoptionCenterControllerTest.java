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

/**
 * Unit tests for {@link AdoptionCenterController} covering CRUD operations for adoption center fields.
 * <p>
 * Each test mocks dependencies using Mockito, sets up a test user and DTO,
 * and asserts that controller endpoints respond correctly to both happy path and failure cases.
 * </p>
 */
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

    /**
     * Initialize test mocks and reusable objects before each test.
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setAdoptionCenterName("Old Name");
        testUser.setWebsite("http://oldsite.com");
        testUser.setBio("Old bio");
        testUser.setPhoneNumber("1234567890");
        testUser.setAddress("Old address");


        dto = new AdoptionCenterDTO();
        when(request.getSession()).thenReturn(session);
        when(request.getSession(true)).thenReturn(session);
    }

    /**
     * Tests successful update of adoption center name.
     */
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

    /**
     * Tests successful update of website field.
     */
    @Test
    void testUpdateWebsiteLink_Success() {
        dto.setWebsite("http://newsite.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = controller.updateWebsiteLink(1L, dto, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Website updated to: " + dto.getWebsite(), response.getBody());
    }

    /**
     * Tests successful update of bio field.
     */
    @Test
    void testUpdateBio_Success() {
        dto.setBio("New bio!");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = controller.updateBio(1L, dto, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Bio updated to: " + dto.getBio(), response.getBody());
    }

    /**
     * Tests successful update of phone number field.
     */
    @Test
    void testUpdatePhoneNumber_Success() {
        dto.setPhoneNumber("9876543210");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = controller.updatePhoneNumber(1L, dto, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Phone number updated to: " + dto.getPhoneNumber(), response.getBody());
    }

    /**
     * Tests failure to update name when user does not exist.
     */
    @Test
    void testChangeAdoptionCenterName_UserNotFound() {
        dto.setAdoptionCenterName("New Name");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller.changeAdoptionCenterName(1L, dto, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }

    /**
     * Tests failure to update website when user does not exist.
     */
    @Test
    void testUpdateWebsiteLink_UserNotFound() {
        dto.setWebsite("http://newsite.com");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller.updateWebsiteLink(1L, dto, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }

    /**
     * Tests failure to update bio when user does not exist.
     */
    @Test
    void testUpdateBio_UserNotFound() {
        dto.setBio("New bio!");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller.updateBio(1L, dto, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }

    /**
     * Tests failure to update phone number when user does not exist.
     */
    @Test
    void testUpdatePhoneNumber_UserNotFound() {
        dto.setPhoneNumber("9876543210");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller.updatePhoneNumber(1L, dto, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }

    /**
     * Tests successful update of address field.
     */
    @Test
    void testUpdateAddress_Success() {
        dto.setAddress("456 New Shelter Lane");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser)).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = controller.updateAddress(1L, dto, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Address updated to: " + dto.getAddress(), response.getBody());

        verify(userRepository).saveAndFlush(any(User.class));
        verify(session).invalidate();
        verify(session).setAttribute(eq("user"), any(User.class));
    }

    /**
     * Tests failure to update address when user does not exist.
     */
    @Test
    void testUpdateAddress_UserNotFound() {
        dto.setAddress("456 New Shelter Lane");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller.updateAddress(1L, dto, request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not found.", response.getBody());
    }

}
