// TODO: Auto add weights to users on account creation

package petadoption.api.services;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import petadoption.api.DTO.SwipePetDTO;
import petadoption.api.models.*;
import petadoption.api.repository.PetRepository;
import petadoption.api.repository.UserRepository;

import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class RecEngineService {
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private static final Logger logger = LoggerFactory.getLogger(RecEngineService.class);


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

    public void addWeight(Characteristic characteristic, boolean liked, User user){
        Weight weight = new Weight();
        weight.setCharacteristic(characteristic);
        weight.setWeight(liked ? 2 : -1); // if liked, 2 and if disliked, -1
        weight.setUser(user);
        user.getWeights().add(weight);
    }

    public Map<Characteristic, Weight> convertListToWeightMap(List<Weight> weights) {
        return weights.stream()
                .collect(Collectors.toMap(
                        Weight::getCharacteristic,
                        Function.identity(),
                        (existing, replacement) -> existing //keeps the first entry encountered
                ));
    }


    @Transactional
    public String likePet(User userFromSession, Optional<Pet> petDetail) {
        User user = userRepository.findById(userFromSession.getId()).orElseThrow(() -> new RuntimeException("User not found"));

        if (petDetail.isEmpty()) {
            return "Error: Pet not found";
        }

        Pet pet = petDetail.get();

        for (Characteristic characteristic : pet.getPetCharacteristics()) {
            List<Weight> wlist = user.getWeights().stream().filter(e -> e.getCharacteristic().equals(characteristic)).toList();

            if (!wlist.isEmpty()) {
                Weight weight = wlist.getFirst();
                weight.setWeight(weight.getWeight() + 1);
            } else {
                addWeight(characteristic, true, user);
            }
        }

        userRepository.save(user);
        return "Successfully liked pet " + pet.getName();
    }
    @Transactional
    public String dislikePet(User userFromSession, Optional<Pet> petDetail) {
        User user = userRepository.findById(userFromSession.getId()).orElseThrow(() -> new RuntimeException("User not found"));

        if (petDetail.isEmpty()) {
            return "Error: Pet not found";
        }

        Pet pet = petDetail.get();

        for (Characteristic characteristic : pet.getPetCharacteristics()) {
            List<Weight> wlist = user.getWeights().stream().filter(e -> e.getCharacteristic().equals(characteristic)).toList();

            if (!wlist.isEmpty()) {
                Weight weight = wlist.getFirst();
                weight.setWeight(weight.getWeight() - 1);
            } else {
                addWeight(characteristic, false, user);
                logger.info("char: "+characteristic.getName()+" - wgt: <didn't exist>");
            }
        }

        userRepository.save(user);
        return "Successfully disliked pet " + pet.getName();
    }

    public List<SwipePetDTO> getSwipePetsV2(User userFromSession){
        User user = userRepository.findById(userFromSession.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        List<Pet> potentialRecs = petRepository.getAllPets();

        // Filter out already reccomended pets
        List<PetRecommendation> alreadyShownPets = user.getRecommendedPets();
        logger.info("alrshown: "+alreadyShownPets.size()+" | total: "+potentialRecs.size());
        potentialRecs = potentialRecs.stream().filter(p -> {
            for(PetRecommendation pr : alreadyShownPets){
                if(pr.getPet().getId() == p.getId())
                    return false;
            }
            return true;
        }).toList();

//        if(potentialRecs.isEmpty()){
//            // TODO: Recs should be time based. This is a hack
//            logger.info("Already recommended every possible pet to this user. Clearing previous recs");
//            user.setRecommendedPets(new ArrayList<>());
//        }

        List<Pair<Double, Pet>> petScores = new ArrayList<>();
        // Calculate scores.
        for(Pet pet : potentialRecs){
            double score = 0;
            for(Characteristic ch : pet.getPetCharacteristics()){
                List<Weight> results = user.getWeights().stream().filter(w -> w.getCharacteristic().equals(ch)).toList();
                if(results.size() != 1)
                    continue;
                score += results.get(0).getWeight();
            }

            // Scores need to be normalized against the fact that some pets may have more listed traits than others.
            // this makes score the avg of all the pet's characteristics
            score /= pet.getPetCharacteristics().size();
            petScores.add(Pair.of(score, pet));
        }

        // sort by scores
        petScores.sort(Comparator.comparingDouble(Pair<Double, Pet>::getFirst));

        // pull out the winners
        List<SwipePetDTO> finalPetRecs = new ArrayList<>();
        for(int i = 0; i < petScores.size() && i < 5; i++){
            Pet pet = petScores.get(i).getSecond();
            finalPetRecs.add(new SwipePetDTO(pet));

            // log the winners
            PetRecommendation rec = new PetRecommendation();
            rec.setPet(pet);
            rec.setUser(user);
            rec.setDate(new Date());
            user.getRecommendedPets().add(rec);
        }


        this.userRepository.save(user);


        return finalPetRecs;

    }
}