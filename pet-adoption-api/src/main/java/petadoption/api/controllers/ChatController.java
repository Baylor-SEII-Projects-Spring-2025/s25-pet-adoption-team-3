package petadoption.api.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
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

/**
 * Controller for real-time chat and messaging REST/WebSocket API endpoints.
 * Supports sending messages, retrieving conversation history, unread counts,
 * and marking messages as read for the pet adoption platform.
 */
@Controller
public class ChatController {

    private final UserRepository userRepository;
    private final ChatMessageRepository messageRepository;


    public ChatController(ChatMessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    /**
     * Handles incoming chat messages over WebSocket using STOMP.
     * Persists the message, sets timestamp, and broadcasts to /topic/messages.
     *
     * @param message the incoming chat message
     * @return the saved ChatMessage to be sent to subscribers
     */
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessage handleMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now().toString());
        message.setRead(false);
        return messageRepository.save(message);
    }

    /**
     * Retrieves the chat history between the current user and another user.
     *
     * @param session the current HTTP session (for user identification)
     * @param otherUserId the ID of the other user in the conversation
     * @return ResponseEntity containing the list of ChatMessage objects
     */
    @GetMapping("/api/chat/history/{otherUserId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            HttpSession session,
            @PathVariable String otherUserId
    ) {
        User currentUser = (User) session.getAttribute("user");
        String currentUserId = currentUser.getId().toString();

        List<ChatMessage> history = messageRepository.findConversation(currentUserId, otherUserId);

        return ResponseEntity.ok(history);
    }

    /**
     * Retrieves a list of previous conversations for the logged-in user,
     * including name, profile photo, last message time, and unread count.
     *
     * @param session the current HTTP session (for user identification)
     * @return ResponseEntity containing a list of conversation metadata maps
     */
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
                    String currentUserId = currentUser.getId().toString();
                    List<ChatMessage> messages = messageRepository.findConversation(currentUserId, id);

                    String lastTime = messages.isEmpty() ? null :
                            messages.get(messages.size() - 1).getTimestamp();

                    long unreadCount = messages.stream()
                            .filter(msg -> msg.getRecipientId().equals(currentUserId) && !msg.isRead())
                            .count();

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
                            "profilePhoto", profilePhoto,
                            "lastMessageTime", lastTime != null ? lastTime : "",
                            "unreadCount", String.valueOf(unreadCount)
                    );

                })
                .filter(Objects::nonNull)
                .toList();


        return ResponseEntity.ok(conversations);
    }

    /**
     * Returns the total count of unread messages for the current user.
     *
     * @param session the current HTTP session (for user identification)
     * @return ResponseEntity with an integer representing unread message count
     */
    @GetMapping("/api/chat/unread-count")
    public ResponseEntity<Integer> getUnreadCount(HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(401).body(0);
        }

        int count = messageRepository
                .findByRecipientIdAndIsReadIsFalse(currentUser.getId().toString())
                .size();

        return ResponseEntity.ok(count);
    }

    /**
     * Marks all messages from a specific conversation as read for the current user.
     *
     * @param session the current HTTP session (for user identification)
     * @param otherUserId the ID of the other user in the conversation
     * @return ResponseEntity indicating success or failure
     */
    @PutMapping("/api/chat/mark-read/{otherUserId}")
    public ResponseEntity<?> markMessagesAsRead(
            HttpSession session,
            @PathVariable String otherUserId
    ) {
        User currentUser = (User) session.getAttribute("user");
        String currentUserId = currentUser.getId().toString();

        List<ChatMessage> unreadMessages = messageRepository.findConversation(currentUserId, otherUserId)
                .stream()
                .filter(msg -> msg.getRecipientId().equals(currentUserId) && !msg.isRead())
                .toList();

        unreadMessages.forEach(msg -> msg.setRead(true));
        messageRepository.saveAll(unreadMessages);

        return ResponseEntity.ok().build();
    }



}
