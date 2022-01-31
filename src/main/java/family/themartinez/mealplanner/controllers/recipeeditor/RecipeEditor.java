package family.themartinez.mealplanner.controllers.recipeeditor;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RecipeEditor {

  @GetMapping("/recipeEditor")
  public String getRecipeEditorPage() {
    return "recipeeditor/recipeEditor";
  }
}
