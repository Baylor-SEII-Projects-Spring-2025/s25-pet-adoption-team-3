package petadoption.api.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import petadoption.api.models.ChatMessage;
import petadoption.api.models.User;
import petadoption.api.repository.ChatMessageRepository;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class ChatController {

    private final ChatMessageRepository messageRepository;


    public ChatController(ChatMessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessage handleMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now().toString());
        message.setRead(false);
        return messageRepository.save(message);
    }

    @GetMapping("/api/chat/history/{otherUserId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            HttpSession session,
            @PathVariable String otherUserId
    ) {
        User currentUser = (User) session.getAttribute("user");
        List<ChatMessage> history = messageRepository.findConversation(currentUser.getId().toString(), otherUserId);
        return ResponseEntity.ok(history);
    }

}
