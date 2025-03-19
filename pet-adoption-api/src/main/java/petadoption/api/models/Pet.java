package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CollectionTable(name = "pet_images", joinColumns = @JoinColumn(name = "pet_id"))
    @Column(name = "image_url", nullable = false)
    @ElementCollection
    private List<String> image;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "adoption_center_id", nullable = false)
    private User adoptionCenter;

    @Column(nullable = false)
    private String breed;

    @Column(nullable = false)
    private String spayedStatus; //"Spayed Female", "Unspayed Female", etc.

    @Column(nullable = false)
    private LocalDate birthday;

    @Column(columnDefinition = "TEXT")
    private String aboutMe;

    @Column(nullable = false)
    private String extra1;

    @Column(nullable = false)
    private String extra2;

    @Column(nullable = false)
    private String extra3;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PetStatus availabilityStatus;

    public enum PetStatus {
        AVAILABLE,
        ARCHIVED
    }
}
