package petadoption.api.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.DTO.AdoptionCenterDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;

@Service
public class AdoptionCenterService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private static final Logger logger = LoggerFactory.getLogger(AdoptionCenterService.class);

    public AdoptionCenterService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public ResponseEntity<?> registerAdoptionCenter(AdoptionCenterDTO adoptionCenterDTO) {
        User user = new User();
        user.setEmail(adoptionCenterDTO.getEmail());
        user.setPassword(passwordEncoder.encode(adoptionCenterDTO.getPassword()));
        user.setRole(User.Role.ADOPTION_CENTER);
        user.setAdoptionCenterName(adoptionCenterDTO.getAdoptionCenterName());
        user.setBio(adoptionCenterDTO.getBio());
        user.setPhoneNumber(adoptionCenterDTO.getPhoneNumber());
        user.setWebsite(adoptionCenterDTO.getWebsite());
        user.setAddress(adoptionCenterDTO.getAddress());
        user.setProfilePhoto(adoptionCenterDTO.getProfilePhoto());

        user.setEmailVerified(false);
        user.setProfilePhoto(null);

        user = userRepository.save(user);
        emailService.sendVerificationEmail(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    public void updateName(User user, String newName) {
        user.setAdoptionCenterName(newName);
        userRepository.save(user);
    }

}
