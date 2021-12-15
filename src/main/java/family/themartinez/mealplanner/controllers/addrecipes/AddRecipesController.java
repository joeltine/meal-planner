package family.themartinez.mealplanner.controllers.addrecipes;

import com.google.common.collect.ImmutableList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AddRecipesController {
  private static final String PATH = "/addrecipes";

  private final JdbcTemplate jdbcTemplate;

  private ImmutableList unitsList;

  public AddRecipesController(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
    this.unitsList = getUnitsList();
  }

  @GetMapping(PATH)
  public String planner(Model model) {
    model.addAttribute("units", this.unitsList);
    return "addrecipes/addrecipes";
  }

  private ImmutableList getUnitsList() {
    return this.jdbcTemplate.queryForList("SELECT name FROM units ORDER BY name ASC").stream()
        .map(m -> m.get("NAME"))
        .collect(ImmutableList.toImmutableList());
  }

  @PutMapping(path = PATH, produces = "application/json")
  public @ResponseBody List<String> putRecipe() {
    return this.jdbcTemplate.queryForList("SELECT * FROM recipes").stream()
        .map(m -> m.values().toString())
        .collect(Collectors.toList());
  }
}
