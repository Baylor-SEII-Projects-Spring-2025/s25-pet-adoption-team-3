package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Token;
import petadoption.api.models.User;

import java.util.Optional;

/**
 * Repository interface for managing {@link Token} entities.
 * <p>
 * Provides methods to find tokens by value, type, and user, which are
 * used for authentication, email verification, and password reset workflows.
 * </p>
 */
@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    /**
     * Finds a token by its value and type.
     *
     * @param token     The token value.
     * @param tokenType The type of the token (e.g., EMAIL_VERIFICATION, PASSWORD_RESET).
     * @return An {@link Optional} containing the {@link Token} if found, or empty otherwise.
     */
    Optional<Token> findByTokenAndTokenType(String token, Token.TokenType tokenType);

    /**
     * Finds a token for a specific user and type.
     *
     * @param user      The {@link User} associated with the token.
     * @param tokenType The type of the token.
     * @return An {@link Optional} containing the {@link Token} if found, or empty otherwise.
     */
    Optional<Token> findByUserAndTokenType(User user, Token.TokenType tokenType);


}
