package petadoption.api.DTO;

import petadoption.api.models.Pet;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object (DTO) representing detailed information about a Pet.
 * <p>
 * This immutable record is used to transfer comprehensive pet details between layers
 * of the application (such as from backend to frontend or in API responses).
 * <p>
 */
public record PetDetailDTO(
        Long id,
        List<String> image,
        String name,
        String breed,
        String spayedStatus,
        LocalDate birthdate,
        String aboutMe,
        String extra1,
        String extra2,
        String extra3,
        Pet.PetStatus availabilityStatus
) {}
