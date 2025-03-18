package petadoption.api.DTO;

import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;
import java.util.List;

@Data
public class PetRequestDTO {
    @NotNull
    private List<String> images;

    @NotNull
    private String name;

    @NotNull
    private String breed;

    @NotNull
    private String status;

    @NotNull
    private LocalDate birthdate;

    @NotNull
    private String aboutMe;

    @NotNull
    private String extra1;
    @NotNull
    private String extra2;
    @NotNull
    private String extra3;
}
