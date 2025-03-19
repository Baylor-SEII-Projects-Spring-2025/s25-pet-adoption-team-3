package petadoption.api.DTO;

import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;
import petadoption.api.models.Pet;

import java.time.LocalDate;
import java.util.List;

@Data
public class PetRequestDTO {
    @NotNull
    private String imageUrl; // Stores the image URLs

    @NotNull
    private String name;

    @NotNull
    private String breed;

    @NotNull
    private String spayedStatus;

    @NotNull
    private LocalDate birthdate;

    @NotNull
    private String aboutMe;

    @NotNull
    private String extra1;
    @NotNull
    private String extra2;
    @NotNull
    private String extra3;

    @NotNull
    private Pet.PetStatus availabilityStatus;
}
