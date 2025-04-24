package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.models.EventAttendee;
import petadoption.api.models.EventAttendeeId;

@Repository
public interface EventAttendeeRepository extends JpaRepository<EventAttendee, EventAttendeeId> {
    boolean existsByIdUserIdAndIdEventId(Long userId, Long eventId);
}

