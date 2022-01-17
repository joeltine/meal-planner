package family.themartinez.mealplanner.controllers.ingredients;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.ingredients.Ingredient;
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
  public List<Map<String, String>> queryIngredients(@RequestParam(name = "q") String query) {
    return ingredientRepository.findTopByNameAutocompleteAlgorithm(query).stream()
        .map(
            e -> {
              Map<String, String> map = new HashMap<>();
              map.put("value", e.getId().toString());
              map.put("text", e.getName());
              return map;
            })
        .collect(Collectors.toList());
  }

  // TODO: Merge this with /ingredients, if they don't specify "?q=", just return all.
  @GetMapping("/ingredientsAll")
  public ImmutableList<Ingredient> getAllIngredients() {
    // TODO: Fix returning JSONArray fields. It currently returns {"empty":false}.
    return ImmutableList.copyOf(ingredientRepository.findAll());
  }
}
