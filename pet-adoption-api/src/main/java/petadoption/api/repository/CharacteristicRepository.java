package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Characteristic;

import java.util.List;

@Repository
public interface CharacteristicRepository extends JpaRepository<Characteristic, Long> {
    @Query("SELECT c FROM Characteristic c")
    List<Characteristic> getAll();
}
