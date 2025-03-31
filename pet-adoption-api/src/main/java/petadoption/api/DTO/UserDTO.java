package petadoption.api.DTO;

import lombok.Getter;
import lombok.Setter;
import petadoption.api.models.User;

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



    public UserDTO(){

    }

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
    }
}
