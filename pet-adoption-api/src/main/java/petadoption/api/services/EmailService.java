package petadoption.api.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import petadoption.api.models.Token;
import petadoption.api.models.User;
import petadoption.api.repository.TokenRepository;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final TokenRepository tokenRepository;

    @Value("${backend.url}")
    private String backendUrl;

    @Value("${frontend.url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender, TokenRepository tokenRepository) {
        this.mailSender = mailSender;
        this.tokenRepository = tokenRepository;
    }

    public void sendVerificationEmail(User user){
        String token = generateToken(user, Token.TokenType.EMAIL_VERIFICATION);
        String verificationLink = backendUrl + "/api/users/verify-email?token=" + token;

        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("adoptdontshopinfo@gmail.com");
            helper.setTo(user.getEmail());
            helper.setSubject("Verify Your Email");
            helper.setText("<p>Click the link below to verify your email:</p>"
                    + "<a href=\"" + verificationLink + "\">Verify Email</a>", true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email.");
        }
    }

    public void sendPasswordResetEmail(User user) {
        String token = generateToken(user, Token.TokenType.PASSWORD_RESET);
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("adoptdontshopinfo@gmail.com");
            helper.setTo(user.getEmail());
            helper.setSubject("Reset Your Password");
            helper.setText("<p>Click the link below to reset your password:</p>"
                    + "<a href=\"" + resetLink + "\">Reset Password</a>", true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email.");
        }
    }

    public String generateToken(User user, Token.TokenType tokenType) {
        String token = UUID.randomUUID().toString();
        Token tokenEntity = new Token();
        tokenEntity.setToken(token);
        tokenEntity.setUser(user);
        tokenEntity.setExpiryDate(LocalDateTime.now().plusHours(24));
        tokenEntity.setTokenType(tokenType);
        tokenRepository.save(tokenEntity);
        return token;
    }


}
