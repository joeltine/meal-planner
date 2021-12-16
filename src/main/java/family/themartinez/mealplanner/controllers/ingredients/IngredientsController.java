package family.themartinez.mealplanner.controllers.ingredients;

import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IngredientsController {

  @Autowired private IngredientRepository ingredientRepository;

  @GetMapping("/ingredients")
  public List<Map<String, String>> getIngredients(@RequestParam(name = "q") String query) {
    return ingredientRepository
        .findTop10ByNameLikeIgnoreCase(String.format("%%%s%%", query))
        .stream()
        .map(
            e -> {
              Map<String, String> map = new HashMap<>();
              map.put("value", e.getId().toString());
              map.put("text", e.getName());
              return map;
            })
        .collect(Collectors.toList());
  }
}