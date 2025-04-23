package petadoption.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.DTO.AdoptionCenterDTO;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.repository.PetRepository;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.AdoptionCenterService;

import petadoption.api.services.GCSStorageService;
import petadoption.api.services.SessionValidation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for all adoption center-related API endpoints.
 * Handles registration, profile updates, pet management, and adoption actions
 * for adoption centers on the platform.
 */
@CrossOrigin(origins = {"http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000"})
@RestController
@RequestMapping("/api/adoption-center")
public class AdoptionCenterController {
    private final AdoptionCenterService adoptionCenterService;
    private final UserRepository userRepository;
    private final GCSStorageService gcsStorageService;
    private final SessionValidation sessionValidation;
    private final PetRepository petRepository;


    public AdoptionCenterController(AdoptionCenterService adoptionCenterService, UserRepository userRepository, SessionValidation sessionValidation, PetRepository petRepository) {
        this.sessionValidation = sessionValidation;
        this.adoptionCenterService = adoptionCenterService;
        this.gcsStorageService = new GCSStorageService();
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    /**
     * Registers a new adoption center.
     *
     * @param adoptionCenterDTO the data transfer object containing center details
     * @return ResponseEntity with registration result
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerAdoptionCenter(@RequestBody AdoptionCenterDTO adoptionCenterDTO) {
        return adoptionCenterService.registerAdoptionCenter(adoptionCenterDTO);
    }

    /**
     * Updates the adoption center's display name.
     *
     * @param adoptionCenterId  the ID of the adoption center to update
     * @param adoptionCenterDTO DTO containing the new name
     * @param request           HTTP request for session management
     * @return ResponseEntity with status message
     */
    @PutMapping("/change-name/{adoptionCenterId}")
    public ResponseEntity<String> changeAdoptionCenterName(@PathVariable Long adoptionCenterId, @RequestBody AdoptionCenterDTO adoptionCenterDTO, HttpServletRequest request) {
        if (adoptionCenterDTO.getAdoptionCenterName() == null || adoptionCenterDTO.getAdoptionCenterName().isEmpty()) {
            return ResponseEntity.badRequest().body("Adoption center name cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(adoptionCenterId);
        if (userOptional.isEmpty()) {
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

    /**
     * Updates the website link for an adoption center.
     *
     * @param adoptionCenterId  the ID of the adoption center
     * @param adoptionCenterDTO DTO containing the new website link
     * @param request           HTTP request for session management
     * @return ResponseEntity with status message
     */
    @PutMapping("/update-website-link/{adoptionCenterId}")
    public ResponseEntity<String> updateWebsiteLink(@PathVariable Long adoptionCenterId, @RequestBody AdoptionCenterDTO adoptionCenterDTO, HttpServletRequest request) {
        if (adoptionCenterDTO.getWebsite() == null || adoptionCenterDTO.getWebsite().isEmpty()) {
            return ResponseEntity.badRequest().body("Adoption center website cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(adoptionCenterId);
        if (userOptional.isEmpty()) {
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

    /**
     * Updates the bio for an adoption center.
     *
     * @param adoptionCenterId  the ID of the adoption center
     * @param adoptionCenterDTO DTO containing the new bio
     * @param request           HTTP request for session management
     * @return ResponseEntity with status message
     */
    @PutMapping("/update-bio/{adoptionCenterId}")
    public ResponseEntity<String> updateBio(@PathVariable Long adoptionCenterId, @RequestBody AdoptionCenterDTO adoptionCenterDTO, HttpServletRequest request) {
        if (adoptionCenterDTO.getBio() == null || adoptionCenterDTO.getBio().isEmpty()) {
            return ResponseEntity.badRequest().body("Adoption center bio cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(adoptionCenterId);
        if (userOptional.isEmpty()) {
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

    /**
     * Updates the phone number for an adoption center.
     *
     * @param adoptionCenterId  the ID of the adoption center
     * @param adoptionCenterDTO DTO containing the new phone number
     * @param request           HTTP request for session management
     * @return ResponseEntity with status message
     */
    @PutMapping("/update-phone-number/{adoptionCenterId}")
    public ResponseEntity<String> updatePhoneNumber(@PathVariable Long adoptionCenterId, @RequestBody AdoptionCenterDTO adoptionCenterDTO, HttpServletRequest request) {
        if (adoptionCenterDTO.getPhoneNumber() == null || adoptionCenterDTO.getPhoneNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Adoption center phone number cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(adoptionCenterId);
        if (userOptional.isEmpty()) {
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

    /**
     * Updates the address for an adoption center.
     *
     * @param adoptionCenterId  the ID of the adoption center
     * @param adoptionCenterDTO DTO containing the new address
     * @param request           HTTP request for session management
     * @return ResponseEntity with status message
     */
    @PutMapping("/update-address/{adoptionCenterId}")
    public ResponseEntity<String> updateAddress(@PathVariable Long adoptionCenterId, @RequestBody AdoptionCenterDTO adoptionCenterDTO, HttpServletRequest request) {
        if (adoptionCenterDTO.getAddress() == null || adoptionCenterDTO.getAddress().isEmpty()) {
            return ResponseEntity.badRequest().body("Adoption center address cannot be empty.");
        }

        Optional<User> userOptional = userRepository.findById(adoptionCenterId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        User user = userOptional.get();
        user.setAddress(adoptionCenterDTO.getAddress());
        userRepository.saveAndFlush(user);

        User updatedUser = userRepository.findById(adoptionCenterId).orElseThrow(() -> new RuntimeException("User not found after update"));
        request.getSession().invalidate();
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("user", updatedUser);

        return ResponseEntity.ok("Address updated to: " + adoptionCenterDTO.getAddress());
    }

    /**
     * Retrieves all pets belonging to the currently logged-in adoption center.
     *
     * @param request HTTP request for session validation
     * @return ResponseEntity containing a list of pets or error status
     */
    @GetMapping("/pets")
    public ResponseEntity<?> getPetsForLoggedInAdoptionCenter(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return ResponseEntity.status(401).body("User not logged in.");
        }

        User user = (User) session.getAttribute("user");
        if (user.getAdoptionCenterName().isEmpty() || user.getAdoptionCenterName() == null) {
            return ResponseEntity.status(403).body("User is not an adoption center.");
        }

        List<Pet> pets = petRepository.findByAdoptionCenterId(user.getId());
        return ResponseEntity.ok(pets);
    }

    /**
     * Retrieves a list of users who have liked a specific pet.
     *
     * @param petId the ID of the pet
     * @return ResponseEntity containing a list of users with basic info
     */
    @GetMapping("/users-who-liked/{petId}")
    public ResponseEntity<?> getUsersWhoLikedPet(@PathVariable Long petId) {
        List<Object[]> results = userRepository.findUsersWhoLikedPet(petId);

        List<Map<String, Object>> users = results.stream().map(obj -> {
            Map<String, Object> user = new HashMap<>();
            user.put("id", obj[0]);
            user.put("firstName", obj[1]);
            user.put("lastName", obj[2]);
            user.put("email", obj[3]);
            user.put("profilePhoto", obj[4]);
            return user;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    /**
     * Marks a pet as adopted by a given user (adopter).
     *
     * @param petId     the ID of the pet to mark as adopted
     * @param adopterId the ID of the adopter
     * @param request   HTTP request for session validation
     * @return ResponseEntity with operation result or error
     */
    @PutMapping("/adopt-pet/{petId}/by/{adopterId}")
    public ResponseEntity<?> markPetAsAdopted(
            @PathVariable Long petId,
            @PathVariable Long adopterId,
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return ResponseEntity.status(401).body("User not logged in.");
        }

        User actingUser = (User) session.getAttribute("user");

        if (!"ADOPTION_CENTER".equals(String.valueOf(actingUser.getRole()))) {
            return ResponseEntity.status(403).body("Only adoption centers can perform this action.");
        }

        Optional<User> adopterOpt = userRepository.findById(adopterId);
        if (adopterOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Adopter not found.");
        }

        Optional<Pet> optionalPet = petRepository.findById(petId);
        if (optionalPet.isEmpty()) {
            return ResponseEntity.status(404).body("Pet not found.");
        }

        Pet pet = optionalPet.get();
        pet.setAvailabilityStatus(Pet.PetStatus.ARCHIVED);
        pet.setAdopter(adopterOpt.get());

        petRepository.save(pet);

        return ResponseEntity.ok("Pet adopted by user: " + adopterOpt.get().getId());
    }

    /**
     * Retrieves a list of archived (adopted) pets for the logged-in adoption center,
     * including information about the adopters.
     *
     * @param request HTTP request for session validation
     * @return ResponseEntity containing archived pet and adopter info
     */
    @GetMapping("/archived-pets")
    public ResponseEntity<?> getArchivedPetsWithAdopterInfo(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return ResponseEntity.status(401).body("User not logged in.");
        }

        User adoptionCenter = (User) session.getAttribute("user");

        if (adoptionCenter.getAdoptionCenterName() == null || adoptionCenter.getAdoptionCenterName().isEmpty()) {
            return ResponseEntity.status(403).body("User is not an adoption center.");
        }

        List<Pet> archivedPets = petRepository.findByAdoptionCenterIdAndAvailabilityStatus(
                adoptionCenter.getId(), Pet.PetStatus.ARCHIVED
        );

        List<Map<String, Object>> result = archivedPets.stream()
                .filter(pet -> pet.getAdopter() != null)
                .map(pet -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("petId", pet.getId());
                    map.put("petName", pet.getName());
                    map.put("petImage", pet.getImage() != null && !pet.getImage().isEmpty() ? pet.getImage().get(0) : null);
                    map.put("breed", pet.getBreed());
                    map.put("spayedStatus", pet.getSpayedStatus());

                    User adopter = pet.getAdopter();
                    map.put("adopterId", adopter.getId());
                    map.put("firstName", adopter.getFirstName());
                    map.put("lastName", adopter.getLastName());
                    map.put("email", adopter.getEmail());
                    map.put("profilePhoto", adopter.getProfilePhoto());

                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
