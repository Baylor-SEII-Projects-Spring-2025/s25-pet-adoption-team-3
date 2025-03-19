package petadoption.api.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import petadoption.api.DTO.PetRequestDTO;
import petadoption.api.controllers.PetController;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.services.PetService;

import jakarta.servlet.http.HttpSession;
import petadoption.api.services.SessionValidation;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.*;

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

    @Test
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

        when(petService.addPetWithImages(
                eq(adoptionCenter),
                any(PetRequestDTO.class),
                anyList()
        )).thenReturn(ResponseEntity.status(201).body(new Pet()));

        ResponseEntity<Pet> response = petController.addPetWithImages(
                session,
                petRequestDTO.getName(),
                petRequestDTO.getBreed(),
                petRequestDTO.getSpayedStatus(),
                petRequestDTO.getBirthdate(),
                petRequestDTO.getAboutMe(),
                petRequestDTO.getExtra1(),
                petRequestDTO.getExtra2(),
                petRequestDTO.getExtra3(),
                Collections.emptyList()
        );

        assertEquals(CREATED, response.getStatusCode());
    }


    @Test
    void testEditPet_Success() {
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

        when(petService.editPet(eq(adoptionCenter), eq(1L), any(PetRequestDTO.class), anyList()))
                .thenReturn(true);

        ResponseEntity<String> response = petController.editPet(
                session,
                1L,
                petRequestDTO,
                Collections.emptyList()
        );

        assertEquals(OK, response.getStatusCode());
        assertEquals("Pet details updated successfully.", response.getBody());
    }


    @Test
    void testDeletePet_Success() {
        when(session.getAttribute("user")).thenReturn(adoptionCenter);
        when(petService.deletePet(adoptionCenter, 1L)).thenReturn(true);

        ResponseEntity<String> response = petController.deletePet(session, 1L);

        assertEquals(OK, response.getStatusCode());
        assertEquals("Pet successfully deleted.", response.getBody());
    }

    @Test
    void testGetAllPets_Success() {
        List<Pet> petList = Collections.emptyList();
        when(petService.getAllPets(1L)).thenReturn(petList);

        ResponseEntity<List<Pet>> response = petController.getAllPets(1L);

        assertEquals(NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }
}
