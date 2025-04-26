package petadoption.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket configuration class for Pet Adoption API.
 * <p>
 * Enables STOMP-based WebSocket messaging for real-time features
 * such as chat and notifications.
 * </p>
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Registers the STOMP endpoint for WebSocket connections.
     * <p>
     * This endpoint allows clients to connect for chat and other real-time features.
     * SockJS is enabled for browser compatibility.
     * </p>
     *
     * @param registry the STOMP endpoint registry
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    /**
     * Configures the message broker for routing messages between clients and server.
     * <p>
     * - Enables a simple in-memory broker for destinations prefixed with "/topic"
     *   (typically for broadcasting messages to subscribers)<br>
     * - Sets "/app" as the prefix for messages bound for server-side message handling methods
     * </p>
     *
     * @param registry the message broker registry
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
