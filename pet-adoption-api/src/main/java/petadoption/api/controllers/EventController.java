package petadoption.api.controllers;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import petadoption.api.DTO.EventRequestDTO;
import petadoption.api.models.User;
import petadoption.api.models.Event;
import petadoption.api.services.EventService;
import petadoption.api.repository.EventRepository;
import petadoption.api.services.GCSStorageServiceEvents;
import petadoption.api.services.SessionValidation;

@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/event")
public class EventController {
    private final EventService eventService;
    private final GCSStorageServiceEvents gcsStorageServiceEvents;
    private final SessionValidation sessionValidation;

    public EventController(EventService eventService, SessionValidation sessionValidation) {
        this.eventService = eventService;
        this.gcsStorageServiceEvents = new GCSStorageServiceEvents();
        this.sessionValidation = sessionValidation;
    }

    @PostMapping("/create-event/{adoptionCenterId}")
    public ResponseEntity<String> createEvent(HttpSession session, @PathVariable Long adoptionCenterId, @RequestBody @Valid EventRequestDTO eventRequestDTO) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }

        boolean created = eventService.createEvent(adoptionCenterId, eventRequestDTO);
        return created ? ResponseEntity.status(201).body("Event created successfully.") : ResponseEntity.status(400).body("Invalid adoption center ID.");
    }

    @DeleteMapping("/delete-event")
    public ResponseEntity<String> deleteEvent(HttpSession session, @RequestParam Long eventId, @RequestParam Long adoptionCenterId) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }

        boolean deleted = eventService.deleteEvent(eventId, adoptionCenterId);
        return deleted ? ResponseEntity.ok("Event deleted successfully.") : ResponseEntity.status(404).body("Event not found or unauthorized.");
    }

    @PutMapping("/edit-event")
    public ResponseEntity<String> editEvent(HttpSession session, @RequestParam Long adoptionCenterID,
                                            @RequestParam Long eventID,
                                            @RequestBody @Valid EventRequestDTO eventRequestDTO) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }

        boolean updated = eventService.editEvent(adoptionCenterID, eventID, eventRequestDTO);
        return updated ? ResponseEntity.ok("Event edited successfully.") : ResponseEntity.status(404).body("Event not found or unauthorized.");
    }
}
