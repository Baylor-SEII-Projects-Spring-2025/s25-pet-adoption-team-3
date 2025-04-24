package petadoption.api.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import petadoption.api.models.Event;
import petadoption.api.models.User;

import java.time.LocalDate;

/**
 * Data Transfer Object (DTO) for representing detailed event information.
 * <p>
 * This DTO is used to transfer event details between client and server,
 * especially for displaying or managing adoption events.
 * </p>
 */
@Data
public class EventDetailsDTO {
    /**
     * Unique identifier of the event.
     */
    @GeneratedValue
    @Column(name = "event_id")
    private Long id;

    /**
     * The name of the adoption center hosting the event.
     */
    @NotNull
    private String adoptionCenter;

    /**
     * URL or identifier for the image associated with the event.
     */
    @NotNull
    private String image;

    /**
     * The title of the event.
     */
    @NotNull
    private String title;

    /**
     * The description or details about the event.
     */
    @NotNull
    private String description;

    /**
     * The start date of the event.
     */
    @NotNull
    private LocalDate startDate;

    /**
     * The end date of the event.
     */
    @NotNull
    private LocalDate endDate;

    @NotNull
    private boolean registered;

    /**
     * Constructs an {@code EventDetailsDTO} from an {@link Event} entity.
     *
     * @param event the {@link Event} entity to extract details from
     */
    public EventDetailsDTO(Event event) {
        this.id = event.getId();
        this.adoptionCenter = event.getAdoptionCenter().getAdoptionCenterName();
        this.image = event.getImage();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
    }
}
