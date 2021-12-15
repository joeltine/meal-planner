package family.themartinez.mealplanner.controllers.ingredients;

import family.themartinez.mealplanner.data.ingredients.IdAndNameOnly;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IngredientsController {

  @Autowired private IngredientRepository ingredientRepository;

  @GetMapping("/ingredients")
  public Iterable<IdAndNameOnly> getIngredients(@RequestParam(name = "q") String query) {
    return ingredientRepository.findTop10ByNameLikeIgnoreCase(String.format("%%%s%%", query));
  }
}
