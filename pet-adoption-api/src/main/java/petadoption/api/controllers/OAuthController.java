package petadoption.api.controllers;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;

@RestController
@RequestMapping("/oauth")
public class OAuthController {

    @Value("${frontend.url}")
    private String frontendUrl;

    private final UserRepository userRepository;

    public OAuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/google/success")
    @Transactional
    public void googleLoginSuccess(OAuth2AuthenticationToken token, HttpServletResponse response, HttpServletRequest request) throws IOException {
        System.out.println("✅ OAuth Success Route Hit!");

        if (token == null) {
            response.sendRedirect("http://localhost:3000/login?error=true");
            return;
        }

        Map<String, Object> attributes = token.getPrincipal().getAttributes();
        String email = (String) attributes.get("email");
        String firstName = (String) attributes.get("given_name");
        String lastName = (String) attributes.get("family_name");
        String photo = (String) attributes.get("picture");

        // Check if the user exists, otherwise create a new one
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole(User.Role.ADOPTER);
            user.setEmailVerified(true);
            user.setPassword(UUID.randomUUID().toString()); // Assign a random password
            user.setProfilePhoto(photo);
            System.out.println("OAUTH: NEW USER CREATED: " + user.getEmail() + " " + user.getFirstName() + " " + user.getLastName() + " " + user.getRole() + " " + user.isEmailVerified() + " " + user.getPassword() + " " + user.getProfilePhoto());
            userRepository.save(user);
            System.out.println("OAUTH: NEW USER CREATED: " + user.getEmail());
        }

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(token);
        SecurityContextHolder.setContext(securityContext);

        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
        session.setAttribute("user", user);

        // ✅ Set user authentication manually in session
        request.getSession().setAttribute("user", user);
        System.out.println("Session set for: " + user.getEmail());

        System.out.println("Frontend url: " + frontendUrl);
        // Redirect to frontend dashboard
        response.sendRedirect(frontendUrl + "/profile");
    }

}
