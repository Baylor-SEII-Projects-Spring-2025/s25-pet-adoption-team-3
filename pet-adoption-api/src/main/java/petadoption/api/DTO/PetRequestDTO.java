package petadoption.api.DTO;

import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import petadoption.api.models.Characteristic;
import petadoption.api.models.Pet;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

    public PetRequestDTO() {}

    public PetRequestDTO(Pet pet) {
        this.name = pet.getName();
        this.breed = pet.getBreed();
        this.spayedStatus = pet.getSpayedStatus();
        this.birthdate = pet.getBirthdate();
        this.aboutMe = pet.getAboutMe();
        this.extra1 = pet.getExtra1();
        this.extra2 = pet.getExtra2();
        this.extra3 = pet.getExtra3();
        this.characteristics = new ArrayList<>();
        this.availabilityStatus = pet.getAvailabilityStatus();
    }
}
