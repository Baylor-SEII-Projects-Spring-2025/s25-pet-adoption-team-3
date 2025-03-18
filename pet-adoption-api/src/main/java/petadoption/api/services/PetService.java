package petadoption.api.services;

import org.springframework.stereotype.Service;
import petadoption.api.DTO.PetRequestDTO;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.repository.PetRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public void addPet(User user, PetRequestDTO petRequestDTO) {
        Pet pet = new Pet();
        pet.setImages(petRequestDTO.getImages());
        pet.setName(petRequestDTO.getName());
        pet.setAdoptionCenter(user);
        pet.setBreed(petRequestDTO.getBreed());
        pet.setStatus(petRequestDTO.getStatus());
        pet.setBirthday(petRequestDTO.getBirthdate());
        pet.setAboutMe(petRequestDTO.getAboutMe());
        pet.setExtra1(petRequestDTO.getExtra1());
        pet.setExtra2(petRequestDTO.getExtra2());
        pet.setExtra3(petRequestDTO.getExtra3());

        pet.setAvailabilityStatus(Pet.PetStatus.AVAILABLE);

        petRepository.save(pet);
    }

    public boolean editPet(User user, Long petId, PetRequestDTO petRequestDTO) {
        Optional<Pet> petOptional = petRepository.findById(user.getId());
        if (petOptional.isEmpty() || !petOptional.get().getId().equals(user.getId())) {
            return false;
        }

        petRepository.deleteById(petId);
        addPet(user, petRequestDTO);
        return true;
    }

    public boolean deletePet(User user, Long petId) {
        Optional<Pet> petOptional = petRepository.findById(user.getId());
        if (petOptional.isEmpty() || !petOptional.get().getId().equals(user.getId())) {
            return false;
        }
        petRepository.deleteById(petId);
        return true;
    }

    public List<Pet> getAllPets(Long adoptionCenterId){
        return petRepository.findByAdoptionCenterId(adoptionCenterId);
    }

}
