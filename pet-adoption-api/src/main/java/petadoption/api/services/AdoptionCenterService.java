package petadoption.api.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.DTO.AdoptionCenterDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

/**
 * Service class for handling Adoption Center-related business logic.
 */
@Service
public class AdoptionCenterService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private static final Logger logger = LoggerFactory.getLogger(AdoptionCenterService.class);
    private final GeocodeService geocodeService;

    /**
     * Constructor for AdoptionCenterService.
     *
     * @param userRepository  Repository for user entities.
     * @param passwordEncoder Password encoder for encoding user passwords.
     * @param emailService    Service for sending emails.
     * @param geocodeService  Service for geocoding addresses.
     */
    @Autowired
    public AdoptionCenterService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService, GeocodeService geocodeService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.geocodeService = geocodeService;
    }

    /**
     * Registers a new adoption center user.
     *
     * @param adoptionCenterDTO Data transfer object containing the adoption center registration information.
     * @return A ResponseEntity containing the created user or an error message.
     * @throws IOException If an error occurs during geocoding or email sending.
     * @throws InterruptedException If the geocoding process is interrupted.
     */
    public ResponseEntity<?> registerAdoptionCenter(AdoptionCenterDTO adoptionCenterDTO) throws IOException, InterruptedException {
        Double[] coords = geocodeService.getCoordinatesFromAddress(adoptionCenterDTO.getAddress());
        if(coords == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: bad address");
        }
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
        user.setLatitude(coords[0]);
        user.setLongitude(coords[1]);

        user.setEmailVerified(false);
        user.setProfilePhoto(null);

        user = userRepository.save(user);
        emailService.sendVerificationEmail(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    /**
     * Updates the adoption center's name for the specified user.
     *
     * @param user    The User entity to update.
     * @param newName The new adoption center name.
     */
    public void updateName(User user, String newName) {
        user.setAdoptionCenterName(newName);
        userRepository.save(user);
    }

}
