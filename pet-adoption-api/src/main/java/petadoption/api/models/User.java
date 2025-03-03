package petadoption.api.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

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

    public enum Role {
        ADOPTER,
        ADOPTION_CENTER
    }

}
