package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import petadoption.api.models.Characteristic;

public interface CharacteristicRepository extends JpaRepository<Characteristic, Long> {
}
