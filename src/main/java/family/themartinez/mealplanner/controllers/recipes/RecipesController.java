package family.themartinez.mealplanner.controllers.recipes;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecipesController {
  @Autowired private RecipeRepository recipeRepository;

  @GetMapping("/recipes")
  public ImmutableList<Recipe> getRecipes() {
    return ImmutableList.copyOf(recipeRepository.findAll());
  }

  @DeleteMapping("/recipes")
  public void deleteRecipes(@RequestBody List<Recipe> recipes) {
    List<Integer> ids = recipes.stream().map(recipe -> recipe.getId()).collect(Collectors.toList());
    recipeRepository.deleteAllById(ids);
  }

  @DeleteMapping("/recipes/{id:[0-9]+}")
  public void deleteRecipe(@PathVariable Integer id) {
    recipeRepository.deleteById(id);
  }

  @PutMapping("/recipes/{id:[0-9]+}")
  public Recipe updateRecipe(@RequestBody Recipe recipe, @PathVariable Integer id) {
    Recipe existingRecipe = recipeRepository.findById(id).orElseThrow();
    existingRecipe.setName(recipe.getName());
    existingRecipe.setInstructions(recipe.getInstructions());
    existingRecipe.setDescription(recipe.getDescription());
    existingRecipe.setExternalLink(recipe.getExternalLink());
    existingRecipe.setIngredientLists(recipe.getIngredientLists());
    existingRecipe.setPrepTimeMin(recipe.getPrepTimeMin());
    existingRecipe.setCookTimeMin(recipe.getCookTimeMin());
    existingRecipe.setRecipeCategories(recipe.getRecipeCategories());
    existingRecipe.setMealTypes(recipe.getMealTypes());
    existingRecipe.setRecipeTypes(recipe.getRecipeTypes());
    return recipeRepository.save(existingRecipe);
  }

  @PostMapping("/recipes")
  public @ResponseBody Recipe addRecipe(@RequestBody Recipe recipe) {
    return recipeRepository.save(recipe);
  }
}
