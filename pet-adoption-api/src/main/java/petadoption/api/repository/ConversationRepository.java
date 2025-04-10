package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Conversation;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
}
