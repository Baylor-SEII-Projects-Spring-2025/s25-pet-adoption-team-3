package petadoption.api.services;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import petadoption.api.models.User;

@Service
public class SessionValidation{

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
