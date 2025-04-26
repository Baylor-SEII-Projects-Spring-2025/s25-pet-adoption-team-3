package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Characteristic;
import petadoption.api.models.User;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for accessing and managing {@link User} entities in the database.
 * <p>
 * Provides additional custom methods for finding users by email and retrieving users
 * who have liked a specific pet.
 * </p>
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their email address.
     *
     * @param email The email address to search for.
     * @return An {@link Optional} containing the {@link User} if found, or empty otherwise.
     */
    Optional<User> findByEmail(String email);

    /**
     * Retrieves a list of users who have liked a given pet.
     * <p>
     * The returned list consists of Object arrays with the following fields:
     * - id (Long): The user's ID
     * - firstName (String): The user's first name
     * - lastName (String): The user's last name
     * - email (String): The user's email
     * - profilePhoto (String): The user's profile photo URL
     * </p>
     *
     * @param petId The ID of the pet for which to find users who liked it.
     * @return A list of Object arrays representing user info for users who liked the specified pet.
     */
    @Query("SELECT u.id, u.firstName, u.lastName, u.email, u.profilePhoto FROM User u JOIN u.likedPets p WHERE p.id = :petId")
    List<Object[]> findUsersWhoLikedPet(@Param("petId") Long petId);
}

