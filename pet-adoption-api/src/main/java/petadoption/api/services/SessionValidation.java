package petadoption.api.services;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import petadoption.api.models.User;

/**
 * Service class responsible for validating user session and role authorization.
 * Used to restrict certain API endpoints to users with specific roles (e.g., ADOPTER, ADOPTION_CENTER).
 */
@Service
public class SessionValidation{

    /**
     * Validates that the session contains an authenticated user and that the user has the required role.
     *
     * @param session      The current HTTP session, expected to have a "user" attribute.
     * @param requiredRole The role required to access the resource (e.g., User.Role.ADOPTER).
     * @return             ResponseEntity containing the user (if valid), or an error with the appropriate HTTP status.
     *                     - 401 Unauthorized if not logged in.
     *                     - 403 Forbidden if the user does not have the required role.
     *                     - 200 OK with the User object if validation succeeds.
     */
    public ResponseEntity<?> validateSession(HttpSession session, User.Role requiredRole) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session.");
        }
        if (user.getRole() != requiredRole) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized action.");
        }
        return ResponseEntity.ok(user);
    }
}
