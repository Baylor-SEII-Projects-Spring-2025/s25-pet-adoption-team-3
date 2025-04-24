package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.ChatMessage;

import java.util.List;

/**
 * Repository interface for {@link ChatMessage} entity.
 * <p>
 * Provides methods to query chat messages between users, retrieve unread messages,
 * and fetch messages by sender or recipient.
 * </p>
 */
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * Finds the conversation (all chat messages) between two users, ordered by timestamp ascending.
     *
     * @param userId1 The ID of the first user.
     * @param userId2 The ID of the second user.
     * @return A list of {@link ChatMessage} objects exchanged between the two users.
     */
    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.senderId = :userId1 AND m.recipientId = :userId2) OR " +
            "(m.senderId = :userId2 AND m.recipientId = :userId1) " +
            "ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversation(@Param("userId1") String userId1,
                                       @Param("userId2") String userId2);

    /**
     * Retrieves all unread chat messages for a specific recipient.
     *
     * @param recipientId The recipient's user ID.
     * @return A list of unread {@link ChatMessage} objects for the recipient.
     */
    List<ChatMessage> findByRecipientIdAndIsReadIsFalse(String recipientId);

    /**
     * Finds all chat messages where the specified user is either the sender or the recipient.
     *
     * @param string  The sender's user ID.
     * @param string1 The recipient's user ID.
     * @return A list of {@link ChatMessage} objects involving the given user as sender or recipient.
     */
    List<ChatMessage> findBySenderIdOrRecipientId(String string, String string1);
}
