package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing a weight/preference value for a specific characteristic assigned to a user.
 * <p>
 * Each record links a user to a characteristic with a specific weight value, used for
 * recommendations or user preferences in the pet adoption system.
 * </p>
 * <p>
 * The combination of user and characteristic is unique for each record.
 * </p>
 */
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

    /**
     * Unique identifier for the weight record.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weight_id")
    private Long id;

    private Integer weight;

    /**
     * The user to whom this weight record belongs.
     */
    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * The characteristic associated with this weight.
     */
    @ManyToOne
    @JoinColumn(name = "characteristic_id")
    private Characteristic characteristic;
}
