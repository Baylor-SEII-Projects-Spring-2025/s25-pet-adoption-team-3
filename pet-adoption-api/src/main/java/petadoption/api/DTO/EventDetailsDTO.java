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
 * Constructs an {@code EventDetailsDTO} from an {@link Event} entity.
 *
 * @param event the {@link Event} entity to extract details from
 */
@Data
public class EventDetailsDTO {
    @GeneratedValue
    @Column(name = "event_id")
    private Long id;

    @NotNull
    private String adoptionCenter;

    @NotNull
    private String image;

    @NotNull
    private String title;

    @NotNull
    private String description;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotNull
    private boolean registered;

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
