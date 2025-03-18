package petadoption.api.controllers;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.DTO.EventRequestDTO;
import petadoption.api.models.User;
import petadoption.api.services.EventService;

@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/event")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping("/create-event/{adoptionCenterId}")
    public ResponseEntity<String> createEvent(HttpSession session, @PathVariable Long adoptionCenterId, @RequestBody @Valid EventRequestDTO eventRequestDTO) {

        User user = (User) session.getAttribute("user");

        if(user == null) {
            return ResponseEntity.status(401).body("No active session.");
        }
        if (user.getRole() != User.Role.ADOPTION_CENTER) {
            return ResponseEntity.status(403).body("Unauthorized action.");
        }

        boolean created = eventService.createEvent(adoptionCenterId, eventRequestDTO);
        if (created) {
            return ResponseEntity.status(201).body("Event created successfully.");
        } else {
            return ResponseEntity.status(400).body("Invalid adoption center ID.");
        }
    }

    @DeleteMapping("/delete-event")
    public ResponseEntity<String> deleteEvent(HttpSession session, @RequestParam Long eventId, @RequestParam Long adoptionCenterId) {
        User user = (User) session.getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(401).body("No active session.");
        }
        if (user.getRole() != User.Role.ADOPTION_CENTER) {
            return ResponseEntity.status(403).body("Unauthorized action.");
        }

        boolean deleted = eventService.deleteEvent(eventId, adoptionCenterId);
        if (deleted) {
            return ResponseEntity.ok("Event deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Event not found or unauthorized.");
        }
    }

    @PutMapping("/edit-event")
    public ResponseEntity<String> editEvent(HttpSession session, @RequestParam Long adoptionCenterID,
                                            @RequestParam Long eventID,
                                            @RequestBody @Valid EventRequestDTO eventRequestDTO) {

        User user = (User) session.getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(401).body("No active session.");
        }
        if (user.getRole() != User.Role.ADOPTION_CENTER) {
            return ResponseEntity.status(403).body("Unauthorized action.");
        }
        boolean updated = eventService.editEvent(adoptionCenterID, eventID, eventRequestDTO);
        if (updated) {
            return ResponseEntity.ok("Event edited successfully.");
        }
        else {
            return ResponseEntity.status(404).body("Event not found or unauthorized.");
        }
    }
}
