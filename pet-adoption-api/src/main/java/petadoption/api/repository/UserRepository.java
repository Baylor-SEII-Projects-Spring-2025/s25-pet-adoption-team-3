package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Characteristic;
import petadoption.api.models.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u.id, u.firstName, u.lastName, u.email, u.profilePhoto FROM User u JOIN u.likedPets p WHERE p.id = :petId")
    List<Object[]> findUsersWhoLikedPet(@Param("petId") Long petId);
}

