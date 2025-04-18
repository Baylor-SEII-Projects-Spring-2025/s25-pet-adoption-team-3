package petadoption.api.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.PetRequestDTO;
import petadoption.api.DTO.SwipePetDTO;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.repository.PetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PetService {

    private final PetRepository petRepository;
    private final GCSStorageServicePets gcsStorageServicePets;

    private static final Logger logger = LoggerFactory.getLogger(PetService.class);
    private final UserService userService;


    public PetService(PetRepository petRepository, GCSStorageServicePets gcsStorageServicePets, UserService userService) {
        this.petRepository = petRepository;
        this.gcsStorageServicePets = gcsStorageServicePets;
        this.userService = userService;
    }

    public void addPet(User user, PetRequestDTO petRequestDTO) {
        Pet pet = new Pet();
        pet.setName(petRequestDTO.getName());
        pet.setAdoptionCenter(user);
        pet.setBreed(petRequestDTO.getBreed());
        pet.setSpayedStatus(petRequestDTO.getSpayedStatus());
        pet.setBirthdate(petRequestDTO.getBirthdate());
        pet.setAboutMe(petRequestDTO.getAboutMe());
        pet.setExtra1(petRequestDTO.getExtra1());
        pet.setExtra2(petRequestDTO.getExtra2());
        pet.setExtra3(petRequestDTO.getExtra3());

        pet.setAvailabilityStatus(Pet.PetStatus.AVAILABLE);
        pet.setPetCharacteristics(petRequestDTO.getCharacteristics());

        petRepository.save(pet);
    }


    public Pet addPetWithImages(User user, PetRequestDTO petRequestDTO, MultipartFile[] files) {
        if (files.length != 4) {
            return null;
        }

        Pet pet = new Pet();
        pet.setAdoptionCenter(user);
        pet.setName(petRequestDTO.getName());
        pet.setBreed(petRequestDTO.getBreed());
        pet.setSpayedStatus(petRequestDTO.getSpayedStatus());
        pet.setBirthdate(petRequestDTO.getBirthdate());
        pet.setAboutMe(petRequestDTO.getAboutMe());
        pet.setExtra1(petRequestDTO.getExtra1());
        pet.setExtra2(petRequestDTO.getExtra2());
        pet.setExtra3(petRequestDTO.getExtra3());
        pet.setAvailabilityStatus(petRequestDTO.getAvailabilityStatus());



        pet.setAvailabilityStatus(Pet.PetStatus.AVAILABLE);

        pet = petRepository.save(pet);

        List<String> uploadedUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String fileName = "pet_photo_" + pet.getId() + "_" + UUID.randomUUID();
                String uploadedFileUrl = gcsStorageServicePets.uploadFile(file, fileName);
                uploadedUrls.add(uploadedFileUrl);
            } catch (IOException e) {
                return null;
            }
        }

        pet.setImage(uploadedUrls);
        petRepository.save(pet);

        return pet;
    }


    public boolean editPet(User user, Long petId, PetRequestDTO petRequestDTO, MultipartFile[] files) {
        Optional<Pet> petOptional = petRepository.findById(petId);

        if (petOptional.isEmpty()) {
            logger.info("Pet ID {} not found.", petId);
            return false;
        }

        Pet pet = petOptional.get();

        if (!pet.getAdoptionCenter().getId().equals(user.getId())) {
            logger.info("Unauthorized attempt to edit pet ID: {}", petId);
            return false;
        }

        pet.setName(petRequestDTO.getName());
        pet.setBreed(petRequestDTO.getBreed());
        pet.setSpayedStatus(petRequestDTO.getSpayedStatus());
        pet.setBirthdate(petRequestDTO.getBirthdate());
        pet.setAboutMe(petRequestDTO.getAboutMe());
        pet.setExtra1(petRequestDTO.getExtra1());
        pet.setExtra2(petRequestDTO.getExtra2());
        pet.setExtra3(petRequestDTO.getExtra3());

        petRepository.deleteImagesByPetId(petId);

        List<String> uploadedUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String fileName = "pet_photo_" + petId + "_" + UUID.randomUUID();
                String uploadedFileUrl = gcsStorageServicePets.uploadFile(file, fileName);
                uploadedUrls.add(uploadedFileUrl);
            } catch (IOException e) {
                logger.error("Failed to upload pet image", e);
                return false;
            }
        }

        for (String imageUrl : uploadedUrls) {
            petRepository.insertPetImage(petId, imageUrl);
        }

        petRepository.save(pet);
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

    // TODO: Use recengine service
    public Optional<Pet> getSwipePet() {
        List<Pet> availablePets = petRepository.findByAvailabilityStatus(Pet.PetStatus.AVAILABLE);
        if (availablePets.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(availablePets.get(0));
    }

    public Optional<Pet> getPetDetail(Long petId) {
        Optional<Pet> petOptional = petRepository.findById(petId);

        if (petOptional.isEmpty()) {
            return Optional.empty();
        }

        Pet pet = petOptional.get();

        List<String> imageUrls = petRepository.findImagesByPetId(petId);
        pet.setImage(imageUrls);

        return Optional.of(pet);
    }

    public List<SwipePetDTO> getLikedPets(User tempUser) {
        User user = userService.getUserFromId(tempUser.getId());
        List<Pet> likedPets = user.getLikedPets();
        List<SwipePetDTO> petDTOs = new ArrayList<>();

        for(int i = 0; i < likedPets.size(); i++) {
            petDTOs.add(new SwipePetDTO(likedPets.get(i)));
        }

        return petDTOs;
    }
}
