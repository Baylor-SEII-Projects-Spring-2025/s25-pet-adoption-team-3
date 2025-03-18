package petadoption.api.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.DTO.PetRequestDTO;
import petadoption.api.models.User;
import petadoption.api.services.PetService;
import jakarta.validation.Valid;





@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/pet")
public class PetController {
    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
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

}
