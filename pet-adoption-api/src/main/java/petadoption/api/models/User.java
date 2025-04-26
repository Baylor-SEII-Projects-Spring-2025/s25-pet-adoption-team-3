package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Entity representing a user in the pet adoption system.
 * <p>
 * Users may be either adopters or adoption centers.
 * Supports storing profile info, contact details, recommendations, liked pets, and location data.
 * </p>
 */
@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    /**
     * Unique identifier for the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    /**
     * The user's email address (must be unique).
     */
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /**
     * The user's hashed password.
     */
    @Column(name = "password", nullable = false)
    private String password;

    /**
     * The user's first name.
     */
    @Column(name = "first_name", nullable = true)
    private String firstName;

    /**
     * The user's last name.
     */
    @Column(name = "last_name", nullable = true)
    private String lastName;

    /**
     * The user's physical address.
     */
    @Column(name = "address", nullable = true)
    private String address;

    /**
     * The user's role in the system (ADOPTER or ADOPTION_CENTER).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    /**
     * Whether the user's email has been verified.
     */
    @Column(name = "is_Email_Verified", nullable = false)
    private boolean isEmailVerified = false;

    /**
     * URL of the user's profile photo.
     */
    @Column(name = "profile_photo", nullable = true)
    private String profilePhoto;

    /**
     * Name of the adoption center, if applicable.
     */
    @Column(name = "adoption_center_name", nullable = true)
    private String adoptionCenterName;

    /**
     * Bio or description for the user or adoption center.
     */
    @Column(name = "bio", columnDefinition = "TEXT", nullable = true)
    private String bio;

    /**
     * Phone number for the user or adoption center.
     */
    @Column(name = "phone_number", nullable = true)
    private String phoneNumber;

    /**
     * Website for the user or adoption center.
     */
    @Column(name = "website", nullable = true)
    private String website;

    /**
     * List of pet recommendations generated for the user.
     */
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private List<PetRecommendation> recommendedPets;

    /**
     * List of pets liked by the user (adopter).
     */
    @ManyToMany()
    @JoinTable(name = "user_id")
    private List<Pet> likedPets;

    /**
     * List of pets saved by the user.
     */
    @OneToMany(cascade = CascadeType.ALL)
    private List<Pet> savedPets;

    /**
     * Set of weights associated with the user (for recommendations/preferences).
     */
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "user")
    private Set<Weight> weights = new HashSet<>();

    /**
     * Latitude for the user's location.
     */
    @Column(name = "latitude", nullable = true)
    private Double latitude;

    /**
     * Longitude for the user's location.
     */
    @Column(name = "longitude", nullable = true)
    private Double longitude;

    /**
     * User role enumeration: ADOPTER or ADOPTION_CENTER.
     */
    public enum Role {
        ADOPTER,
        ADOPTION_CENTER
    }

}
