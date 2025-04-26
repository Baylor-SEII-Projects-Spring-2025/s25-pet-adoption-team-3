package petadoption.api.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

/**
 * Data Transfer Object (DTO) for creating or updating an adoption event.
 * <p>
 * This DTO is used to carry event creation or update data from the client to the backend API.
 * All fields are required for a valid event submission.
 * </p>
 */
@Data
public class EventRequestDTO {
    /**
     * The image URL or path associated with the event.
     * This is typically a poster or promotional image.
     */
    @NotNull
    private String image;

    /**
     * The title of the event.
     */
    @NotNull
    private String title;

    /**
     * The full description of the event, providing more context or details.
     */
    @NotNull
    private String description;

    /**
     * The full description of the event, providing more context or details.
     */
    @NotNull
    private LocalDate startDate;

    /**
     * The end date of the event.
     */
    @NotNull
    private LocalDate endDate;
}
