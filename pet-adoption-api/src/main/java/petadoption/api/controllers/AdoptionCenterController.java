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
    private final UserRepository userRepository;
    private final GCSStorageService gcsStorageService;
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



    @PutMapping("/change-name/{adoptionCenterId}")
    public ResponseEntity<String> changeAdoptionCenterName(@PathVariable Long adoptionCenterId, @RequestBody AdoptionCenterDTO adoptionCenterDTO, HttpServletRequest request) {
        if(adoptionCenterDTO.getAdoptionCenterName() == null || adoptionCenterDTO.getAdoptionCenterName().isEmpty()) {
            return ResponseEntity.badRequest().body("Adoption center name cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(adoptionCenterId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOptional.get();
        user.setAdoptionCenterName(adoptionCenterDTO.getAdoptionCenterName());
        userRepository.saveAndFlush(user);

        User updatedUser = userRepository.findById(adoptionCenterId).orElseThrow(() -> new RuntimeException("User not found after update"));
        request.getSession().invalidate();
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("user", updatedUser);

        return ResponseEntity.ok("First name updated to: " + adoptionCenterDTO.getAdoptionCenterName());
    }




    @PutMapping("/update-website-link/{adoptionCenterId}")
    public ResponseEntity<String> updateWebsiteLink(@PathVariable Long adoptionCenterId, @RequestBody AdoptionCenterDTO adoptionCenterDTO, HttpServletRequest request) {
        if(adoptionCenterDTO.getWebsite() == null || adoptionCenterDTO.getWebsite().isEmpty()) {
            return ResponseEntity.badRequest().body("Adoption center website cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(adoptionCenterId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOptional.get();
        user.setWebsite(adoptionCenterDTO.getWebsite());
        userRepository.saveAndFlush(user);

        User updatedUser = userRepository.findById(adoptionCenterId).orElseThrow(() -> new RuntimeException("User not found after update"));
        request.getSession().invalidate();
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("user", updatedUser);

        return ResponseEntity.ok("Website updated to: " + adoptionCenterDTO.getWebsite());
    }

    @PutMapping("/update-bio/{adoptionCenterId}")
    public ResponseEntity<String> updateBio(@PathVariable Long adoptionCenterId, @RequestBody AdoptionCenterDTO adoptionCenterDTO, HttpServletRequest request) {
        if(adoptionCenterDTO.getBio() == null || adoptionCenterDTO.getBio().isEmpty()) {
            return ResponseEntity.badRequest().body("Adoption center bio cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(adoptionCenterId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOptional.get();
        user.setBio(adoptionCenterDTO.getBio());
        userRepository.saveAndFlush(user);

        User updatedUser = userRepository.findById(adoptionCenterId).orElseThrow(() -> new RuntimeException("User not found after update"));
        request.getSession().invalidate();
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("user", updatedUser);

        return ResponseEntity.ok("Bio updated to: " + adoptionCenterDTO.getBio());
    }

    @PutMapping("/update-phone-number/{adoptionCenterId}")
    public ResponseEntity<String> updatePhoneNumber(@PathVariable Long adoptionCenterId, @RequestBody AdoptionCenterDTO adoptionCenterDTO, HttpServletRequest request) {
        if(adoptionCenterDTO.getPhoneNumber() == null || adoptionCenterDTO.getPhoneNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Adoption center phone number cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(adoptionCenterId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOptional.get();
        user.setPhoneNumber(adoptionCenterDTO.getPhoneNumber());
        userRepository.saveAndFlush(user);

        User updatedUser = userRepository.findById(adoptionCenterId).orElseThrow(() -> new RuntimeException("User not found after update"));
        request.getSession().invalidate();
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("user", updatedUser);

        return ResponseEntity.ok("Phone number updated to: " + adoptionCenterDTO.getPhoneNumber());
    }
}
