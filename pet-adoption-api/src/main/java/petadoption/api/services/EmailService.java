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

/**
 * Service for handling all email-related actions such as sending
 * verification and password reset emails.
 */
@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final TokenRepository tokenRepository;

    @Value("${backend.url}")
    private String backendUrl;

    @Value("${frontend.url}")
    private String frontend
    /**
     * Constructs the EmailService with the provided JavaMailSender and TokenRepository.
     *
     * @param mailSender      the JavaMailSender used to send emails
     * @param tokenRepository the repository for managing verification and reset tokens
     */Url;

    public EmailService(JavaMailSender mailSender, TokenRepository tokenRepository) {
        this.mailSender = mailSender;
        this.tokenRepository = tokenRepository;
    }

    /**
     * Sends an email to the user for verifying their email address.
     * Generates a unique verification token and constructs a verification link.
     *
     * @param user the User to send the verification email to
     * @throws RuntimeException if email sending fails
     */
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

    /**
     * Sends a password reset email to the user.
     * Generates a unique password reset token and constructs a reset link.
     *
     * @param user the User to send the password reset email to
     * @throws RuntimeException if email sending fails
     */
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

    /**
     * Generates a unique token for the user for the given token type (verification or reset).
     * Stores the token in the database with an expiry of 24 hours.
     *
     * @param user      the User to associate with the token
     * @param tokenType the type of token (EMAIL_VERIFICATION or PASSWORD_RESET)
     * @return the generated token string
     */
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
