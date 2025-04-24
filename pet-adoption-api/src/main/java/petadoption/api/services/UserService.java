package petadoption.api.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import petadoption.api.DTO.UserDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.models.Token;
import petadoption.api.models.User;
import petadoption.api.repository.TokenRepository;
import petadoption.api.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService, TokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.tokenRepository = tokenRepository;
    }

    public ResponseEntity<?> registerUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("An account already exists with this email.");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setRole(User.Role.ADOPTER);

        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        user.setEmailVerified(false);
        user.setProfilePhoto(null);

        user = userRepository.save(user);
        emailService.sendVerificationEmail(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User: " + user.getEmail() + " created successfully");
    }

    public ResponseEntity<?> authenticateUser(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");
        }
        User user = optionalUser.get();
        if (!user.isEmailVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Email not verified. Please verify your email before logging in.");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Password");
        }
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    public ResponseEntity<String> forgotPasswordLink(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with this email does not exist.");
        }

        User user = optionalUser.get();
        emailService.sendPasswordResetEmail(user);

        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    public ResponseEntity<String> resetPassword(String token, String newPassword) {
        Optional<Token> originalToken = tokenRepository.findByTokenAndTokenType(token, Token.TokenType.PASSWORD_RESET);
        if (originalToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or Expired Token");
        }
        Token resetToken = originalToken.get();
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body("Token expired");
        }
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);
        return ResponseEntity.ok("Password reset successful.");

    }

    public ResponseEntity<String> resendVerificationEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found.");
        }

        User user = optionalUser.get();

        if (user.isEmailVerified()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already verified.");
        }

        Optional<Token> existingToken = tokenRepository.findByUserAndTokenType(user, Token.TokenType.EMAIL_VERIFICATION);
        existingToken.ifPresent(tokenRepository::delete);

        emailService.sendVerificationEmail(user);

        return ResponseEntity.ok("Verification email resent successfully.");
    }

    public User getUserFromId(Long id){
        return userRepository.findById(id).orElse(null);
    }

    public User setLocation(Long userId, Double latitude, Double longitude) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();
        user.setLatitude(latitude);
        user.setLongitude(longitude);

        return userRepository.save(user);
    }
}
