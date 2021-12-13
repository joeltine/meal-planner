package family.themartinez.mealplanner.addrecipes;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AddRecipesController {
  private static final String PATH = "/addrecipes";

  private final JdbcTemplate jdbcTemplate;

  public AddRecipesController(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @GetMapping(PATH)
  public String planner() {
    return "addrecipes/addrecipes";
  }

  @PutMapping(path = PATH, produces = "application/json")
  public @ResponseBody List<String> putRecipe() {
    return this.jdbcTemplate.queryForList("SELECT * FROM recipes").stream()
        .map(m -> m.values().toString())
        .collect(Collectors.toList());
  }
}
