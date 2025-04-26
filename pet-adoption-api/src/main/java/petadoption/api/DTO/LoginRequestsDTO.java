package petadoption.api.DTO;
import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object (DTO) for login requests.
 * <p>
 * This DTO is used to encapsulate the user's login credentials (email and password)
 * when making authentication requests to the API.
 * </p>
 */
@Getter
@Setter
public class LoginRequestsDTO {
    private String email;
    private String password;

}
