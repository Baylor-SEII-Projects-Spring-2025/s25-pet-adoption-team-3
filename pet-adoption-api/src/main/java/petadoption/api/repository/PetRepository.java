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

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByAdoptionCenterId(Long adoptionCenterId);

    @Query("SELECT p FROM Pet p WHERE p.id = :petId")
    Optional<Pet> findPetById(@Param("petId") Long petId);

    List<Pet> findByAvailabilityStatus(Pet.PetStatus status);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM pet_images WHERE pet_id = :petId", nativeQuery = true)
    void deleteImagesByPetId(@Param("petId") Long petId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO pet_images (pet_id, image_url) VALUES (:petId, :imageUrl)", nativeQuery = true)
    void insertPetImage(@Param("petId") Long petId, @Param("imageUrl") String imageUrl);

    @Query(value = "SELECT image_url FROM pet_images WHERE pet_id = :petId", nativeQuery = true)
    List<String> findImagesByPetId(@Param("petId") Long petId);

    @Query("SELECT p FROM Pet p")
    List<Pet> getAllPets();

    List<Pet> findByAdoptionCenterIdAndAvailabilityStatus(Long adoptionCenterId, Pet.PetStatus status);

}