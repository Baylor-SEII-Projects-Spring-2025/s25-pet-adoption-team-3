package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

/**
 * Entity representing an adoption-related event in the pet adoption system.
 * <p>
 * Events are hosted by adoption centers and can be attended by multiple users (adopters).
 * This entity tracks all essential details for displaying and managing adoption events.
 * </p>
 */
@Entity
@Getter
@Setter
public class Event {

    /**
     * Unique identifier for this event.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The adoption center (user with ADOPTION_CENTER role) that created/hosts this event.
     */
    @ManyToOne
    @JoinColumn(name = "adoption_center_id", nullable = false)
    private User adoptionCenter;

    /**
     * URL or identifier for the image representing the event.
     * This image is typically used as a banner or thumbnail for the event display.
     */
    @Column(nullable = false)
    private String image;

    /**
     * The title or name of the event.
     */
    @Column(nullable = false)
    private String title;

    /**
     * A detailed description of the event.
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    /**
     * The start date of the event.
     */
    @Column(nullable = false)
    private LocalDate startDate;

    /**
     * The end date of the event.
     */
    @Column(nullable = false)
    private LocalDate endDate;

    /**
     * Set of users attending this event.
     * <p>
     * Managed through a join table named 'event_attendees' that connects users and events.
     * </p>
     */
    @ManyToMany
    @JoinTable(
            name = "event_attendees",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> attendees;

}
