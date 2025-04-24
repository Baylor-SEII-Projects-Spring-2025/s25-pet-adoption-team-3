package petadoption.api.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Pet;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for accessing and managing {@link Pet} entities.
 * <p>
 * Provides custom methods for finding, updating, and deleting pet data, including images
 * and adoption status, in addition to basic CRUD operations.
 * </p>
 */
@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    /**
     * Retrieves all pets belonging to a specific adoption center.
     *
     * @param adoptionCenterId The ID of the adoption center.
     * @return A list of {@link Pet} objects.
     */
    List<Pet> findByAdoptionCenterId(Long adoptionCenterId);

    /**
     * Finds a pet by its unique ID.
     *
     * @param petId The pet's ID.
     * @return An {@link Optional} containing the {@link Pet} if found, or empty otherwise.
     */
    @Query("SELECT p FROM Pet p WHERE p.id = :petId")
    Optional<Pet> findPetById(@Param("petId") Long petId);

    /**
     * Retrieves all pets with a given availability status.
     *
     * @param status The {@link Pet.PetStatus} to filter by (e.g., AVAILABLE, ARCHIVED).
     * @return A list of pets with the given status.
     */
    List<Pet> findByAvailabilityStatus(Pet.PetStatus status);

    /**
     * Deletes all images associated with a given pet by its ID.
     * <p><b>Transactional and Modifying query (native SQL).</b></p>
     *
     * @param petId The pet's ID.
     */
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM pet_images WHERE pet_id = :petId", nativeQuery = true)
    void deleteImagesByPetId(@Param("petId") Long petId);

    /**
     * Inserts a new image for a given pet.
     * <p><b>Transactional and Modifying query (native SQL).</b></p>
     *
     * @param petId The pet's ID.
     * @param imageUrl The URL of the image to insert.
     */
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO pet_images (pet_id, image_url) VALUES (:petId, :imageUrl)", nativeQuery = true)
    void insertPetImage(@Param("petId") Long petId, @Param("imageUrl") String imageUrl);

    /**
     * Retrieves all image URLs for a given pet.
     *
     * @param petId The pet's ID.
     * @return A list of image URLs as strings.
     */
    @Query(value = "SELECT image_url FROM pet_images WHERE pet_id = :petId", nativeQuery = true)
    List<String> findImagesByPetId(@Param("petId") Long petId);

    /**
     * Retrieves all pets in the database.
     *
     * @return A list of all {@link Pet} entities.
     */
    @Query("SELECT p FROM Pet p")
    List<Pet> getAllPets();

    /**
     * Retrieves all pets belonging to a specific adoption center, filtered by availability status.
     *
     * @param adoptionCenterId The ID of the adoption center.
     * @param status The pet's availability status.
     * @return A list of {@link Pet} objects.
     */
    List<Pet> findByAdoptionCenterIdAndAvailabilityStatus(Long adoptionCenterId, Pet.PetStatus status);

    /**
     * Finds all archived pets that were adopted by a specific user.
     *
     * @param userId The user ID of the adopter.
     * @return A list of archived pets adopted by the user.
     */
    @Query("SELECT p FROM Pet p WHERE p.adopter.id = :userId AND p.availabilityStatus = 'ARCHIVED'")
    List<Pet> findArchivedPetsByAdopterId(@Param("userId") Long userId);

}