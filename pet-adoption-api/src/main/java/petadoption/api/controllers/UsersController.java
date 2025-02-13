package petadoption.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.DTO.UserDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.UserService;

import java.util.Optional;

//Usages: View User profile, edit user Profile, and Maybe Delete Account.
@RestController
@RequestMapping("/api/users")
public class UsersController {
    private final UserService userService;
    private final UserRepository userRepository;

    public UsersController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}/photo")
    public ResponseEntity<String> updateProfilePhoto(@PathVariable Long userId, @RequestParam String photoUrl) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();
        user.setProfilePhoto(photoUrl);
        userRepository.save(user);

        return ResponseEntity.ok("Profile photo updated successfully!");
    }

    @PutMapping("/{userId}/verify-email")
    public ResponseEntity<String> verifyUserEmail(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();
        user.setEmailVerified(true);
        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully!");
    }

    @PutMapping("/changeFirstName/{userId}")
    public ResponseEntity<String> changeFirstName(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        if(userDTO.getFirstName() == null || userDTO.getFirstName().isEmpty()) {
            return ResponseEntity.badRequest().body("First name cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOptional.get();
        user.setFirstName(userDTO.getFirstName());
        userRepository.save(user);
        return ResponseEntity.ok("First name updated to: " + userDTO.getFirstName());
    }

    @PutMapping("/changeLastName/{userId}")
    public ResponseEntity<String> changeLastName(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        if(userDTO.getLastName() == null || userDTO.getLastName().isEmpty()) {
            return ResponseEntity.badRequest().body("Last name cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOptional.get();
        user.setLastName(userDTO.getLastName());
        userRepository.save(user);
        return ResponseEntity.ok("Last name updated to: " + userDTO.getLastName());
    }

    @PutMapping("/changeEmail/{userId}")
    public ResponseEntity<String> changeEmail(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        if(userDTO.getEmail() == null || userDTO.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        User user = userOptional.get();
        user.setEmail(userDTO.getEmail());
        userRepository.save(user);

        return ResponseEntity.ok("Email updated to: " + userDTO.getEmail());
    }

    @PutMapping("/deleteProfilePhoto/{userId}")
    public ResponseEntity<String> deleteProfilePhoto(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOptional.get();
        user.setProfilePhoto(null);
        userRepository.save(user);
        return ResponseEntity.ok("Profile photo deleted successfully!");
    }

}
