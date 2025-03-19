package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
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


}