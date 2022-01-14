package family.themartinez.mealplanner.controllers.ingredienteditor;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IngredientEditor {

  @GetMapping("/ingredientEditor")
  public String getIngredientEditorPage() {
    return "ingredienteditor/ingredientEditor";
  }
}
