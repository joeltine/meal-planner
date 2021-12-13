package family.themartinez.mealplanner.addrecipes;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AddRecipesController {
  private static final String PATH = "/addrecipes";

  @GetMapping(PATH)
  public String planner() {
    return "addrecipes/addrecipes";
  }

  @PutMapping(path = PATH, produces = "text/plain")
  public @ResponseBody String putRecipe() {
    return "Success!";
  }
}
