package family.themartinez.mealplanner.data.converters;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import org.json.JSONArray;

@Converter(autoApply = true)
public class JSONArrayConverter implements AttributeConverter<JSONArray, String> {

  @Override
  public String convertToDatabaseColumn(JSONArray array) {
    return array == null ? null : array.toString();
  }

  @Override
  public JSONArray convertToEntityAttribute(String data) {
    return data == null ? new JSONArray() : new JSONArray(data);
  }
}
