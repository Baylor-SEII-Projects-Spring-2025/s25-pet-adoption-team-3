package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.util.Date;

/**
 * Entity representing a record of a pet that was recommended to a user in the past.
 * <p>
 * Used to track which pets were recommended to which users and when,
 * supporting features like recommendation history and filtering out already-seen pets.
 * </p>
 */
@Entity
@Getter
@Setter
@Table(name = "user_past_recommendations")
public class PetRecommendation {
    /**
     * The unique identifier for this recommendation entry.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pastrec_id")
    private Long id;

    /**
     * The date when this recommendation was made.
     */
    @Column(name = "date")
    private Date date;

    /**
     * The user to whom the pet was recommended.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * The pet that was recommended to the user.
     */
    @ManyToOne()
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
}