package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.ChatMessage;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.senderId = :userId1 AND m.recipientId = :userId2) OR " +
            "(m.senderId = :userId2 AND m.recipientId = :userId1) " +
            "ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversation(@Param("userId1") String userId1,
                                       @Param("userId2") String userId2);


    // Optionally: get messages sent TO a user that are unread
    List<ChatMessage> findByRecipientIdAndIsReadIsFalse(String recipientId);

    List<ChatMessage> findBySenderIdOrRecipientId(String string, String string1);
}
