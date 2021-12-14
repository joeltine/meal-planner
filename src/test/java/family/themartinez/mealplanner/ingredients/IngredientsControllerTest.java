package family.themartinez.mealplanner.ingredients;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

// @WebMvcTest(IngredientsController.class)
@JdbcTest
@Sql({"schema.sql", "test-data.sql"})
public class IngredientsControllerTest {
  @Autowired private MockMvc mockMvc;

  @Autowired private JdbcTemplate jdbcTemplate;

  @Test
  public void getIngredientsShouldReturnResults() throws Exception {
    this.mockMvc
        .perform(get("/ingredients?pot"))
        .andExpect(status().isOk())
        .andExpect(content().json("[]"));
  }
}
