package petadoption.api.models;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PetContextConverter implements AttributeConverter<PetContext, String> {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(PetContext petContext) {
        try {
            return petContext == null ? null : mapper.writeValueAsString(petContext);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize petContext", e);
        }
    }

    @Override
    public PetContext convertToEntityAttribute(String json) {
        try {
            return json == null ? null : mapper.readValue(json, PetContext.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize petContext", e);
        }
    }
}
