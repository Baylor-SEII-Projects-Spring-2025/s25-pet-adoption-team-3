package petadoption.api.controllers;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;

@RestController
@RequestMapping("/oauth")
public class OAuthController {

    private final UserRepository userRepository;

    public OAuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/google/success")
    @Transactional
    public void googleLoginSuccess(OAuth2AuthenticationToken token, HttpServletResponse response) throws IOException {
        System.out.println("✅ OAuth Success Route Hit!");
        if (token == null) {
            response.sendRedirect("http://localhost:3000/login?error=true");
            return;
        }

        Map<String, Object> attributes = token.getPrincipal().getAttributes();
        String email = (String) attributes.get("email");
        String firstName = (String) attributes.get("given_name");
        String lastName = (String) attributes.get("family_name");

        // (Optional) Store user in DB if they don't exist
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole(User.Role.ADOPTER);
            user.setPassword(UUID.randomUUID().toString());
            userRepository.save(user);
            System.out.println("OAUTH: NEW USER FOR OAUTH: " + user.getEmail());
        }

        // Redirect to frontend
        response.sendRedirect("http://localhost:3000/dashboard");
    }

}
