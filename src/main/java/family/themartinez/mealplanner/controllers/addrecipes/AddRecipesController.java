package family.themartinez.mealplanner.controllers.addrecipes;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AddRecipesController {
  private static final String PATH = "/addrecipes";

  @GetMapping(PATH)
  public String addRecipePage(Model model) {
    return "addrecipes/addrecipes";
  }
}
