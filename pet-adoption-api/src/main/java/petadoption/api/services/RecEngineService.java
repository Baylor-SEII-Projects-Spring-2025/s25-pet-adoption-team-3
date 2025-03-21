package petadoption.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.repository.PetRepository;
import petadoption.api.repository.UserRepository;

@Service
public class RecEngineService {
    private final UserRepository userRepository;
    private final PetRepository petRepository;

    @Autowired
    public RecEngineService(UserRepository userRepository, PetRepository petRepository) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    // TODO: RecEngine functions
}
