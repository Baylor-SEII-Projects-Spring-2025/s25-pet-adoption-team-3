package petadoption.api.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import petadoption.api.DTO.LoginRequestsDTO;
import petadoption.api.DTO.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.models.User;
import petadoption.api.services.UserService;

import java.util.Optional;

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
    public ResponseEntity<String> loginUser(HttpServletResponse response, @RequestBody LoginRequestsDTO loginRequest) {
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
