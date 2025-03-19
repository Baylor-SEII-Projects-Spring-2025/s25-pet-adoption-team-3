package petadoption.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.PetRequestDTO;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.repository.PetRepository;
import petadoption.api.services.GCSStorageServicePets;
import petadoption.api.services.PetService;
import jakarta.validation.Valid;
import petadoption.api.services.SessionValidation;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/pet")
public class PetController {
    private final PetService petService;
    private final GCSStorageServicePets gcsStorageServicePets;
    private final PetRepository petRepository;
    private final SessionValidation sessionValidation;

    public PetController(PetService petService, PetRepository petRepository, SessionValidation sessionValidation) {
        this.gcsStorageServicePets = new GCSStorageServicePets();
        this.petService = petService;
        this.petRepository = petRepository;
        this.sessionValidation = sessionValidation;
    }

    @PostMapping("/add-pet-with-images")
    public ResponseEntity<Pet> addPetWithImages(
            HttpSession session,
            @RequestParam("name") String name,
            @RequestParam("breed") String breed,
            @RequestParam("spayedStatus") String spayedStatus,
            @RequestParam("birthdate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthdate,
            @RequestParam("aboutMe") String aboutMe,
            @RequestParam("extra1") String extra1,
            @RequestParam("extra2") String extra2,
            @RequestParam("extra3") String extra3,
            @RequestParam("files") MultipartFile[] files) {

        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body(null);
        }
        User user = (User) validationResponse.getBody();

        PetRequestDTO petRequestDTO = new PetRequestDTO();
        petRequestDTO.setName(name);
        petRequestDTO.setBreed(breed);
        petRequestDTO.setSpayedStatus(spayedStatus);
        petRequestDTO.setBirthdate(birthdate);
        petRequestDTO.setAboutMe(aboutMe);
        petRequestDTO.setExtra1(extra1);
        petRequestDTO.setExtra2(extra2);
        petRequestDTO.setExtra3(extra3);

        return petService.addPetWithImages(user, petRequestDTO, files);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editPet(
            HttpSession session,
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("breed") String breed,
            @RequestParam("spayedStatus") String spayedStatus,
            @RequestParam("birthdate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthdate,
            @RequestParam("aboutMe") String aboutMe,
            @RequestParam("extra1") String extra1,
            @RequestParam("extra2") String extra2,
            @RequestParam("extra3") String extra3,
            @RequestParam("files") MultipartFile[] files) {

        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }

        User user = (User) validationResponse.getBody();

        PetRequestDTO petRequestDTO = new PetRequestDTO();
        petRequestDTO.setName(name);
        petRequestDTO.setBreed(breed);
        petRequestDTO.setSpayedStatus(spayedStatus);
        petRequestDTO.setBirthdate(birthdate);
        petRequestDTO.setAboutMe(aboutMe);
        petRequestDTO.setExtra1(extra1);
        petRequestDTO.setExtra2(extra2);
        petRequestDTO.setExtra3(extra3);

        boolean updated = petService.editPet(user, id, petRequestDTO, files);

        return updated ? ResponseEntity.ok("Pet details updated successfully.")
                : ResponseEntity.status(404).body("Pet not found or unauthorized.");
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePet(HttpSession session, @PathVariable Long id) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }

        User user = (User) validationResponse.getBody();
        boolean deleted = petService.deletePet(user, id);

        return deleted ? ResponseEntity.ok("Pet successfully deleted.") : ResponseEntity.status(404).body("Pet not found or unauthorized.");
    }

    @GetMapping("/get-all-pets/{adoptionCenterID}")
    public ResponseEntity<List<Pet>> getAllPets(@PathVariable Long adoptionCenterID) {
        List<Pet> pets = petService.getAllPets(adoptionCenterID);
        return pets.isEmpty() ? ResponseEntity.status(404).body(null) : ResponseEntity.ok(pets);
    }

    @GetMapping("/get-pet-detail/{petId}")
    public ResponseEntity<?> getPetDetail(@PathVariable Long petId) {
        Optional<Pet> petOptional = petService.getPetDetail(petId);

        if (petOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Pet not found.");
        }

        return ResponseEntity.ok(petOptional.get());
    }

    @GetMapping("/swipe/get-pet")
    public ResponseEntity<Pet> getSwipePet() {
        Optional<Pet> petOptional = petService.getSwipePet();

        if (petOptional.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        return ResponseEntity.ok(petOptional.get());
    }


}
