package petadoption.api.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import petadoption.api.DTO.EventRequestDTO;
import petadoption.api.models.Event;
import petadoption.api.models.User;
import petadoption.api.repository.EventRepository;
import petadoption.api.repository.UserRepository;

import java.util.Optional;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
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
}
