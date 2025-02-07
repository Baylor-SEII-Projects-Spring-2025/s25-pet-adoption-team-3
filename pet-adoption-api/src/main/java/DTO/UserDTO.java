package DTO;

import lombok.Getter;
import lombok.Setter;
import petadoption.api.models.User;

import javax.management.relation.Role;

@Getter
@Setter
public class UserDTO {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private User.Role role; // ADOPTER or ADOPTION_CENTER
}
