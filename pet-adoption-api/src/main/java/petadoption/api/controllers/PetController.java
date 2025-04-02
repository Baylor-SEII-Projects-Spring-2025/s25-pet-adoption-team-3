package petadoption.api.controllers;

import com.google.api.Http;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.DTO.PetRequestDTO;
import petadoption.api.DTO.SwipePetDTO;
import petadoption.api.models.Characteristic;
import petadoption.api.models.Pet;
import petadoption.api.models.User;
import petadoption.api.repository.CharacteristicRepository;
import petadoption.api.repository.PetRepository;
import petadoption.api.repository.UserRepository;
import petadoption.api.services.GCSStorageServicePets;
import petadoption.api.services.PetService;
import petadoption.api.services.RecEngineService;
import petadoption.api.services.SessionValidation;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = { "http://localhost:3000", "https://adopdontshop.duckdns.org", "http://35.226.72.131:3000" })
@RestController
@RequestMapping("/api/pet")
public class PetController {
    private final PetService petService;
    private final GCSStorageServicePets gcsStorageServicePets;
    private final PetRepository petRepository;
    private final SessionValidation sessionValidation;
    private final RecEngineService recEngineService;
    private final UserRepository userRepository;
    private final CharacteristicRepository CharacteristicRepository;
    private final CharacteristicRepository characteristicRepository;

    @Autowired
    public PetController(PetService petService, PetRepository petRepository, SessionValidation sessionValidation, RecEngineService recEngineService, GCSStorageServicePets gcsStorageServicePets, UserRepository userRepository, CharacteristicRepository characteristicRepository) {
        this.CharacteristicRepository = characteristicRepository;
        this.gcsStorageServicePets = new GCSStorageServicePets();
        this.petService = petService;
        this.petRepository = petRepository;
        this.sessionValidation = sessionValidation;
        this.recEngineService = recEngineService;
        this.userRepository = userRepository;
        this.characteristicRepository = characteristicRepository;
    }

    @PostMapping("/add-pet-with-images")
    public ResponseEntity<PetRequestDTO> addPetWithImages(
            HttpSession session,
            @RequestParam("name") String name,
            @RequestParam("breed") String breed,
            @RequestParam("spayedStatus") String spayedStatus,
            @RequestParam("birthdate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthdate,
            @RequestParam("aboutMe") String aboutMe,
            @RequestParam("extra1") String extra1,
            @RequestParam("extra2") String extra2,
            @RequestParam("extra3") String extra3,
            @RequestParam("files") MultipartFile[] files) {

        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body(null);
        }
        User user = (User) validationResponse.getBody();

        PetRequestDTO petRequestDTO = new PetRequestDTO();
        petRequestDTO.setName(name);
        petRequestDTO.setBreed(breed);
        petRequestDTO.setSpayedStatus(spayedStatus);
        petRequestDTO.setBirthdate(birthdate);
        petRequestDTO.setAboutMe(aboutMe);
        petRequestDTO.setExtra1(extra1);
        petRequestDTO.setExtra2(extra2);
        petRequestDTO.setExtra3(extra3);

        Pet pet = petService.addPetWithImages(user, petRequestDTO, files);

        if(pet == null) {
            return ResponseEntity.status(400).body(null);
        }

        return ResponseEntity.status(200).body(new PetRequestDTO(pet));
    }

    @PostMapping("/add-pet")
    public ResponseEntity<String> addPet(HttpSession session, @RequestBody @Valid PetRequestDTO petRequestDTO) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("No active session.");
        if (user.getRole() != User.Role.ADOPTION_CENTER) return ResponseEntity.status(403).body("Unauthorized action.");
        //User user = userRepository.getOne(1L);

        petService.addPet(user, petRequestDTO);
        return ResponseEntity.status(201).body(petRequestDTO.getName() + " was successfully added.");
    }


    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editPet(
            HttpSession session,
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("breed") String breed,
            @RequestParam("spayedStatus") String spayedStatus,
            @RequestParam("birthdate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthdate,
            @RequestParam("aboutMe") String aboutMe,
            @RequestParam("extra1") String extra1,
            @RequestParam("extra2") String extra2,
            @RequestParam("extra3") String extra3,
            @RequestParam("files") MultipartFile[] files) {

        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }

        User user = (User) validationResponse.getBody();

        PetRequestDTO petRequestDTO = new PetRequestDTO();
        petRequestDTO.setName(name);
        petRequestDTO.setBreed(breed);
        petRequestDTO.setSpayedStatus(spayedStatus);
        petRequestDTO.setBirthdate(birthdate);
        petRequestDTO.setAboutMe(aboutMe);
        petRequestDTO.setExtra1(extra1);
        petRequestDTO.setExtra2(extra2);
        petRequestDTO.setExtra3(extra3);

        boolean updated = petService.editPet(user, id, petRequestDTO, files);

        return updated ? ResponseEntity.ok("Pet details updated successfully.")
                : ResponseEntity.status(404).body("Pet not found or unauthorized.");
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePet(HttpSession session, @PathVariable Long id) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }

        User user = (User) validationResponse.getBody();
        boolean deleted = petService.deletePet(user, id);

        return deleted ? ResponseEntity.ok("Pet successfully deleted.") : ResponseEntity.status(404).body("Pet not found or unauthorized.");
    }

    @GetMapping("/get-all-pets/{adoptionCenterID}")
    public ResponseEntity<List<Pet>> getAllPets(@PathVariable Long adoptionCenterID) {
        List<Pet> pets = petService.getAllPets(adoptionCenterID);
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/get-pet-detail/{petId}")
    public ResponseEntity<?> getPetDetail(@PathVariable Long petId) {
        Optional<Pet> petOptional = petService.getPetDetail(petId);

        if (petOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Pet not found.");
        }

        return ResponseEntity.ok(petOptional.get());
    }

    @GetMapping("/swipe/get-pet")
    public ResponseEntity<Pet> getSwipePet() {
        Optional<Pet> petOptional = petService.getSwipePet();

        if (petOptional.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        return ResponseEntity.ok(petOptional.get());
    }

    @PostMapping("/like-pet/{petId}")
    public ResponseEntity<String> likePet(HttpSession session, @PathVariable Long petId) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }
        User user = (User) validationResponse.getBody();

        //User user = userRepository.getOne(1L);
        String response = recEngineService.likePet(user, petService.getPetDetail(petId));
        if(response.contains("Error"))
            return ResponseEntity.status(400).body(response);
        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/dislike-pet/{petId}")
    public ResponseEntity<String> dislikePet(HttpSession session, @PathVariable Long petId) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body((String) validationResponse.getBody());
        }
        User user = (User) validationResponse.getBody();

        //User user = userRepository.getOne(1L);
        String response = recEngineService.dislikePet(user, petService.getPetDetail(petId));
        if(response.contains("Error"))
            return ResponseEntity.status(400).body(response);
        return ResponseEntity.status(200).body(response);
    }

    // DEV ONLY
    @PostMapping("/add-characteristics")
    @Transactional
    public void addCharacteristics(@RequestParam("c") String[] characteristics) {
        for(String characteristicStr : characteristics) {
            // System.out.println(characteristic);
            Characteristic characteristic = new Characteristic();
            characteristic.setName(characteristicStr);
            characteristicRepository.save(characteristic);
        }
    }

    // temporary swipe get pets
    @GetMapping("/swipe/temp-get-pets")
    public ResponseEntity<List<SwipePetDTO>> getSwipePets(HttpSession session) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body(null);
        }
        User user = (User) validationResponse.getBody();

        return ResponseEntity.status(200).body(recEngineService.getSwipePets(user));
    }
}
