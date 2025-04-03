// TODO: Auto add weights to users on account creation

package petadoption.api.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.DTO.SwipePetDTO;
import petadoption.api.models.Characteristic;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.models.Weight;
import petadoption.api.repository.PetRepository;
import petadoption.api.repository.UserRepository;

import java.util.*;
import java.util.function.Function;
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

    public void addWeight(List<Weight> weights, Characteristic characteristic){
        Weight weight = new Weight();
        weight.setCharacteristic(characteristic);
        weight.setWeight(1);
        weights.add(weight);
    }

    public void addWeight(List<Weight> weights, Characteristic characteristic, boolean liked){
        Weight weight = new Weight();
        weight.setCharacteristic(characteristic);
        weight.setWeight(liked ? 2 : -1); // if liked, 2 and if disliked, -1
        weights.add(weight);
    }

    public Map<Characteristic, Weight> convertListToWeightMap(List<Weight> weights) {
        return weights.stream()
                .collect(Collectors.toMap(
                        Weight::getCharacteristic,
                        Function.identity(),
                        (existing, replacement) -> existing //keeps the first entry encountered
                ));
    }

    public void deduplicateUserWeights(User user) {
        Map<Characteristic, Weight> weightMap = convertListToWeightMap(user.getWeights());
        user.setWeights(new ArrayList<>(weightMap.values()));
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

        deduplicateUserWeights(user);
        userRepository.save(user);
        return "Successfully liked pet " + pet.getName();
    }
    @Transactional
    public String dislikePet(User user, Optional<Pet> petDetail) {
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
                weight.setWeight(weight.getWeight() - 1);
            } else {
                addWeight(userWeights, characteristic, false);
            }
        }

        //System.out.println("printing weights");
        //user.getWeights().forEach(System.out::println);

        userRepository.save(user);
        return "Successfully disliked pet " + pet.getName();
    }

    public double calculateScore(User user, Pet pet){
        Map<Characteristic, Weight> weightMap = convertListToWeightMap(user.getWeights());
        double score = 0;

        for (Characteristic characteristic : pet.getPetCharacteristics()) {
            Weight weight = weightMap.get(characteristic);
            System.out.println("Map keys:");
            for (Characteristic c : weightMap.keySet()) {
                System.out.println("  -> " + c.getId());
            }
            System.out.println("Pet characteristics:");
            for (Characteristic c : pet.getPetCharacteristics()) {
                System.out.println("  -> " + c.getId());
            }
            System.out.println(characteristic.getId());
            if (weight != null) {
                System.out.println(weight.getWeight());
                score += weight.getWeight();
            }else {
                System.out.println("Weight not found");
                addWeight(user.getWeights(), characteristic);
                score += 1;
            }
        }

        deduplicateUserWeights(user);
        return score / 100;
    }

    // Temp get swipe pets
    @Transactional
    public List<SwipePetDTO> getSwipePets(User userFromSession) {
        User user = userRepository.findById(userFromSession.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        List<Pet> pets = petRepository.getAllPets();
        List<SwipePetDTO> swipePetDTOs = new ArrayList<>();
        Map<Pet, Double> petScoreMap = new HashMap<>();
        Set<Pet> alrRecPets = user.getRecommendedPets();

        if(alrRecPets == null){
            alrRecPets = new HashSet<>();
            user.setRecommendedPets(alrRecPets);
        }

        if(pets.size() == alrRecPets.size()){
            alrRecPets.clear();
        }

        for(Pet pet : pets){
            if(!alrRecPets.contains(pet)) {
                petScoreMap.put(pet, calculateScore(user, pet));
            }
        }

        List<Map.Entry<Pet, Double>> sortedPetScores = petScoreMap.entrySet().stream().sorted(Map.Entry.comparingByValue()).toList();
        for(Map.Entry<Pet, Double> pet : sortedPetScores.subList(0,5)) {
            alrRecPets.add(pet.getKey());
            SwipePetDTO swipePetDTO = new SwipePetDTO(pet.getKey());
            swipePetDTOs.add(swipePetDTO);
        }
        userRepository.save(user);

        return swipePetDTOs;
    }

    // TODO: RecEngine functions
}
