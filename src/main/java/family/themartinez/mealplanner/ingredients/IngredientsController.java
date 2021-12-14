package family.themartinez.mealplanner.ingredients;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IngredientsController {
  @GetMapping("/ingredients")
  public List<Map<String, Object>> getIngredients(@RequestParam(name = "q") String query) {
    return ImmutableList.of(ImmutableMap.of("value", 1, "text", "bar"));
  }
}
