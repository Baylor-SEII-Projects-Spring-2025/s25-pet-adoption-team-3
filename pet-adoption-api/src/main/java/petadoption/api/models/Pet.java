package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

/**
 * Entity representing a pet available for adoption within the system.
 * <p>
 * Each Pet has an associated adoption center, a list of images, a breed, and other
 * relevant information for display and management in the adoption platform.
 * </p>
 */
@Entity
@Getter
@Setter
public class Pet {

    /** Unique identifier for the pet. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * List of image URLs representing this pet.
     * Stored as a separate collection table (pet_images).
     */
    @CollectionTable(name = "pet_images", joinColumns = @JoinColumn(name = "pet_id"))
    @Column(name = "image_url", nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    @ElementCollection
    private List<String> image;

    /** The pet's name. */
    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String name;

    /**
     * The adoption center responsible for this pet.
     * This is a reference to a User with ADOPTION_CENTER role.
     */
    @ManyToOne
    @JoinColumn(name = "adoption_center_id", nullable = false)
    private User adoptionCenter;

    /** The breed of the pet. */
    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String breed;

    /**
     * Spayed/neutered status of the pet.
     * Example values: "Spayed Female", "Unspayed Female", etc.
     */
    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String spayedStatus; //"Spayed Female", "Unspayed Female", etc.

    /** The birthdate of the pet. */
    @Column(nullable = false, columnDefinition="date default '9999-12-30'")
    private LocalDate birthdate;

    /** Free-text description or biography about the pet. */
    @Column(columnDefinition = "TEXT")
    private String aboutMe;

    /** Fun fact or preference #1 (customizable field). */
    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String extra1;

    /** Fun fact or preference #2 (customizable field). */
    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String extra2;

    /** Fun fact or preference #3 (customizable field). */
    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String extra3;

    /**
     * The current availability status of the pet for adoption.
     * Values: AVAILABLE, ARCHIVED.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition="enum('AVAILABLE','ARCHIVED') default 'AVAILABLE'")
    private PetStatus availabilityStatus;

    /**
     * List of characteristics associated with this pet (e.g., "playful", "good with kids").
     * Many-to-many relationship.
     */
    @ManyToMany
    private List<Characteristic> petCharacteristics;

    /**
     * Reference to the user who adopted this pet, if any.
     * If null, pet is still available.
     */
    @ManyToOne
    @JoinColumn(name = "adopter_id")
    private User adopter;

    /**
     * Enumeration representing possible pet adoption statuses.
     */
    public enum PetStatus {
        AVAILABLE,
        ARCHIVED
    }
}