package petadoption.api.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.models.AdoptionCenter;
import petadoption.api.repository.AdoptionCenterRepository;

import java.util.Optional;

@Service
public class AdoptionCenterService {
    private final AdoptionCenterRepository adoptionCenterRepository;
    private final PasswordEncoder passwordEncoder;

    public AdoptionCenterService(AdoptionCenterRepository adoptionCenterRepository, PasswordEncoder passwordEncoder) {
        this.adoptionCenterRepository = adoptionCenterRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?> registerAdoptionCenter(AdoptionCenter adoptionCenter) {
        Optional<AdoptionCenter> existingCenter = adoptionCenterRepository.findByEmail(adoptionCenter.getEmail());
        if(existingCenter.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already in use.");
        }
        adoptionCenter.setPassword(passwordEncoder.encode(adoptionCenter.getPassword()));
        adoptionCenterRepository.save(adoptionCenter);
        return ResponseEntity.status(HttpStatus.CREATED).body("Adoption Center: " + adoptionCenter.getAdoptionCenterName() + " registered successfully.");
    }
}
