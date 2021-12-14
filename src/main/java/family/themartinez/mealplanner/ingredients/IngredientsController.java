package family.themartinez.mealplanner.ingredients;

import com.google.common.collect.ImmutableList;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IngredientsController {

  private final JdbcTemplate jdbcTemplate;

  public IngredientsController(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @GetMapping("/ingredients")
  public List<Map<String, Object>> getIngredients(@RequestParam(name = "q") String query) {
    String sql =
        String.format("SELECT id, name FROM ingredients WHERE name LIKE '%%%s%%' LIMIT 30", query);
    List<Map<String, Object>> results = this.jdbcTemplate.queryForList(sql);
    ImmutableList.Builder newResults = ImmutableList.builder();

    return newResults.build();
  }
}
