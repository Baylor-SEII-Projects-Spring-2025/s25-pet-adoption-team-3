package petadoption.api.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.PetRequestDTO;
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


    public PetService(PetRepository petRepository, GCSStorageServicePets gcsStorageServicePets) {
        this.petRepository = petRepository;
        this.gcsStorageServicePets = gcsStorageServicePets;
    }

    public ResponseEntity<Pet> addPetWithImages(User user, PetRequestDTO petRequestDTO, MultipartFile[] files) {
        if (files.length != 4) {
            return ResponseEntity.status(400).body(null);
        }

        Pet pet = new Pet();
        pet.setAdoptionCenter(user);
        pet.setName(petRequestDTO.getName());
        pet.setBreed(petRequestDTO.getBreed());
        pet.setSpayedStatus(petRequestDTO.getSpayedStatus());
        pet.setBirthday(petRequestDTO.getBirthdate());
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
                return ResponseEntity.status(500).body(null);
            }
        }

        pet.setImage(uploadedUrls);
        petRepository.save(pet);

        return ResponseEntity.status(201).body(pet);
    }


    public boolean editPet(User user, Long petId, PetRequestDTO petRequestDTO, MultipartFile[] files) {
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
        ResponseEntity<Pet> newPetResponse = addPetWithImages(user, petRequestDTO, files);

        if (newPetResponse.getStatusCode().is2xxSuccessful()) {
            logger.info("Pet successfully updated. ID: {}", petId);
            return true;
        }

        return false;
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

    public Optional<Pet> getSwipePet() {
        List<Pet> availablePets = petRepository.findByAvailabilityStatus(Pet.PetStatus.AVAILABLE);
        if (availablePets.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(availablePets.get(0));
    }

}
