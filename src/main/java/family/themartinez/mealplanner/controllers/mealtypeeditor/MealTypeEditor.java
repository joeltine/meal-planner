package family.themartinez.mealplanner.controllers.mealtypeeditor;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MealTypeEditor {

  @GetMapping("/mealTypeEditor")
  public String getMealTypeEditorPage() {
    return "mealtypeeditor/mealTypeEditor";
  }
}
