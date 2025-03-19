package petadoption.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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

import java.io.IOException;
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

    public PetController(PetService petService, PetRepository petRepository) {
        this.gcsStorageServicePets = new GCSStorageServicePets();
        this.petService = petService;
        this.petRepository = petRepository;
    }

    @PostMapping("/{petId}/uploadPetPhoto")
    public ResponseEntity<Pet> uploadPetPhoto(@PathVariable Long petId, @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Optional<Pet> petOptional = petRepository.findById(petId);
        if (petOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            String fileName = "pet_photo_" + petId + "_" + UUID.randomUUID();
            String uploadFileUrl = gcsStorageServicePets.uploadFile(file, fileName);

            Pet pet = petOptional.get();
            pet.setImage(uploadFileUrl);

            petRepository.saveAndFlush(pet);

            Pet updatedPet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found after update"));

            System.out.println("Pet AFTER UPLOAD: " + updatedPet.getImage());

            return ResponseEntity.ok(updatedPet);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/add-pet")
    public ResponseEntity<String> addPet(HttpSession session, @RequestBody @Valid PetRequestDTO petRequestDTO) {

        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("No active session.");
        if (user.getRole() != User.Role.ADOPTION_CENTER) return ResponseEntity.status(403).body("Unauthorized action.");

        petService.addPet(user, petRequestDTO);
        return ResponseEntity.status(201).body(petRequestDTO.getName() + " was successfully added.");
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editPet(HttpSession session, @PathVariable Long id, @RequestBody @Valid PetRequestDTO petRequestDTO) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("No active session.");

        if(user.getRole() != User.Role.ADOPTION_CENTER){
            return ResponseEntity.status(403).body("Unauthorized action.");
        }

        boolean updated = petService.editPet(user, id, petRequestDTO);

        return updated ? ResponseEntity.ok("Pet details updated successfully. ") : ResponseEntity.status(404).body("Pet not found or unauthorized.");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePet(HttpSession session, @PathVariable Long id) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("No active session.");
        if(user.getRole() != User.Role.ADOPTION_CENTER){
            return ResponseEntity.status(403).body("Unauthorized action.");
        }
        boolean deleted = petService.deletePet(user, id);

        return deleted ? ResponseEntity.ok("Pet successfully deleted.") : ResponseEntity.status(404).body("Pet not found or unauthorized.");
    }

    @GetMapping("/get-all-pets/{adoptionCenterID}")
    public ResponseEntity<List<Pet>> getAllPets(@PathVariable Long adoptionCenterID) {
        List<Pet> pets = petService.getAllPets(adoptionCenterID);
        return pets.isEmpty() ? ResponseEntity.status(404).body(null) : ResponseEntity.ok(pets);
    }



}
