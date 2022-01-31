package family.themartinez.mealplanner.controllers.recipecategorieseditor;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RecipeCategoriesEditor {
  @GetMapping("/recipeCategoriesEditor")
  public String getRecipeCategoriesEditorPage() {
    return "recipecategorieseditor/recipeCategoriesEditor";
  }
}
