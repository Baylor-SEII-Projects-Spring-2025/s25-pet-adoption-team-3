package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(
    name = "weight",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "characteristic_id"})
    }
)
public class Weight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weight_id")
    private Long id;

    private Integer weight;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "characteristic_id")
    private Characteristic characteristic;
}
