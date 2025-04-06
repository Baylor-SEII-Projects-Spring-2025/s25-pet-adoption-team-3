package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Characteristic;

import java.util.List;
import java.util.Optional;

@Repository
public interface CharacteristicRepository extends JpaRepository<Characteristic, Long> {
    @Query("SELECT c FROM Characteristic c")
    List<Characteristic> getAll();

    @Query("SELECT c FROM Characteristic c WHERE c.name = :name")
    Optional<Characteristic> findByName(@Param("name") String name);
}
