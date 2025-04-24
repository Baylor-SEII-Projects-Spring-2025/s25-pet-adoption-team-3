package petadoption.api.models;

import jakarta.persistence.*;

@Entity
@Table(name = "event_attendees")
public class EventAttendee {

    @EmbeddedId
    private EventAttendeeId id;

    public EventAttendee() {}

    public EventAttendee(EventAttendeeId id) {
        this.id = id;
    }

    public EventAttendeeId getId() {
        return id;
    }

    public void setId(EventAttendeeId id) {
        this.id = id;
    }
}
