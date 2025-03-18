package petadoption.api.services;

import org.springframework.stereotype.Service;
import petadoption.api.DTO.PetRequestDTO;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.repository.PetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    private final PetRepository petRepository;

    private static final Logger logger = LoggerFactory.getLogger(PetService.class);


    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public void addPet(User user, PetRequestDTO petRequestDTO) {
        Pet pet = new Pet();
        pet.setName(petRequestDTO.getName());
        pet.setAdoptionCenter(user);
        pet.setBreed(petRequestDTO.getBreed());
        pet.setStatus(petRequestDTO.getStatus());
        pet.setBirthday(petRequestDTO.getBirthdate());
        pet.setAboutMe(petRequestDTO.getAboutMe());
        pet.setExtra1(petRequestDTO.getExtra1());
        pet.setExtra2(petRequestDTO.getExtra2());
        pet.setExtra3(petRequestDTO.getExtra3());
        pet.setImageUrl(petRequestDTO.getImageUrl());


        pet.setAvailabilityStatus(Pet.PetStatus.AVAILABLE);

        petRepository.save(pet);
    }

    public boolean editPet(User user, Long petId, PetRequestDTO petRequestDTO) {
        Optional<Pet> petOptional = petRepository.findById(petId);

        if (petOptional.isEmpty()) {
            logger.info("Pet ID not found in database: {}", petId);
            return false;
        }

        Pet pet = petOptional.get();
        logger.info("Found pet: {} | Owned by adoption center ID: {}", pet.getId(), pet.getAdoptionCenter().getId());

        if (!pet.getAdoptionCenter().getId().equals(user.getId())) {
            logger.info("Adoption center ID mismatch. Expected: {}, but logged-in user ID: {}", pet.getAdoptionCenter().getId(), user.getId());
            return false;
        }

        petRepository.deleteById(petId);
        addPet(user, petRequestDTO);

        logger.info("Pet successfully updated. ID: {}", petId);
        return true;
    }

    public boolean deletePet(User user, Long petId) {
        Optional<Pet> petOptional = petRepository.findById(petId);

        if (petOptional.isEmpty()) {
            logger.info("Pet ID not found in database: {}", petId);
            return false;
        }

        Pet pet = petOptional.get();
        logger.info("Found pet: {} | Owned by adoption center ID: {}", pet.getId(), pet.getAdoptionCenter().getId());

        if (!pet.getAdoptionCenter().getId().equals(user.getId())) {
            logger.info("Adoption center ID mismatch. Expected: {}, but logged-in user ID: {}", pet.getAdoptionCenter().getId(), user.getId());
            return false;
        }

        petRepository.deleteById(petId);
        logger.info("Pet successfully deleted. ID: {}", petId);
        return true;
    }

    public List<Pet> getAllPets(Long adoptionCenterID) {
        List<Pet> pets = petRepository.findByAdoptionCenterId(adoptionCenterID);

        if (pets.isEmpty()) {
            logger.info("No pets found for adoption center ID: {}", adoptionCenterID);
        } else {
            logger.info("Found {} pets for adoption center ID: {}", pets.size(), adoptionCenterID);
        }

        return pets;
    }

}
