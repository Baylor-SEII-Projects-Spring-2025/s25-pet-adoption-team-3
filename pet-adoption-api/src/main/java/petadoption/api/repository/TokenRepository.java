package petadoption.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Token;
import petadoption.api.models.User;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByTokenAndTokenType(String token, Token.TokenType tokenType);
    Optional<Token> findByUserAndTokenType(User user, Token.TokenType tokenType);


}
