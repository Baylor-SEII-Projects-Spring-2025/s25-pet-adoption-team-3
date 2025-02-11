package petadoption.api.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import petadoption.api.DTO.LoginRequestsDTO;
import petadoption.api.DTO.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import petadoption.api.models.User;
import petadoption.api.services.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final UserService userService;

    public AuthenticationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        userService.registerUser(userDTO);
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(
            @RequestBody LoginRequestsDTO loginRequest, HttpServletRequest request) {

        User user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

        HttpSession session = request.getSession();
        session.setAttribute("user", user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("user", user.getFirstName());

        return ResponseEntity.ok(response);
    }


    // Check if user has an active session
    @GetMapping("/session")
    public ResponseEntity<?> getSession(HttpSession session) {
        User user = (User) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(401).body("No active session");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if(session == null){
            return ResponseEntity.ok("User is already logged out");
        }
        session.invalidate();
        return ResponseEntity.ok("Logout successful");
    }
}
