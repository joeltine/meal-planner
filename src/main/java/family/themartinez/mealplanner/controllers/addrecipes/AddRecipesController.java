package family.themartinez.mealplanner.controllers.addrecipes;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.units.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AddRecipesController {
  private static final String PATH = "/addrecipes";

  @Autowired private UnitRepository unitRepository;

  private ImmutableList<String> unitsList;

  @GetMapping(PATH)
  public String planner(Model model) {
    model.addAttribute("units", getUnitsList());
    return "addrecipes/addrecipes";
  }

  @PutMapping(path = PATH, produces = "application/json")
  public @ResponseBody String putRecipe() {
    return "Success";
  }

  private ImmutableList<String> getUnitsList() {
    if (this.unitsList == null) {
      this.unitsList = ImmutableList.copyOf(unitRepository.findDistinctName());
    }
    return this.unitsList;
  }
}
