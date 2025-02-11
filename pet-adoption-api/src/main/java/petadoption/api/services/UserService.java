package petadoption.api.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import petadoption.api.DTO.UserDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?>registerUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setRole(userDTO.getRole());

        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        user.setEmailVerified(false);
        user.setProfilePhoto(null);

        user = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User: " + user.getEmail() + " created successfully");
    }

    public ResponseEntity<?>authenticateUser(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");
        }
        User user = optionalUser.get();
        if(!user.isEmailVerified()){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Email not verified. Please verify your email before logging in.");
        }
        if(!passwordEncoder.matches(password, user.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Password");
        }
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }
}
