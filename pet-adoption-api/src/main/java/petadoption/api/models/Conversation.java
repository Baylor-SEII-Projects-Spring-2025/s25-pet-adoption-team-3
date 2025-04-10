package petadoption.api.models;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Accessors(chain = true)
@Table(
    name = "conversations",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"adoption_center_id", "user_id"})
    }
)
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creation_time")
    private Date creationTime;

    @ManyToOne
    @JoinColumn(name = "adoption_center_id")
    private User adoptionCenter;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany
    private List<Message> messages;

}
