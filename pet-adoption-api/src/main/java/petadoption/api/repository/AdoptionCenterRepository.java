package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.models.AdoptionCenter;

import java.util.Optional;

@Repository
public interface AdoptionCenterRepository extends JpaRepository<AdoptionCenter, Long> {
    Optional<AdoptionCenter> findByEmail(String email);
}
