package petadoption.api.DTO;

import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import petadoption.api.models.Characteristic;
import petadoption.api.models.Pet;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object (DTO) for creating or updating a pet's information.
 * <p>
 * This DTO is used to send or receive pet details between the frontend and backend API
 * when performing operations such as adding or editing a pet profile.
 * </p>
 */
@Data
public class PetRequestDTO {
    /**
     * The name of the pet.
     */
    @NotNull
    private String name;

    /**
     * The breed of the pet.
     */
    @NotNull
    private String breed;

    /**
     * The spay/neuter status of the pet (e.g., "Spayed", "Neutered", "Intact").
     */
    @NotNull
    private String spayedStatus;

    /**
     * The birthdate of the pet.
     */
    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate birthdate;

    /**
     * The main "About Me" description for the pet.
     */
    @NotNull
    private String aboutMe;

    /**
     * Extra fun fact #1 about the pet.
     */
    @NotNull
    private String extra1;

    /**
     * Extra fun fact #2 about the pet.
     */
    @NotNull
    private String extra2;

    /**
     * Extra fun fact #3 about the pet.
     */
    @NotNull
    private String extra3;

    /**
     * List of personality characteristics or tags for the pet.
     */
    @NotNull
    private List<Characteristic> characteristics;

    /**
     * Current adoption availability status of the pet (e.g., AVAILABLE, ARCHIVED).
     */
    @NotNull
    private Pet.PetStatus availabilityStatus;

    /**
     * Default constructor for PetRequestDTO.
     */
    public PetRequestDTO() {}

    /**
     * Constructs a PetRequestDTO using a Pet entity.
     * Useful for mapping entity data to a DTO for responses or updates.
     *
     * @param pet the Pet entity to extract data from
     */
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
