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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/event")
public class EventController {
    private final EventService eventService;
    private final GCSStorageServiceEvents gcsStorageServiceEvents;
    private final EventRepository eventRepository;

    public EventController(EventService eventService, EventRepository eventRepository) {
        this.eventService = eventService;
        this.gcsStorageServiceEvents = new GCSStorageServiceEvents();
        this.eventRepository = eventRepository;
    }

    @PostMapping("/{eventId}/uploadEventPhoto")
    public ResponseEntity<Event> uploadEventPhoto(@PathVariable Long eventId, @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        if (eventOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            String fileName = "event_photo_" + eventId + "_" + UUID.randomUUID();
            String uploadFileUrl = gcsStorageServiceEvents.uploadFile(file, fileName);

            Event event = eventOptional.get();
            event.setImage(uploadFileUrl);

            eventRepository.saveAndFlush(event);

            Event updatedEvent = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found after update"));

            System.out.println("Pet AFTER UPLOAD: " + updatedEvent.getImage());

            return ResponseEntity.ok(updatedEvent);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
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
