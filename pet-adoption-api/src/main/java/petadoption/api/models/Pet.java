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
    @Column(name = "image_url", nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    @ElementCollection
    private List<String> image;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String name;

    @ManyToOne
    @JoinColumn(name = "adoption_center_id", nullable = false)
    private User adoptionCenter;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String breed;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String spayedStatus; //"Spayed Female", "Unspayed Female", etc.

    @Column(nullable = false, columnDefinition="date default '9999-12-30'")
    private LocalDate birthdate;

    @Column(columnDefinition = "TEXT")
    private String aboutMe;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String extra1;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String extra2;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'n/a'")
    private String extra3;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition="enum('AVAILABLE','ARCHIVED') default 'AVAILABLE'")
    private PetStatus availabilityStatus;

    public enum PetStatus {
        AVAILABLE,
        ARCHIVED
    }
}
