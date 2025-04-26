package petadoption.api.DTO;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.models.User;

/**
 * Data Transfer Object (DTO) for representing Adoption Center registration and profile data.
 * <p>
 * This DTO is used to transfer data between client and server
 * for adoption center registration, profile updates, and related operations.
 * </p>
 */
@Getter
@Setter
public class AdoptionCenterDTO {
    private String email;
    private String password;
    private String profilePhoto;
    private String adoptionCenterName;
    private String bio;
    private String phoneNumber;
    private String website;
    private String address;
    private User.Role role;
}
