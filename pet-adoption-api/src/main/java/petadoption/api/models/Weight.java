package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Weight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weight_id")
    private Long id;

    private Integer weight;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "characterstic_characteristic_id", unique = true)
    private Characteristic characteristic;
}
