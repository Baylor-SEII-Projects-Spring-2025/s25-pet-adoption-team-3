package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Event;

import java.util.List;

/**
 * Repository interface for accessing and managing {@link Event} entities.
 * <p>
 * Provides custom methods to query events by adoption center, as well as find events
 * nearby a user's location using geospatial queries.
 * </p>
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    /**
     * Retrieves all events associated with a specific adoption center.
     *
     * @param adoptionCenterId The ID of the adoption center.
     * @return A list of {@link Event} objects belonging to the specified adoption center.
     */
    List<Event> findByAdoptionCenterId(Long adoptionCenterId);

    /**
     * Finds events that are geographically close to a user's location, within a specified distance,
     * and that start after the current date.
     *
     * <p>This uses a native SQL geospatial query to calculate the distance (in miles)
     * between the user's coordinates and the adoption center's coordinates for each event.</p>
     *
     * @param userLatitude  The latitude of the user.
     * @param userLongitude The longitude of the user.
     * @param maxDistance   The maximum search distance in miles.
     * @return A list of nearby {@link Event} objects.
     */
    @Query(
            value =
                    "SELECT e.* " +
                            "FROM event e " +
                            "  JOIN users a ON e.adoption_center_id = a.user_id " +
                            "WHERE ST_Distance_Sphere(point(:userLongitude, :userLatitude), " +
                            "                         point(a.longitude, a.latitude)) * 0.000621371192 <= :maxDistance AND e.start_date >= (SELECT CURDATE())" +
                            "ORDER BY ST_Distance_Sphere(point(:userLongitude, :userLatitude), " +
                            "                           point(a.longitude, a.latitude)) * 0.000621371192",
            nativeQuery = true
    )
    List<Event> getNearbyEvents(@Param("userLatitude") Double userLatitude, @Param("userLongitude") Double userLongitude, @Param("maxDistance") Integer maxDistance);
}
