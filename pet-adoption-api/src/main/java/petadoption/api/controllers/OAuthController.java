package petadoption.api.controllers;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import petadoption.api.models.User;
import petadoption.api.repository.UserRepository;

/**
 * REST controller for OAuth2 authentication API endpoints.
 * Handles Google OAuth login success, session creation, and user registration.
 */
@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/oauth")
public class OAuthController {

    @Value("${frontend.url}")
    private String frontendUrl;

    private final UserRepository userRepository;

    public OAuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Handles Google OAuth2 login success, registers new users if necessary,
     * sets up Spring Security context and session, and redirects to the frontend profile page.
     *
     * @param token    OAuth2AuthenticationToken containing user authentication details
     * @param response HTTP servlet response for redirecting the user
     * @param request  HTTP servlet request for session management
     * @throws IOException if an error occurs during redirection
     */
    @GetMapping("/google/success")
    @Transactional
    public void googleLoginSuccess(OAuth2AuthenticationToken token, HttpServletResponse response, HttpServletRequest request) throws IOException {

        if (token == null) {
            response.sendRedirect(frontendUrl + "/login?error=true");
            return;
        }

        Map<String, Object> attributes = token.getPrincipal().getAttributes();
        String email = (String) attributes.get("email");
        String firstName = (String) attributes.get("given_name");
        String lastName = (String) attributes.get("family_name");
        String photo = (String) attributes.get("picture");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole(User.Role.ADOPTER);
            user.setEmailVerified(true);
            user.setPassword(UUID.randomUUID().toString());
            user.setProfilePhoto(photo);
            userRepository.save(user);
        }

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(token);
        SecurityContextHolder.setContext(securityContext);

        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
        session.setAttribute("user", user);

        request.getSession().setAttribute("user", user);
        response.sendRedirect(frontendUrl + "/profile");
    }

}
