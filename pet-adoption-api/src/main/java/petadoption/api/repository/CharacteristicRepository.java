package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Characteristic;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for accessing {@link Characteristic} entities from the database.
 * <p>
 * This interface provides custom query methods for finding characteristics by name
 * and retrieving all characteristics, in addition to the standard JPA methods.
 * </p>
 */
@Repository
public interface CharacteristicRepository extends JpaRepository<Characteristic, Long> {

    /**
     * Retrieves all characteristics stored in the database.
     *
     * @return a list of all {@link Characteristic} entities
     */
    @Query("SELECT c FROM Characteristic c")
    List<Characteristic> getAll();

    /**
     * Finds a characteristic by its name.
     *
     * @param name the name of the characteristic to find
     * @return an {@link Optional} containing the {@link Characteristic} if found, or empty otherwise
     */
    @Query("SELECT c FROM Characteristic c WHERE c.name = :name")
    Optional<Characteristic> findByName(@Param("name") String name);
}
