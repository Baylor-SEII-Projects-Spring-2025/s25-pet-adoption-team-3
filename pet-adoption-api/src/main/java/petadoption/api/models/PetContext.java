package petadoption.api.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetContext {
    private Long id;
    private String name;
    private String breed;
    private int age;
    private String gender;
    private String image;
}
