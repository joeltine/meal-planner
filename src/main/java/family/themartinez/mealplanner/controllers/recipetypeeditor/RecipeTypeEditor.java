package family.themartinez.mealplanner.controllers.recipetypeeditor;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RecipeTypeEditor {
  @GetMapping("/recipeTypeEditor")
  public String getRecipeTypeEditor() {
    return "recipetypeeditor/recipeTypeEditor";
  }
}
