package petadoption.api.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToMany;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.models.Characteristic;
import petadoption.api.models.Pet;
import petadoption.api.models.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object (DTO) representing a pet to be displayed on the swipe interface.
 * <p>
 * This DTO is used to send pet information to the frontend for display in swipe (Tinder-style)
 * interfaces. It contains summary data, images, and personality characteristics.
 * </p>
 */
@Data
public class SwipePetDTO {
    private Long id;
    private List<String> image;
    private String name;
    private String spayedStatus;

    private String birthdate;

    private String aboutMe;

    private String extra1;

    private String extra2;

    private String extra3;

    private Pet.PetStatus availabilityStatus;

    private String adoptionCenterName;

    private Long adoptionCenterId;

    private String location;

    private String breed;

    private List<String> characteristics;

    /**
     * Constructs a SwipePetDTO from a {@link Pet} entity.
     * Populates all swipe-viewable properties, including mapped characteristics.
     *
     * @param pet The Pet entity to use as the source for this DTO.
     */
    public SwipePetDTO(Pet pet) {
        this.id = pet.getId();
        this.name = pet.getName();
        this.spayedStatus = pet.getSpayedStatus();
        this.birthdate = pet.getBirthdate().toString();
        this.aboutMe = pet.getAboutMe();
        this.extra1 = pet.getExtra1();
        this.extra2 = pet.getExtra2();
        this.extra3 = pet.getExtra3();
        this.availabilityStatus = pet.getAvailabilityStatus();
        this.image = pet.getImage();
        this.adoptionCenterName = pet.getAdoptionCenter().getAdoptionCenterName();
        this.adoptionCenterId = pet.getAdoptionCenter().getId();
        this.location = "placeholder";
        this.breed = pet.getBreed();
        this.characteristics = new ArrayList<>();
        for(Characteristic ch : pet.getPetCharacteristics()){
            this.characteristics.add(ch.getName());
        }
    }

}
