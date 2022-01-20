package family.themartinez.mealplanner.controllers.ingredients;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IngredientsController {

  @Autowired private IngredientRepository ingredientRepository;

  @GetMapping("/ingredientsAc")
  public List<Map<String, String>> getIngredientsForAutoComplete(
      @RequestParam(name = "q") String query) {
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

  @GetMapping("/ingredients")
  public ImmutableList<Ingredient> getAllIngredients() {
    return ImmutableList.copyOf(ingredientRepository.findAll());
  }

  @DeleteMapping("/ingredients")
  public void deleteIngredients(@RequestBody List<Ingredient> ingredients) {
    List<Integer> ids =
        ingredients.stream().map(ingredient -> ingredient.getId()).collect(Collectors.toList());
    ingredientRepository.deleteAllById(ids);
  }

  @PutMapping("/ingredients/{id:[0-9]+}")
  public void updateIngredient(@RequestBody Ingredient ingredient, @PathVariable Integer id) {
    Ingredient existingIngredient = ingredientRepository.findById(id).orElseThrow();
    existingIngredient.setAisle(ingredient.getAisle());
    existingIngredient.setApiId(ingredient.getApiId());
    existingIngredient.setCategories(ingredient.getCategories());
    existingIngredient.setImage(ingredient.getImage());
    existingIngredient.setName(ingredient.getName());
    ingredientRepository.save(existingIngredient);
  }

  @PostMapping("/ingredients")
  public @ResponseBody Ingredient addIngredient(@RequestBody Ingredient ingredient) {
    return ingredientRepository.save(ingredient);
  }
}
