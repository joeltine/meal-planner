package family.themartinez.mealplanner.controllers.addrecipes;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.ingredientlists.IngredientList;
import family.themartinez.mealplanner.data.ingredientlists.IngredientListRepository;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AddRecipesController {
  private static final String PATH = "/addrecipes";

  @Autowired private UnitRepository unitRepository;
  @Autowired private RecipeRepository recipeRepository;
  @Autowired private IngredientListRepository ingredientListRepository;
  @Autowired private IngredientRepository ingredientRepository;

  private ImmutableList<Unit> unitsList;

  @GetMapping(PATH)
  public String planner(Model model) {
    model.addAttribute("units", getUnitsList());
    return "addrecipes/addrecipes";
  }

  @PutMapping(path = PATH, produces = "application/json")
  public @ResponseBody void putRecipe(@RequestBody Map<String, Object> body) {
    Recipe recipe = new Recipe();
    recipe.setName((String) body.get("name"));
    recipe.setDescription((String) body.get("description"));
    recipe.setInstructions((String) body.get("instructions"));
    recipeRepository.save(recipe);

    ImmutableList<Map<String, String>> ingredients =
        ImmutableList.copyOf((List<Map<String, String>>) body.get("ingredients"));
    for (Map<String, String> ingredient : ingredients) {
      IngredientList list = new IngredientList();
      list.setRecipe(recipe);
      list.setQuantity(Double.valueOf(ingredient.get("quantity")));
      list.setUnit(unitRepository.findById(Integer.valueOf(ingredient.get("unit"))).get());
      list.setIngredient(
          ingredientRepository.findById(Integer.valueOf(ingredient.get("ingredient"))).get());
      ingredientListRepository.save(list);
    }
  }

  private ImmutableList<Unit> getUnitsList() {
    if (this.unitsList == null) {
      this.unitsList = ImmutableList.copyOf(unitRepository.findAllByOrderByNameAsc());
    }
    return this.unitsList;
  }
}
