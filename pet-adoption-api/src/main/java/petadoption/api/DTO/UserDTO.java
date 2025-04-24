package petadoption.api.DTO;

import lombok.Getter;
import lombok.Setter;
import petadoption.api.models.User;

/**
 * Data Transfer Object (DTO) for user-related data exchange between API layers and clients.
 * <p>
 * This DTO abstracts sensitive details from the User entity while exposing only necessary
 * properties for authentication, profile, and adoption center operations.
 * </p>
 */
@Getter
@Setter
public class UserDTO {
    private String email;
    private Long id;
    private String firstName;
    private String lastName;
    private String password;
    private User.Role role;
    private String profilePhoto;
    private String website;
    private String bio;
    private String adoptionCenterName;
    private boolean isEmailVerified = false;
    private String address;
    private String phoneNumber;


    /**
     * Default constructor.
     */
    public UserDTO(){

    }

    /**
     * Constructs a UserDTO from a {@link User} entity.
     *
     * @param user The User entity from which to populate the DTO fields.
     */
    public UserDTO(User user) {
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();;
        this.role = user.getRole();
        this.profilePhoto = user.getProfilePhoto();
        this.website = user.getWebsite();
        this.bio = user.getBio();
        this.adoptionCenterName = user.getAdoptionCenterName();
        this.isEmailVerified = user.isEmailVerified();
        this.id = user.getId();
        this.address = user.getAddress();
        this.phoneNumber = user.getPhoneNumber();
    }
}
