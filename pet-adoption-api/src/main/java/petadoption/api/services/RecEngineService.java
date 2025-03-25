package petadoption.api.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.models.Characteristic;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.models.Weight;
import petadoption.api.repository.PetRepository;
import petadoption.api.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecEngineService {
    private final UserRepository userRepository;
    private final PetRepository petRepository;

    @Autowired
    public RecEngineService(UserRepository userRepository, PetRepository petRepository) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    public List<Weight> addWeight(List<Weight> weights, Characteristic characteristic, boolean liked){
        Weight weight = new Weight();
        weight.setCharacteristic(characteristic);
        weight.setWeight(liked ? 2 : -1); // if liked, 2 and if disliked, -1
        weights.add(weight);

        return weights;
    }

    public Map<Characteristic, Weight> convertListToWeightMap(List<Weight> weights){
        Map<Characteristic, Weight> weightMap = weights.stream()
                .collect(Collectors.toMap(
                        Weight::getCharacteristic,
                        weight -> weight
                ));

        return weightMap;
    }

    @Transactional
    public String likePet(User user, Optional<Pet> petDetail) {
        if (petDetail.isEmpty()) {
            return "Error: Pet not found";
        }

        Pet pet = petDetail.get();
        List<Weight> userWeights = user.getWeights();

        Map<Characteristic, Weight> weightMap = convertListToWeightMap(userWeights);

        /*
        System.out.println("printing user weights");
        user.getWeights().forEach(System.out::println);

        System.out.println("printing pet chars");
        pet.getPetCharacteristics().forEach(System.out::println);
        */

        for (Characteristic characteristic : pet.getPetCharacteristics()) {
            Weight weight = weightMap.get(characteristic);
            if (weight != null) {
                weight.setWeight(weight.getWeight() + 1);
            } else {
                addWeight(userWeights, characteristic, true);
            }
        }

        //System.out.println("printing weights");
        //user.getWeights().forEach(System.out::println);

        userRepository.save(user);
        return "Successfully liked pet " + pet.getName();
    }

    // TODO: RecEngine functions
}
