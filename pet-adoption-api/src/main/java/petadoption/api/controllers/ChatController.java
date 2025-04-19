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
import petadoption.api.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
public class ChatController {

    private final UserRepository userRepository;
    private final ChatMessageRepository messageRepository;


    public ChatController(ChatMessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
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

    @GetMapping("/api/chat/conversations")
    public ResponseEntity<?> getPreviousConversations(HttpSession session) {
        User currentUser = (User) session.getAttribute("user");

        List<ChatMessage> allMessages = messageRepository.findBySenderIdOrRecipientId(
                currentUser.getId().toString(),
                currentUser.getId().toString()
        );

        Set<String> otherUserIds = allMessages.stream()
                .map(msg -> {
                    if (msg.getSenderId().equals(currentUser.getId().toString())) {
                        return msg.getRecipientId();
                    } else {
                        return msg.getSenderId();
                    }
                })
                .filter(id -> !id.equals(currentUser.getId().toString()))
                .collect(Collectors.toSet());

        List<Map<String, String>> conversations = otherUserIds.stream()
                .map(id -> {
                    User user = userRepository.findById(Long.parseLong(id)).orElse(null);
                    String name;
                    if (user.getFirstName() != null && !user.getFirstName().isEmpty()) {
                        if(user.getLastName() == null || user.getLastName().isEmpty()) {
                            name = user.getFirstName();
                        }
                        else{
                            name = user.getFirstName() + " " + user.getLastName();
                        }
                    } else {
                        name = user.getAdoptionCenterName() != null ? user.getAdoptionCenterName() : "Unknown";
                    }

                    String profilePhoto = user.getProfilePhoto() != null ? user.getProfilePhoto() : "";

                    return Map.of(
                            "id", user.getId().toString(),
                            "name", name,
                            "profilePhoto", profilePhoto
                    );

                })
                .filter(Objects::nonNull)
                .toList();


        return ResponseEntity.ok(conversations);
    }


}
