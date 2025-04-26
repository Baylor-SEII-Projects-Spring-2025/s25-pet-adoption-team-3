package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a unique characteristic that can be associated with a pet.
 * <p>
 * Examples of characteristics include "Playful", "House-trained", "Good with kids", etc.
 * </p>
 *
 * This entity is used to enable filtering and search features for pets in the adoption system.
 */
@Entity
@Getter
@Setter
public class Characteristic {
    /**
     * Unique identifier for the characteristic.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "characteristic_id")
    private Long id;

    private String name;

    /**
     * Compares this characteristic to another object for equality.
     * <p>
     * Characteristics are considered equal if they have the same unique identifier.
     * </p>
     *
     * @param obj The object to compare with.
     * @return {@code true} if the other object is a Characteristic with the same ID, {@code false} otherwise.
     */
    @Override
    public boolean equals(Object obj){
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Characteristic characteristic = (Characteristic) obj;
        return id.equals(characteristic.getId());
    }

    /**
     * Computes the hash code for this characteristic based on its ID.
     *
     * @return The hash code of the characteristic's ID.
     */
    @Override
    public int hashCode() {
        return id.hashCode();
    }

}