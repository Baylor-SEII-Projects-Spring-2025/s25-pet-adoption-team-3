package petadoption.api.models;

import lombok.Getter;
import lombok.Setter;


/**
 * Data structure representing a summary context about a pet.
 * <p>
 * Used for lightweight data transfer, such as embedding pet context
 * within chat messages or notifications.
 * </p>
 */
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
