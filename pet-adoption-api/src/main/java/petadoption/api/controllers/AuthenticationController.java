package petadoption.api.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import petadoption.api.DTO.LoginRequestsDTO;
import petadoption.api.DTO.UserDTO;
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
import petadoption.api.models.User;
import petadoption.api.services.UserService;

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
            @RequestBody LoginRequestsDTO loginRequest, HttpServletRequest request, HttpServletResponse response) {

        User user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

        Cookie passwordCookie = new Cookie("password", null);
        passwordCookie.setPath("/");
        passwordCookie.setMaxAge(0);
        response.addCookie(passwordCookie);

        Cookie usernameCookie = new Cookie("username", user.getEmail());
        Cookie userIdCookie = new Cookie("userId", user.getId().toString());

        usernameCookie.setPath("/");
        userIdCookie.setPath("/");

        usernameCookie.setMaxAge(-1);
        userIdCookie.setMaxAge(-1);

        response.addCookie(usernameCookie);
        response.addCookie(userIdCookie);

        return ResponseEntity.ok("Login successful: " + user.getFirstName());

       // HttpSession session = request.getSession();
        //session.setAttribute("user", user);

       // Map<String, Object> response = new HashMap<>();
        //response.put("message", "Login successful");
        //response.put("user", user.getFirstName());

        //return ResponseEntity.ok(response);
    }

    // Check if user has an active session
    @GetMapping("/session")
    public ResponseEntity<?> getSession(HttpSession session) {
        User user = (User) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(401).body("No active session");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", user.getFirstName());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpServletResponse response) {
        Cookie usernameCookie = new Cookie("username",null);
        Cookie userIdCookie = new Cookie("userId", null);
        Cookie passwordCookie = new Cookie("password", null);

        usernameCookie.setPath("/");
        userIdCookie.setPath("/");
        passwordCookie.setPath("/");


        usernameCookie.setMaxAge(0);
        userIdCookie.setMaxAge(0);
        passwordCookie.setMaxAge(0);


        response.addCookie(usernameCookie);
        response.addCookie(userIdCookie);
        response.addCookie(passwordCookie);


        return ResponseEntity.ok("Logout successful.");
    }
}
