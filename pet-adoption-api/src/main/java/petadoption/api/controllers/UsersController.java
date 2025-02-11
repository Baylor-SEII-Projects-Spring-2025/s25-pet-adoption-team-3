package petadoption.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.UserService;

import java.util.Map;
import java.util.Optional;

//Usages: View User profile, edit user Profile, and Maybe Delete Account.
@RestController
@RequestMapping("/users")
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
}
