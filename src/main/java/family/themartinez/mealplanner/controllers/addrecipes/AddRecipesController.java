package family.themartinez.mealplanner.controllers.addrecipes;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.units.UnitRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AddRecipesController {
  private static final String PATH = "/addrecipes";

  private final UnitRepository unitRepository;
  private final ImmutableList<String> unitsList;

  public AddRecipesController(UnitRepository unitRepository) {
    this.unitRepository = unitRepository;
    this.unitsList = getUnitsList();
  }

  @GetMapping(PATH)
  public String planner(Model model) {
    model.addAttribute("units", this.unitsList);
    return "addrecipes/addrecipes";
  }

  private ImmutableList<String> getUnitsList() {
    return ImmutableList.copyOf(unitRepository.findDistinctName());
  }

  @PutMapping(path = PATH, produces = "application/json")
  public @ResponseBody String putRecipe() {
    return "Success";
  }
}
