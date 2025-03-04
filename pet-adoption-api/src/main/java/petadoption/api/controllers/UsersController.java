package petadoption.api.controllers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import petadoption.api.DTO.UserDTO;
import petadoption.api.models.User;
import petadoption.api.models.Token;
import petadoption.api.repository.UserRepository;
import petadoption.api.repository.TokenRepository;
import petadoption.api.services.GCSStorageService;
import petadoption.api.services.UserService;

//Usages: View User profile, edit user Profile, and Maybe Delete Account.

@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })@RestController
@RequestMapping("/api/users")
public class UsersController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final GCSStorageService gcsStorageService;
    private final TokenRepository tokenRepository;

    @Value("${frontend.url}")
    private String frontendUrl;

    public UsersController(UserService userService, UserRepository userRepository, TokenRepository tokenRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.gcsStorageService = new GCSStorageService();
        this.tokenRepository = tokenRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long userId, HttpServletRequest request) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

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

    @GetMapping("/verify-email")
    public void verifyUserEmail(@RequestParam String token, HttpServletResponse response) throws IOException {
        Optional<Token> verificationTokenOptional = tokenRepository.findByTokenAndTokenType(token, Token.TokenType.EMAIL_VERIFICATION);
        if (verificationTokenOptional.isEmpty()) {
            response.sendRedirect("/verification-failed");
            return;
        }

        Token verificationToken = verificationTokenOptional.get();
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            response.sendRedirect("/verification-expired");
            return;
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        tokenRepository.delete(verificationToken);

        response.sendRedirect(frontendUrl + "/email-verified");
    }

    @PutMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationEmail(@RequestParam String email) {
        return userService.resendVerificationEmail(email);
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

        User updatedUser = userRepository.findById(userId).orElse(user);

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
            String fileName = "profile_photo_user-" + userId + "-" + UUID.randomUUID().toString();

            String uploadedFileUrl = gcsStorageService.uploadFile(file, fileName);

            User user = userOptional.get();
            user.setProfilePhoto(uploadedFileUrl);

            userRepository.saveAndFlush(user);

            User updatedUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found after update"));

            request.getSession().invalidate();
            HttpSession newSession = request.getSession(true);
            newSession.setAttribute("user", updatedUser);

            System.out.println("User AFTER UPLOAD: " + updatedUser.getProfilePhoto());

            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPasswordLink(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return userService.forgotPasswordLink(email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {

        String token = request.get("token");
        String newPassword = request.get("newPassword");
        return userService.resetPassword(token, newPassword);
    }

}
