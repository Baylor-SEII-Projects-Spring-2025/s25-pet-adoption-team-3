package petadoption.api.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.PetDetailDTO;
import petadoption.api.DTO.PetRequestDTO;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.services.PetService;

import jakarta.servlet.http.HttpSession;
import petadoption.api.services.SessionValidation;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.*;

/**
 * Unit tests for {@link PetController} to verify core API logic for pet management endpoints.
 * <p>
 * Tests include scenarios for editing, deleting, retrieving, and swiping pets,
 * using Mockito to mock out the service layer and session behaviors.
 * </p>
 */
class PetControllerTest {

    @InjectMocks
    private PetController petController;

    @Mock
    private PetService petService;

    @Mock
    private HttpSession session;

    @Mock
    private SessionValidation sessionValidation;

    private User adoptionCenter;
    private PetRequestDTO petRequestDTO;

    /**
     * Sets up mock objects and reusable test data before each test.
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        adoptionCenter = new User();
        adoptionCenter.setId(1L);
        adoptionCenter.setRole(User.Role.ADOPTION_CENTER);

        petRequestDTO = new PetRequestDTO();
        petRequestDTO.setName("Buddy");
        petRequestDTO.setBreed("Golden Retriever");
        petRequestDTO.setSpayedStatus("Spayed Male");

        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTION_CENTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(adoptionCenter));

    }

    /*@Test
    void testAddPet_Success() {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTION_CENTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(adoptionCenter));

        PetRequestDTO petRequestDTO = new PetRequestDTO();
        petRequestDTO.setName("Buddy");
        petRequestDTO.setBreed("Golden Retriever");
        petRequestDTO.setSpayedStatus("Neutered Male");
        petRequestDTO.setBirthdate(LocalDate.of(2021, 6, 15));
        petRequestDTO.setAboutMe("Loves playing fetch!");
        petRequestDTO.setExtra1("Energetic");
        petRequestDTO.setExtra2("Good with kids");
        petRequestDTO.setExtra3("Needs a big backyard");

         BROKEN
        when(petService.addPetWithImages(
                eq(adoptionCenter),
                any(PetRequestDTO.class),
                any(MultipartFile[].class)
        )).thenReturn(ResponseEntity.status(201).body(new Pet()));


        ResponseEntity<PetRequestDTO> response = petController.addPetWithImages(
                session,
                petRequestDTO.getName(),
                petRequestDTO.getBreed(),
                petRequestDTO.getSpayedStatus(),
                petRequestDTO.getBirthdate(),
                petRequestDTO.getAboutMe(),
                petRequestDTO.getExtra1(),
                petRequestDTO.getExtra2(),
                petRequestDTO.getExtra3(),
                new MultipartFile[0]
        );

        assertEquals(CREATED, response.getStatusCode());
    } */

    /**
     * Tests the edit pet endpoint for successful update.
     * Verifies that a successful update returns a 200 response and correct message.
     */
    @Test
    void testEditPet_Success() {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTION_CENTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(adoptionCenter));

        when(petService.editPet(
                eq(adoptionCenter), eq(1L),
                any(PetRequestDTO.class),
                any(MultipartFile[].class)
        )).thenReturn(true);

        ResponseEntity<String> response = petController.editPet(
                session,
                1L,
                "Buddy",
                "Golden Retriever",
                "Neutered Male",
                LocalDate.of(2021, 6, 15),
                "Loves playing fetch!",
                "Energetic",
                "Good with kids",
                "Needs a big backyard",
                new MultipartFile[0]
        );

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Pet details updated successfully.", response.getBody());
    }

    /**
     * Tests the delete pet endpoint for successful deletion.
     * Verifies a 200 OK and correct message on deletion.
     */
    @Test
    void testDeletePet_Success() {
        when(session.getAttribute("user")).thenReturn(adoptionCenter);
        when(petService.deletePet(adoptionCenter, 1L)).thenReturn(true);

        ResponseEntity<String> response = petController.deletePet(session, 1L);

        assertEquals(OK, response.getStatusCode());
        assertEquals("Pet successfully deleted.", response.getBody());
    }

    /**
     * Tests retrieval of all pets for a given adoption center.
     * Asserts the returned response is not null and has status 200.
     */
    @Test
    void testGetAllPets_Success() {
        List<Pet> petList = Collections.emptyList();
        when(session.getAttribute("user")).thenReturn(adoptionCenter);
        when(petService.getAllPets(1L)).thenReturn(petList);

        ResponseEntity<?> response = petController.getAllPets( 1L);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }

    /**
     * Tests retrieval of a pet's details by ID when the pet exists.
     * Asserts a 200 status and correct pet object is returned.
     */
    @Test
    void testGetPetDetail_Found() {
        Pet pet = new Pet();
        pet.setId(1L);
        pet.setName("Buddy");

        when(petService.getPetDetail(1L)).thenReturn(Optional.of(pet));

        ResponseEntity<?> response = petController.getPetDetail(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(pet, response.getBody());
    }

    /**
     * Tests retrieval of a pet's details by ID when the pet does not exist.
     * Asserts a 404 status and correct message.
     */
    @Test
    void testGetPetDetail_NotFound() {
        when(petService.getPetDetail(999L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = petController.getPetDetail(999L);

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Pet not found.", response.getBody());
    }

    /**
     * Tests swipe pet endpoint when a pet is found to swipe.
     * Verifies 200 status and the correct pet object is returned.
     */
    @Test
    void testGetSwipePet_Found() {
        Pet pet = new Pet();
        pet.setId(2L);
        pet.setName("Swipey");

        when(petService.getSwipePet()).thenReturn(Optional.of(pet));

        ResponseEntity<Pet> response = petController.getSwipePet();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(pet, response.getBody());
    }

    /**
     * Tests swipe pet endpoint when no pets are found to swipe.
     * Verifies 404 status and null response body.
     */
    @Test
    void testGetSwipePet_NotFound() {
        when(petService.getSwipePet()).thenReturn(Optional.empty());

        ResponseEntity<Pet> response = petController.getSwipePet();

        assertEquals(404, response.getStatusCodeValue());
        assertNull(response.getBody());
    }
}
