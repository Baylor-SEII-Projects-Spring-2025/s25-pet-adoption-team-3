package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Characteristic {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "characteristic_id")
    private Long id;

    private String name;
}
