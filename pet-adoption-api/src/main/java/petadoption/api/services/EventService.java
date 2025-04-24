package petadoption.api.services;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.EventDetailsDTO;
import petadoption.api.DTO.EventRequestDTO;
import petadoption.api.models.Event;
import petadoption.api.models.User;
import petadoption.api.repository.EventAttendeeRepository;
import petadoption.api.repository.EventRepository;
import petadoption.api.repository.UserRepository;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for handling Event CRUD operations and business logic.
 */
@Service
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(EventService.class);
    private final GCSStorageServiceEvents gcsStorageServiceEvents;
    private final EventAttendeeRepository eventAttendeeRepository;

    /**
     * Constructor for EventService.
     *
     * @param eventRepository         the repository for Event entities
     * @param userRepository          the repository for User entities
     * @param gcsStorageServiceEvents the Google Cloud Storage service for event images
     */
    public EventService(EventRepository eventRepository, UserRepository userRepository, GCSStorageServiceEvents gcsStorageServiceEvents, EventAttendeeRepository eventAttendeeRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.gcsStorageServiceEvents = gcsStorageServiceEvents;
        this.eventAttendeeRepository = eventAttendeeRepository;
    }

    /**
     * Creates a new Event with an uploaded image and saves it to the database.
     *
     * @param user           the adoption center user creating the event
     * @param adoptionCenterId the ID of the adoption center
     * @param title          the event title
     * @param description    the event description
     * @param startDate      the start date of the event
     * @param endDate        the end date of the event
     * @param file           the image file to upload
     * @return the created Event
     * @throws IOException if image upload fails
     */
    public Event createEventWithImage(User user, Long adoptionCenterId, String title, String description,
                                      LocalDate startDate, LocalDate endDate, MultipartFile file) throws IOException {
        String fileName = "event_photo_" + adoptionCenterId + "_" + UUID.randomUUID();
        String uploadedFileUrl = gcsStorageServiceEvents.uploadFile(file, fileName);

        Event event = new Event();
        event.setAdoptionCenter(user);
        event.setTitle(title);
        event.setDescription(description);
        event.setStartDate(startDate);
        event.setEndDate(endDate);
        event.setImage(uploadedFileUrl);

        return eventRepository.save(event);
    }

    /**
     * Creates a new Event with the provided event details.
     *
     * @param adoptionCenterId the ID of the adoption center
     * @param eventRequestDTO  the event details
     * @return true if event is created successfully, false otherwise
     */
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

    /**
     * Deletes an event by ID for the specified adoption center.
     *
     * @param eventId          the ID of the event to delete
     * @param adoptionCenterId the ID of the adoption center
     * @return true if the event was deleted, false otherwise
     */
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

    /**
     * Edits an existing event for the specified adoption center.
     *
     * @param adoptionCenterId the ID of the adoption center
     * @param eventId          the ID of the event to edit
     * @param eventRequestDTO  the new event details
     * @return true if event was updated, false otherwise
     */
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

    /**
     * Returns a list of all events.
     *
     * @return list of Event objects
     */
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    /**
     * Retrieves a single event by its ID.
     *
     * @param eventId the ID of the event
     * @return an Optional containing the Event, or empty if not found
     */
    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    /**
     * Retrieves all events for a specific adoption center.
     *
     * @param adoptionCenterId the ID of the adoption center
     * @return list of Event objects for that center
     */
    public List<Event> getEventsByAdoptionCenterId(Long adoptionCenterId) {
        return eventRepository.findByAdoptionCenterId(adoptionCenterId);
    }

    /**
     * Returns a list of events near the specified user, using their latitude/longitude.
     * The distance is defaulted to 100 miles.
     *
     * @param user the User to use for location reference
     * @return list of Event objects near the user
     */
    public List<Event> getNearbyEvents(User user) {
        return eventRepository.getNearbyEvents(user.getLatitude(), user.getLongitude(), 100);
    }

    public boolean isUserRegisteredForEvent(Long userId, Long eventId) {
        return eventAttendeeRepository.existsByIdUserIdAndIdEventId(userId, eventId);
    }

    /**
     * Registers a user as an attendee to the specified event.
     * If the user is already registered, nothing is changed.
     *
     * @param user    the User to register for the event
     * @param eventId the ID of the event
     * @return true if registration was successful, false if already registered or event not found
     */
    @Transactional
    public boolean registerUserToEvent(User user, Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) return false;

        Event event = eventOpt.get();

        if (event.getAttendees() == null) {
            event.setAttendees(new HashSet<>());
        }

        if (!event.getAttendees().contains(user)) {
            event.getAttendees().add(user);
            eventRepository.save(event);
            return true;
        }

        return false;
    }
}
