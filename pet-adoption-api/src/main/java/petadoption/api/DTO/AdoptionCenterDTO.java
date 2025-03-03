package petadoption.api.DTO;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.models.User;

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
    private User.Role role;
}
