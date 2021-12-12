package family.themartinez.mealplanner.addrecipes;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AddRecipesController {

  @GetMapping("/addrecipes")
  public String planner() {
    return "addrecipes/addrecipes";
  }
}
