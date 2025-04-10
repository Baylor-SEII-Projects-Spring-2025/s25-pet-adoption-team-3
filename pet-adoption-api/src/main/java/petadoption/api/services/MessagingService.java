package petadoption.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import petadoption.api.models.Conversation;
import petadoption.api.models.Message;
import petadoption.api.models.User;
import petadoption.api.repository.ConversationRepository;

import java.util.Date;

@Service
public class MessagingService {

    private final ConversationRepository conversationRepository;

    @Autowired
    public MessagingService(ConversationRepository conversationRepository){
        this.conversationRepository = conversationRepository;
    }


    public void createConversation(User adoptionCenter, User user){
        if(adoptionCenter.getRole() != User.Role.ADOPTION_CENTER){
            throw new IllegalArgumentException("Provided adoptionCenter is not an ADOPTION_CENTER role");
        }
        if(user.getRole() != User.Role.ADOPTER){
            throw new IllegalArgumentException("Provided user is not an ADOPTER role");
        }

        Conversation convo = new Conversation()
            .setCreationTime(new Date())
            .setUser(user)
            .setAdoptionCenter(adoptionCenter);

        this.conversationRepository.save(convo);
    }

    public void sendMessage(Conversation conversation, User sender, String content){
        conversation.getMessages().add(new Message()
            .setDate(new Date())
            .setSender(sender)
            .setContent(content)
        );
        this.conversationRepository.save(conversation);
    }


}
