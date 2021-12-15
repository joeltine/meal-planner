package family.themartinez.mealplanner.ingredients;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
  public List<Map<String, String>> getIngredients(@RequestParam(name = "q") String query) {
    return this.jdbcTemplate
        .queryForList(
            "SELECT id, name FROM ingredients WHERE name LIKE ? LIMIT 10",
            new String[] {String.format("%%%s%%", query)})
        .stream()
        .map(
            e -> {
              Map<String, String> map = new HashMap<>();
              for (Map.Entry x : e.entrySet()) {
                if (x.getKey().equals("id")) {
                  map.put("value", (String) x.getValue());
                } else if (x.getKey().equals("name")) {
                  map.put("text", (String) x.getValue());
                }
              }
              return map;
            })
        .collect(Collectors.toList());
  }
}
