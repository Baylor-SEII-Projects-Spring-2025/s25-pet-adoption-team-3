package petadoption.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.AdoptionCenterDTO;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.AdoptionCenterService;

import petadoption.api.services.GCSStorageService;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/adoption-center")
public class AdoptionCenterController {
    private final AdoptionCenterService adoptionCenterService;
    private final GCSStorageService gcsStorageService;


    public AdoptionCenterController(AdoptionCenterService adoptionCenterService) {
        this.adoptionCenterService = adoptionCenterService;
        this.gcsStorageService = new GCSStorageService();

    }

    @PostMapping("/register")
    public ResponseEntity<?> registerAdoptionCenter(@RequestBody AdoptionCenterDTO adoptionCenterDTO) {
        return adoptionCenterService.registerAdoptionCenter(adoptionCenterDTO);
    }
}
