package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "first_name", nullable = true)
    private String firstName;

    @Column(name = "last_name", nullable = true)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "is_Email_Verified", nullable = false)
    private boolean isEmailVerified = false;

    @Column(name = "profile_photo", nullable = true)
    private String profilePhoto;

    @Column(name = "adoption_center_name", nullable = true)
    private String adoptionCenterName;

    @Column(name = "bio", columnDefinition = "TEXT", nullable = true)
    private String bio;

    @Column(name = "phone_number", nullable = true)
    private String phoneNumber;

    @Column(name = "website", nullable = true)
    private String website;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Pet> recommendedPets;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Pet> savedPets;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Weight> weights;

    public enum Role {
        ADOPTER,
        ADOPTION_CENTER
    }

}
