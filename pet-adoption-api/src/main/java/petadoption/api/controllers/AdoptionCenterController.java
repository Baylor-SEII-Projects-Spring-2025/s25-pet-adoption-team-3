package petadoption.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.models.AdoptionCenter;
import petadoption.api.repository.AdoptionCenterRepository;
import petadoption.api.services.AdoptionCenterService;

import petadoption.api.models.User;
import petadoption.api.services.GCSStorageService;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/adoption-center")
public class AdoptionCenterController {
    private final AdoptionCenterService adoptionCenterService;
    private final AdoptionCenterRepository adoptionCenterRepository;
    private final GCSStorageService gcsStorageService;


    public AdoptionCenterController(AdoptionCenterService adoptionCenterService, AdoptionCenterRepository adoptionCenterRepository) {
        this.adoptionCenterService = adoptionCenterService;
        this.adoptionCenterRepository = adoptionCenterRepository;
        this.gcsStorageService = new GCSStorageService();

    }

    @PostMapping("/register")
    public ResponseEntity<?> registerAdoptionCenter(@RequestBody AdoptionCenter adoptionCenter) {
        return adoptionCenterService.registerAdoptionCenter(adoptionCenter);
    }

    @PostMapping("/{userId}/uploadProfilePhoto")
    public ResponseEntity<AdoptionCenter> uploadProfilePhoto(@PathVariable Long userId, @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Optional<AdoptionCenter> userOptional = adoptionCenterRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            String fileName = "profile_photo_user-" + userId + "-" + UUID.randomUUID().toString();

            String uploadedFileUrl = gcsStorageService.uploadFile(file, fileName);

            AdoptionCenter user = userOptional.get();
            user.setPhoto(uploadedFileUrl);

            adoptionCenterRepository.saveAndFlush(user);

            AdoptionCenter updatedUser = adoptionCenterRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found after update"));

            request.getSession().invalidate();
            HttpSession newSession = request.getSession(true);
            newSession.setAttribute("user", updatedUser);

            System.out.println("User AFTER UPLOAD: " + updatedUser.getPhoto());

            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
