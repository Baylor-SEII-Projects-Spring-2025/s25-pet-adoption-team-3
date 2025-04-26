package petadoption.api.models;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA AttributeConverter for serializing and deserializing {@link PetContext} objects
 * to and from JSON strings in the database.
 * <p>
 * This allows the {@link PetContext} to be stored as a JSON column, and automatically
 * converts to/from the entity field.
 * </p>
 */
@Converter(autoApply = true)
public class PetContextConverter implements AttributeConverter<PetContext, String> {
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Converts a {@link PetContext} object into its JSON string representation
     * for storage in the database.
     *
     * @param petContext the {@link PetContext} object to convert
     * @return JSON string representation of the {@link PetContext}, or null if input is null
     * @throws RuntimeException if serialization fails
     */
    @Override
    public String convertToDatabaseColumn(PetContext petContext) {
        try {
            return petContext == null ? null : mapper.writeValueAsString(petContext);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize petContext", e);
        }
    }

    /**
     * Converts a JSON string from the database into a {@link PetContext} object.
     *
     * @param json the JSON string from the database
     * @return the corresponding {@link PetContext} object, or null if input is null
     * @throws RuntimeException if deserialization fails
     */
    @Override
    public PetContext convertToEntityAttribute(String json) {
        try {
            return json == null ? null : mapper.readValue(json, PetContext.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize petContext", e);
        }
    }
}
