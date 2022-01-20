package family.themartinez.mealplanner.data.converters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.google.common.collect.ImmutableList;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Converter(autoApply = true)
public class ImmutableListConverter implements AttributeConverter<ImmutableList<String>, String> {

  private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new GuavaModule());
  private final Logger logger = LoggerFactory.getLogger(ImmutableListConverter.class);

  @Override
  public String convertToDatabaseColumn(ImmutableList<String> array) {
    if (array == null) {
      return "[]";
    }
    try {
      return objectMapper.writeValueAsString(array);
    } catch (JsonProcessingException e) {
      logger.error("Failed converting ImmutableList to JSON string", e);
      return "[]";
    }
  }

  @Override
  public ImmutableList<String> convertToEntityAttribute(String data) {
    if (data == null || data.isEmpty()) {
      return ImmutableList.of();
    }
    ImmutableList<String> parsedData;
    try {
      parsedData = objectMapper.readValue(data, new TypeReference<>() {});
    } catch (JsonProcessingException e) {
      logger.error(String.format("Failed parsing JSON string %s", data), e);
      parsedData = ImmutableList.of();
    }
    return parsedData;
  }
}
