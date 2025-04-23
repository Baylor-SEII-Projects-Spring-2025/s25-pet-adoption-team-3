package petadoption.api.controllers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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
import petadoption.api.services.RecEngineService;
import petadoption.api.services.SessionValidation;
import petadoption.api.services.UserService;

/**
 * REST controller for user-related API endpoints.
 * Handles profile, authentication, email verification, photo upload, and password reset features.
 */
@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })@RestController
@RequestMapping("/api/users")
public class UsersController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final GCSStorageService gcsStorageService;
    private final TokenRepository tokenRepository;
    private final SessionValidation sessionValidation;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Autowired
    public UsersController(UserService userService, UserRepository userRepository, TokenRepository tokenRepository, SessionValidation sessionValidation) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.gcsStorageService = new GCSStorageService();
        this.tokenRepository = tokenRepository;
        this.sessionValidation = sessionValidation;
    }


    /**
     * Retrieves the profile information for a given user.
     *
     * @param userId   The ID of the user whose profile is being requested.
     * @param request  The HTTP servlet request (session will be updated).
     * @return         ResponseEntity containing the User object or 404 if not found.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long userId, HttpServletRequest request) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        request.getSession().setAttribute("user", user);

        return ResponseEntity.ok(user);
    }

    /**
     * Updates a user's profile photo URL directly.
     *
     * @param userId   The ID of the user to update.
     * @param photoUrl The new photo URL.
     * @return         ResponseEntity with status and message.
     */
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


    /**
     * Verifies a user's email using a token and redirects to the frontend.
     *
     * @param token    The verification token sent via email.
     * @param response The HTTP servlet response for redirection.
     * @throws IOException If there is a redirect error.
     */
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


    /**
     * Resends the verification email to the user.
     *
     * @param email The user's email address.
     * @return      ResponseEntity with status and result message.
     */
    @PutMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationEmail(@RequestParam String email) {
        return userService.resendVerificationEmail(email);
    }

    /**
     * Updates a user's first name.
     *
     * @param userId   The ID of the user to update.
     * @param userDTO  UserDTO containing the new first name.
     * @param request  HTTP request to refresh the session.
     * @return         ResponseEntity with status and result message.
     */
    @PutMapping("/changeFirstName/{userId}")
    public ResponseEntity<String> changeFirstName(@PathVariable Long userId, @RequestBody UserDTO userDTO, HttpServletRequest request) {
        if(userDTO.getFirstName() == null || userDTO.getFirstName().isEmpty()) {
            return ResponseEntity.badRequest().body("First name cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOptional.get();
        user.setFirstName(userDTO.getFirstName());
        userRepository.saveAndFlush(user);

        User updatedUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found after update"));
        request.getSession().invalidate();
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("user", updatedUser);

        return ResponseEntity.ok("First name updated to: " + userDTO.getFirstName());
    }

    /**
     * Updates a user's last name.
     *
     * @param userId   The ID of the user to update.
     * @param userDTO  UserDTO containing the new last name.
     * @param request  HTTP request to refresh the session.
     * @return         ResponseEntity with status and result message.
     */
    @PutMapping("/changeLastName/{userId}")
    public ResponseEntity<String> changeLastName(@PathVariable Long userId, @RequestBody UserDTO userDTO, HttpServletRequest request) {
        if(userDTO.getLastName() == null || userDTO.getLastName().isEmpty()) {
            return ResponseEntity.badRequest().body("Last name cannot be empty.");
        }
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOptional.get();
        user.setLastName(userDTO.getLastName());
        userRepository.saveAndFlush(user);

        User updatedUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found after update"));
        request.getSession().invalidate();
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("user", updatedUser);
        return ResponseEntity.ok("Last name updated to: " + userDTO.getLastName());
    }

    /**
     * Updates a user's email address.
     *
     * @param userId   The ID of the user to update.
     * @param userDTO  UserDTO containing the new email address.
     * @return         ResponseEntity with status and result message.
     */
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


    /**
     * Deletes a user's profile photo.
     *
     * @param userId   The ID of the user whose photo will be deleted.
     * @param request  HTTP request to refresh the session.
     * @return         ResponseEntity with status and result message.
     */
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
        newSession.setAttribute("user", updatedUser);

        return ResponseEntity.ok("Profile photo deleted successfully!");
    }

    /**
     * Uploads a new profile photo for the user and updates their session.
     *
     * @param userId   The ID of the user uploading the photo.
     * @param file     The photo file (multipart form data).
     * @param request  HTTP request to refresh the session.
     * @return         ResponseEntity containing the updated User or error.
     */
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

            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Sends a forgot password email with a reset link to the user.
     *
     * @param request  JSON body containing the user's email.
     * @return         ResponseEntity with status and message.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPasswordLink(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return userService.forgotPasswordLink(email);
    }

    /**
     * Resets a user's password using a reset token and a new password.
     *
     * @param request  JSON body containing the reset token and new password.
     * @return         ResponseEntity with status and message.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {

        String token = request.get("token");
        String newPassword = request.get("newPassword");
        return userService.resetPassword(token, newPassword);
    }

    @PostMapping("/set-location")
    public ResponseEntity<String> setLocation(@RequestParam("latitude") Double latitude, @RequestParam("longitude") Double longitude, HttpSession session, HttpServletRequest request) {
        User user = (User) session.getAttribute("user");

        if(user == null){
            return ResponseEntity.status(400).body("Login to set location");
        }

        String response = userService.setLocation(user, latitude, longitude);
        userRepository.saveAndFlush(user);

        User updatedUser = userRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("User not found after update"));
        request.getSession().invalidate();
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("user", updatedUser);
        if(response != null) {
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.badRequest().body(null);
        }
    }
}
