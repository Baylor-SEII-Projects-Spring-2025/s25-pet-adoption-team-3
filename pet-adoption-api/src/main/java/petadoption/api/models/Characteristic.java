package petadoption.api.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Characteristic {

    @Id
    @Column(name = "characteristic_id")
    private Long id;

    private String name;
}
