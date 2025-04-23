package petadoption.api.DTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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
        String extra3
) {}
