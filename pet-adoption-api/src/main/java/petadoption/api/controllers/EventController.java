package petadoption.api.controllers;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.EventRequestDTO;
import petadoption.api.models.Event;
import petadoption.api.models.Event;
import petadoption.api.models.User;
import petadoption.api.repository.EventRepository;
import petadoption.api.services.EventService;
import petadoption.api.repository.EventRepository;
import petadoption.api.services.GCSStorageServiceEvents;
import petadoption.api.services.SessionValidation;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/event")
public class EventController {
    private final EventService eventService;
    private final GCSStorageServiceEvents gcsStorageServiceEvents;
    private final SessionValidation sessionValidation;
    private final EventRepository eventRepository;

    public EventController(EventService eventService, SessionValidation sessionValidation, EventRepository eventRepository, GCSStorageServiceEvents gcsStorageServiceEvents) {
        this.eventService = eventService;
        this.gcsStorageServiceEvents = new GCSStorageServiceEvents();
        this.sessionValidation = sessionValidation;
        this.eventRepository = eventRepository;
    }

    @PostMapping("/create-event-with-image/{adoptionCenterId}")
    public ResponseEntity<Event> createEventWithImage(
            HttpSession session,
            @PathVariable Long adoptionCenterId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam("files") MultipartFile files) {

        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body(null);
        }
        User user = (User) validationResponse.getBody();

        ResponseEntity<Event> eventResponse = eventService.createEventWithImage(
                user, adoptionCenterId, title, description, startDate, endDate, files);

        return eventResponse;
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

    @GetMapping("/get-all-events")
    public ResponseEntity<?> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/get-event/{eventId}")
    public ResponseEntity<?> getEventById(@PathVariable Long eventId) {
        Optional<Event> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isEmpty()) {
            return ResponseEntity.ok("Event not found.");
        }

        return ResponseEntity.ok(eventOptional.get());
    }
}
