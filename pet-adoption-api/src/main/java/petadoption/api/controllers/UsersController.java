package petadoption.api.controllers;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.DTO.UserDTO;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.UserService;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.services.GCSStorageService;


import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

//Usages: View User profile, edit user Profile, and Maybe Delete Account.
@RestController
@RequestMapping("/api/users")
public class UsersController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final GCSStorageService gcsStorageService;

    public UsersController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.gcsStorageService = new GCSStorageService();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long userId, HttpServletRequest request) {
        // Fetch the user from the database instead of relying on session data
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Refresh the session with the latest user data
        request.getSession().setAttribute("user", user);

        return ResponseEntity.ok(user);
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
    public ResponseEntity<String> deleteProfilePhoto(@PathVariable Long userId, HttpServletRequest request) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        User user = userOptional.get();
        user.setProfilePhoto(null);
        userRepository.save(user);

        // Force a fresh retrieval of the updated user
        User updatedUser = userRepository.findById(userId).orElse(user);

        // Invalidate the old session and create a new one
        request.getSession().invalidate();
        HttpSession newSession = request.getSession(true);
        System.out.println("User DELETE PHOTO: " + updatedUser);
        newSession.setAttribute("user", updatedUser);

        return ResponseEntity.ok("Profile photo deleted successfully!");
    }
    @PostMapping("/{userId}/uploadProfilePhoto")
    public ResponseEntity<User> uploadProfilePhoto(@PathVariable Long userId, @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            // Generate a unique filename
            String fileName = "profile_photo_user-" + userId + "-" + UUID.randomUUID().toString();

            // Upload the file to GCS and get the public URL
            String uploadedFileUrl = gcsStorageService.uploadFile(file, fileName);

            // Update the user's profile with the new URL
            User user = userOptional.get();
            user.setProfilePhoto(uploadedFileUrl);

            // Ensure transaction commits before fetching
            userRepository.saveAndFlush(user);

            // Force Hibernate to reload the user from DB
            User updatedUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found after update"));

            // Invalidate the old session and create a new one
            request.getSession().invalidate();
            HttpSession newSession = request.getSession(true);
            newSession.setAttribute("user", updatedUser);

            System.out.println("User AFTER UPLOAD: " + updatedUser.getProfilePhoto()); // Debugging

            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }


}
