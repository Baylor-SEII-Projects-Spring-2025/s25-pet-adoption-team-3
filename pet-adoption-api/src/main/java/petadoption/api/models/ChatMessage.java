package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing a single chat message exchanged between users in the pet adoption system.
 * <p>
 * Chat messages can be between adopters and adoption centers and may include context
 * about a specific pet being discussed.
 * </p>
 */
@Entity
@Getter
@Setter
public class ChatMessage {
    /**
     * Unique identifier for the chat message.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderId;
    private String recipientId;
    private String content;
    private String timestamp;
    private boolean isRead;

    /**
     * Optional context about the pet being discussed in the message.
     * <p>
     * This field is stored as a serialized object using the {@link PetContextConverter}.
     * It may include additional information such as the pet's name, ID, or image.
     * </p>
     */
    @Lob
    @Convert(converter = PetContextConverter.class)
    private PetContext petContext;

}
