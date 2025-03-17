package petadoption.api.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import petadoption.api.DTO.LoginRequestsDTO;
import petadoption.api.DTO.UserDTO;
import petadoption.api.models.User;
import petadoption.api.services.UserService;

@CrossOrigin(origins = {"http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000"})
@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final UserService userService;

    public AuthenticationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        return userService.registerUser(userDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody LoginRequestsDTO loginRequest, HttpServletRequest request) {

        ResponseEntity<?> authResponse = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

        if(!authResponse.getStatusCode().is2xxSuccessful()) {
            return authResponse;
        }

        User user = (User) authResponse.getBody();

        HttpSession session = request.getSession();
        System.out.println("Session ID: " + session.getId());
        session.setAttribute("user", user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("user", user.getFirstName());
        response.put("role", user.getRole());

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
