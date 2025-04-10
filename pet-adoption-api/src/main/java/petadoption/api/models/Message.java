package petadoption.api.models;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Date;

@Entity
@Getter
@Setter
@Accessors(chain = true)
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User sender;

    @Column(nullable = false)
    private String content;

}
