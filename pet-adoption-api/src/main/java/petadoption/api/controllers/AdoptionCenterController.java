package petadoption.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.models.AdoptionCenter;
import petadoption.api.services.AdoptionCenterService;

@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/adoption-center")
public class AdoptionCenterController {
    private final AdoptionCenterService adoptionCenterService;

    public AdoptionCenterController(AdoptionCenterService adoptionCenterService){
        this.adoptionCenterService = adoptionCenterService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerAdoptionCenter(@RequestBody AdoptionCenter adoptionCenter) {
        return adoptionCenterService.registerAdoptionCenter(adoptionCenter);
    }

}
