package petadoption.api.controllers;

import com.google.api.Http;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.util.*;
import java.util.stream.Collectors;

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
    private static final Logger logger = LoggerFactory.getLogger(PetService.class);


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
    public ResponseEntity<?> addPetWithImages(
            HttpSession session,
            @RequestParam("name") String name,
            @RequestParam("breed") String breed,
            @RequestParam("spayedStatus") String spayedStatus,
            @RequestParam("birthdate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthdate,
            @RequestParam("aboutMe") String aboutMe,
            @RequestParam("extra1") String extra1,
            @RequestParam("extra2") String extra2,
            @RequestParam("extra3") String extra3,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("characteristics") List<String> characteristics){

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

        for(String chStr : characteristics){
            Optional<Characteristic> ch = characteristicRepository.findByName(chStr);
            if(ch.isEmpty()){
                return ResponseEntity.status(400).body("Invalid characteristic: "+chStr);
            }
            if (petRequestDTO.getCharacteristics() == null) {
                petRequestDTO.setCharacteristics(new ArrayList<>());
            }
            petRequestDTO.getCharacteristics().add(ch.get());

        }

        Pet pet = petService.addPetWithImages(user, petRequestDTO, files);

        if(pet == null) {
            return ResponseEntity.status(400).body(null);
        }

        return ResponseEntity.status(200).body(new PetRequestDTO(pet));
    }

    @PostMapping("/add-pet")
    public ResponseEntity<String> addPet(HttpSession session, @RequestBody @Valid PetRequestDTO petRequestDTO) {
        User user = userRepository.getOne(1L);
        logger.info("adding pet "+petRequestDTO.getName());
        for(Characteristic ch : petRequestDTO.getCharacteristics()){
            logger.info("  - char "+ch.getId() + ": "+ch.getName());
        }
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
    public ResponseEntity<?> getAllPets(@PathVariable Long adoptionCenterID) {
        List<Pet> pets = petService.getAllPets(adoptionCenterID);

        List<Map<String, Object>> result = pets.stream()
                .map(pet -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("petId", pet.getId());
                    map.put("petName", pet.getName());
                    map.put("petImage", pet.getImage() != null && !pet.getImage().isEmpty() ? pet.getImage().get(0) : null);
                    map.put("breed", pet.getBreed());
                    map.put("spayedStatus", pet.getSpayedStatus());
                    map.put("status", pet.getAvailabilityStatus());

                    return map;
                })
                .collect(Collectors.toList());


        return ResponseEntity.ok(result);
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

        String response = recEngineService.dislikePet(user, petService.getPetDetail(petId));
        if(response.contains("Error"))
            return ResponseEntity.status(400).body(response);
        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/add-characteristics")
    @Transactional
    public void addCharacteristics(@RequestParam("c") String[] characteristics) {
        for(String characteristicStr : characteristics) {
            Characteristic characteristic = new Characteristic();
            characteristic.setName(characteristicStr);
            characteristicRepository.save(characteristic);
        }
    }

    @GetMapping("/swipe/temp-get-pets")
    public ResponseEntity<List<SwipePetDTO>> getSwipePets(HttpSession session) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body(null);
        }
        User user = (User) validationResponse.getBody();

        return ResponseEntity.status(200).body(recEngineService.getSwipePetsV2(user));
    }

    @GetMapping("/characteristics")
    public ResponseEntity<List<String>> getCharacteristics(){
        List<Characteristic> chars = characteristicRepository.getAll();
        List<String> charStrings = chars.stream().map(Characteristic::getName).toList();

        return ResponseEntity.status(200).body(charStrings);
    }

    @GetMapping("/get-liked-pets")
    public ResponseEntity<List<SwipePetDTO>> getLikedPets(HttpSession session) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body(null);
        }
        User user = (User) validationResponse.getBody();

        List<SwipePetDTO> petDTOs = petService.getLikedPets(user);

        return ResponseEntity.status(200).body(petDTOs);
    }

    @GetMapping("/get-my-pets")
    public ResponseEntity<List<Pet>> getMyPets(HttpSession session) {
        ResponseEntity<?> validationResponse = sessionValidation.validateSession(session, User.Role.ADOPTION_CENTER);
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(validationResponse.getStatusCode()).body(null);
        }
        User user = (User) validationResponse.getBody();
        return ResponseEntity.ok(petService.getAllPets(user.getId()));
    }


}