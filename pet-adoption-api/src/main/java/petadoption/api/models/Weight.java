package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Weight {

    @Id
    @Column(name = "weight_id")
    private Long id;

    private Integer weight;

    @OneToOne
    private Characteristic characteristic;
}
