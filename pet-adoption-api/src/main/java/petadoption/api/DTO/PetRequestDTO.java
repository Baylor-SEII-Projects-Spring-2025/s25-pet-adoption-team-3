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
     * Data Transfer Object (DTO) for creating or updating a pet's information.
     * <p>
     * This DTO is used to send or receive pet details between the frontend and backend API
     * when performing operations such as adding or editing a pet profile.
     * </p>
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
     * The birthdate of the pet.
     */
    @NotNull
    private String aboutMe;

    /**
     * The birthdate of the pet.
     */
    @NotNull
    private String extra1;

    /**
     * The birthdate of the pet.
     */
    @NotNull
    private String extra2;

    /**
     * The birthdate of the pet.
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
     * Current adoption availability status of the pet (e.g., AVAILABLE, ARCHIVED).
     */
    public PetRequestDTO() {}

    /**
     * Current adoption availability status of the pet (e.g., AVAILABLE, ARCHIVED).
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
