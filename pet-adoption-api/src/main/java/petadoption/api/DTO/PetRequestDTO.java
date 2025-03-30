package petadoption.api.DTO;

import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import petadoption.api.models.Characteristic;
import petadoption.api.models.Pet;

import java.time.LocalDate;

@Data
public class PetRequestDTO {
    @NotNull
    private String name;

    @NotNull
    private String breed;

    @NotNull
    private String spayedStatus;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
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
    private List<Characteristic> characteristics;

    @NotNull
    private Pet.PetStatus availabilityStatus;
}
