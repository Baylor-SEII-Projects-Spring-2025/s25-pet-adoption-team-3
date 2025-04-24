package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Entity representing a verification or password reset token associated with a user.
 * <p>
 * Used for email verification and password reset functionality. Each token is unique and linked
 * to a specific user and has an expiration date.
 * </p>
 */
@Entity
@Getter
@Setter
public class Token {
    /**
     * The unique identifier for this token.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The token string used for verification or password reset.
     */
    @Column(nullable = false, unique = true)
    private String token;

    /**
     * The user associated with this token. Each user can only have one token of each type.
     */
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /**
     * The expiration date and time of the token.
     */
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    /**
     * The type of the token: can be for email verification or password reset.
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TokenType tokenType;

    /**
     * Enum representing the type of token: either for email verification or password reset.
     */
    public enum TokenType{
        EMAIL_VERIFICATION, PASSWORD_RESET
    }
}
