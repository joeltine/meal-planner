package family.themartinez.mealplanner.data.converters;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import org.json.JSONArray;

@Converter(autoApply = true)
public class JSONArrayConverter implements AttributeConverter<JSONArray, String> {

  @Override
  public String convertToDatabaseColumn(JSONArray array) {
    return array.toString();
  }

  @Override
  public JSONArray convertToEntityAttribute(String data) {
    return new JSONArray(data);
  }
}
