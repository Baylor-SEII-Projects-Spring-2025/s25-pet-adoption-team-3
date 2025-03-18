package petadoption.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.AdoptionCenterDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.AdoptionCenterService;

import petadoption.api.services.GCSStorageService;
import petadoption.api.services.SessionValidation;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = {"http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000"})
@RestController
@RequestMapping("/api/adoption-center")
public class AdoptionCenterController {
    private final AdoptionCenterService adoptionCenterService;
    private final GCSStorageService gcsStorageService;
    private final UserRepository userRepository;
    private final SessionValidation sessionValidation;


    public AdoptionCenterController(AdoptionCenterService adoptionCenterService, UserRepository userRepository, SessionValidation sessionValidation) {
        this.sessionValidation = sessionValidation;
        this.adoptionCenterService = adoptionCenterService;
        this.gcsStorageService = new GCSStorageService();
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerAdoptionCenter(@RequestBody AdoptionCenterDTO adoptionCenterDTO) {
        return adoptionCenterService.registerAdoptionCenter(adoptionCenterDTO);
    }

    @PutMapping("/change-name")
    public ResponseEntity<String> changeAdoptionCenterName(HttpSession session, @RequestParam String newName) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("No active session.");
        if (user.getRole() != User.Role.ADOPTION_CENTER) return ResponseEntity.status(403).body("Unauthorized action.");

        adoptionCenterService.updateName(user, newName);
        session.setAttribute("user", user); //Updates the session with the new name

        return ResponseEntity.ok("Adoption center name updated successfully.");
    }

    @PutMapping("/update-website-link")
    public ResponseEntity<String> updateWebsiteLink(HttpSession session, @RequestBody AdoptionCenterDTO adoptionCenterDTO) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }

        User adoptionCenter = (User) validationResponse.getBody();
        adoptionCenter.setWebsite(adoptionCenterDTO.getWebsite());
        userRepository.save(adoptionCenter);

        return ResponseEntity.ok("Website link updated successfully.");
    }

}
