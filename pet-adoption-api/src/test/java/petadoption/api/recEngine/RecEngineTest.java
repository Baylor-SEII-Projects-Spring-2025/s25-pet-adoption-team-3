package petadoption.api.recEngine;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import petadoption.api.DTO.SwipePetDTO;
import petadoption.api.controllers.PetController;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.services.PetService;
import petadoption.api.services.RecEngineService;
import petadoption.api.services.SessionValidation;

import jakarta.servlet.http.HttpSession;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for pet recommendation and swipe features exposed in {@link PetController}.
 * <p>
 * Tests focus on the core functionalities of the RecEngine, including swiping/liking/disliking pets,
 * and returning lists of pets available for swiping or liked by the user.
 * The RecEngineService and other dependencies are mocked.
 * </p>
 */
class RecEngineTest {

    @InjectMocks
    private PetController controller;

    @Mock
    private PetService petService;

    @Mock
    private RecEngineService recEngineService;

    @Mock
    private SessionValidation sessionValidation;

    @Mock
    private HttpSession session;

    private User testUser;
    private Pet testPet;
    private SwipePetDTO testSwipePetDTO;

    /**
     * Sets up mocks and test data before each test.
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setRole(User.Role.ADOPTER);

        testPet = new Pet();
        testPet.setId(1L);
        testPet.setName("TestPet");
        testPet.setBirthdate(LocalDate.of(9999,12,30));
        testPet.setAdoptionCenter(testUser);
        testPet.setPetCharacteristics(List.of());
        testPet.setSpayedStatus("");

        testSwipePetDTO = new SwipePetDTO(testPet);
    }

    /**
     * Tests that a user can successfully get swipeable pets.
     * Expects HTTP 200 and a non-empty list containing the test DTO.
     */
    @Test
    void testGetSwipePet_Success() {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(testUser));
        when(recEngineService.getSwipePetsV2(testUser)).thenReturn(List.of(testSwipePetDTO));

        ResponseEntity<List<SwipePetDTO>> response = controller.getSwipePets(session);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(List.of(testSwipePetDTO), response.getBody());
    }

    /**
     * Tests that liking a pet with a valid pet and user succeeds.
     * Expects HTTP 200 and a success message.
     */
    @Test
    void testLikePet_Success() {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(testUser));
        when(petService.getPetDetail(1L)).thenReturn(Optional.ofNullable(testPet));
        when(recEngineService.likePet(testUser, Optional.ofNullable(testPet)))
                .thenReturn("Successfully liked pet");

        ResponseEntity<String> response = controller.likePet(session, 1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Successfully liked pet", response.getBody());
        verify(recEngineService).likePet(testUser, Optional.ofNullable(testPet));
    }

    /**
     * Tests that liking a pet which does not exist returns an error.
     * Expects HTTP 400 and error message.
     */
    @Test
    void testLikePet_NoPetFound() {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(testUser));
        when(petService.getPetDetail(-1L)).thenReturn(Optional.empty());
        when(recEngineService.likePet(testUser, Optional.empty()))
                .thenReturn("Error: Pet not found");

        ResponseEntity<String> response = controller.likePet(session, -1L);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Error: Pet not found", response.getBody());
    }

    /**
     * Tests that disliking a pet with a valid pet and user succeeds.
     * Expects HTTP 200 and a success message.
     */
    @Test
    void testDislikePet_Success() {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(testUser));
        when(petService.getPetDetail(1L)).thenReturn(Optional.ofNullable(testPet));
        when(recEngineService.dislikePet(testUser, Optional.ofNullable(testPet)))
                .thenReturn("Successfully disliked pet");

        ResponseEntity<String> response = controller.dislikePet(session, 1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Successfully disliked pet", response.getBody());
        verify(recEngineService).dislikePet(testUser, Optional.ofNullable(testPet));
    }

    /**
     * Tests that disliking a non-existent pet returns an error.
     * Expects HTTP 400 and error message.
     */
    @Test
    void testDislikePet_NoPetFound() {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(testUser));
        when(petService.getPetDetail(-1L)).thenReturn(Optional.empty());
        when(recEngineService.dislikePet(testUser, Optional.empty()))
                .thenReturn("Error: Pet not found");

        ResponseEntity<String> response = controller.dislikePet(session, -1L);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Error: Pet not found", response.getBody());
    }

    /**
     * Tests that a user can fetch their liked pets.
     * Expects HTTP 200 and the correct DTO list.
     */
    @Test
    void testGetLikedPet_Success() {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(testUser));
        when(petService.getLikedPets(testUser)).thenReturn(List.of(testSwipePetDTO));

        ResponseEntity<List<SwipePetDTO>> response = controller.getLikedPets(session);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(List.of(testSwipePetDTO), response.getBody());
        verify(petService).getLikedPets(testUser);
    }

    /**
     * Tests fetching liked pets with an invalid session.
     * Expects HTTP 403 and null body.
     */
    @Test
    void testGetLikedPet_InvalidSession() {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTER)))
                .thenReturn((ResponseEntity) ResponseEntity.status(HttpStatus.FORBIDDEN).body(null));

        ResponseEntity<List<SwipePetDTO>> response = controller.getLikedPets(session);

        assertEquals(403, response.getStatusCodeValue());
        assertNull(response.getBody());
    }
}