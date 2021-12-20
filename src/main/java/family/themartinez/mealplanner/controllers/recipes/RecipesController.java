package family.themartinez.mealplanner.controllers.recipes;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// TODO: Add unit tests.
@RestController
public class RecipesController {
  @Autowired private RecipeRepository recipeRepository;

  @GetMapping("/recipes")
  public ImmutableList<Recipe> getRecipes() {
    return ImmutableList.copyOf(recipeRepository.findAll());
  }
}
