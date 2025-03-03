package petadoption.api.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.DTO.AdoptionCenterDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;

import java.util.Optional;

@Service
public class AdoptionCenterService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AdoptionCenterService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public ResponseEntity<?> registerAdoptionCenter(AdoptionCenter adoptionCenter) {
        Optional<AdoptionCenter> existingCenter = adoptionCenterRepository.findByEmail(adoptionCenter.getEmail());
        if(existingCenter.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already in use.");
        }
        adoptionCenter.setPassword(passwordEncoder.encode(adoptionCenter.getPassword()));
        adoptionCenterRepository.save(adoptionCenter);

        AdoptionCenter savedAdoptionCenter = adoptionCenterRepository.save(adoptionCenter);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdoptionCenter);
    }

    public void updateName(User user, String newName) {
        user.setAdoptionCenterName(newName);
        userRepository.save(user);
    }

}
