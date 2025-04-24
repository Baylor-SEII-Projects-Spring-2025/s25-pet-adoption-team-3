package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Event;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByAdoptionCenterId(Long adoptionCenterId);

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
