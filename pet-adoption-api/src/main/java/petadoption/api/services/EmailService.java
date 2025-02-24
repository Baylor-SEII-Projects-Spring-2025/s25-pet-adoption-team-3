package petadoption.api.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import petadoption.api.models.User;
import petadoption.api.models.VerificationToken;
import petadoption.api.repository.VerificationTokenRepository;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final VerificationTokenRepository tokenRepository;

    @Value("${backend.url}")
    private String backendUrl;

    public EmailService(JavaMailSender mailSender, VerificationTokenRepository tokenRepository) {
        this.mailSender = mailSender;
        this.tokenRepository = tokenRepository;
    }

    public void sendVerificationEmail(User user){
        String token = generateToken(user);
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
    private String generateToken(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenRepository.save(verificationToken);
        return token;
    }
}
