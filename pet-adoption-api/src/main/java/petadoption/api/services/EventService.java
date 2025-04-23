package petadoption.api.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.EventDetailsDTO;
import petadoption.api.DTO.EventRequestDTO;
import petadoption.api.models.Event;
import petadoption.api.models.User;
import petadoption.api.repository.EventRepository;
import petadoption.api.repository.UserRepository;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(EventService.class);
    private final GCSStorageServiceEvents gcsStorageServiceEvents;

    public EventService(EventRepository eventRepository, UserRepository userRepository, GCSStorageServiceEvents gcsStorageServiceEvents) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.gcsStorageServiceEvents = gcsStorageServiceEvents;
    }

    public ResponseEntity<Event> createEventWithImage(User user, Long adoptionCenterId, String title,
                                                      String description, LocalDate startDate, LocalDate endDate,
                                                      MultipartFile file) {
        try {
            String fileName = "event_photo_" + adoptionCenterId + "_" + UUID.randomUUID();
            String uploadedFileUrl = gcsStorageServiceEvents.uploadFile(file, fileName);

            Event event = new Event();
            event.setAdoptionCenter(user);
            event.setTitle(title);
            event.setDescription(description);
            event.setStartDate(startDate);
            event.setEndDate(endDate);
            event.setImage(uploadedFileUrl);

            eventRepository.save(event);

            return ResponseEntity.status(201).body(event);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    public boolean createEvent(Long adoptionCenterId, EventRequestDTO eventRequestDTO) {
        Optional<User> adoptionCenterOptional = userRepository.findById(adoptionCenterId);

        if(adoptionCenterOptional.isEmpty() || adoptionCenterOptional.get().getRole() != User.Role.ADOPTION_CENTER){
            logger.info("Invalid adoption center ID: {}", adoptionCenterId);
            return false;
        }

        User adoptionCenter = adoptionCenterOptional.get();

        Event event = new Event();
        event.setAdoptionCenter(adoptionCenter);
        event.setImage(eventRequestDTO.getImage());
        event.setTitle(eventRequestDTO.getTitle());
        event.setDescription(eventRequestDTO.getDescription());
        event.setStartDate(eventRequestDTO.getStartDate());
        event.setEndDate(eventRequestDTO.getEndDate());

        eventRepository.save(event);
        logger.info("Event created successfully for Adoption Center ID: {}", adoptionCenterId);
        return true;
    }

    public boolean deleteEvent(Long eventId, Long adoptionCenterId) {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        if(eventOptional.isEmpty()){
            logger.info("Event ID {} not found in database", eventId);
            return false;
        }

        Event event = eventOptional.get();

        if (!event.getAdoptionCenter().getId().equals(adoptionCenterId)) {
            logger.info("Adoption center ID mismatched. Expected: {}. but received: {}", event.getAdoptionCenter().getId(), adoptionCenterId);
            return false;
        }

        eventRepository.deleteById(eventId);
        logger.info("Event ID {} successfully deleted for Adoption Center ID: {}", eventId, adoptionCenterId);
        return true;
    }

    public boolean editEvent(Long adoptionCenterId, Long eventId, EventRequestDTO eventRequestDTO) {
        Optional<Event> eventOptional = eventRepository.findById(eventId);

        if(eventOptional.isEmpty()){
            logger.info("Event ID {} not found in database", eventId);
            return false;
        }
        Event event = eventOptional.get();

        if (!event.getAdoptionCenter().getId().equals(adoptionCenterId)) {
            logger.info("Adoption center ID mismatch. Expected: {}. but received: {}", event.getAdoptionCenter().getId(), adoptionCenterId);
            return false;
        }
        event.setImage(eventRequestDTO.getImage());
        event.setTitle(eventRequestDTO.getTitle());
        event.setDescription(eventRequestDTO.getDescription());
        event.setStartDate(eventRequestDTO.getStartDate());
        event.setEndDate(eventRequestDTO.getEndDate());

        eventRepository.save(event);
        logger.info("Event ID {} successfully updated.", eventId);
        return true;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    public List<Event> getEventsByAdoptionCenterId(Long adoptionCenterId) {
        return eventRepository.findByAdoptionCenterId(adoptionCenterId);
    }

    public List<Event> getNearbyEvents(User user) {
        // Default distance 100 miles
        return eventRepository.getNearbyEvents(user.getLatitude(), user.getLongitude(), 100);
    }
}
