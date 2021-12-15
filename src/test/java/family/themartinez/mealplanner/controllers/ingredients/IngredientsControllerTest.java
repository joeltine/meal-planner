package family.themartinez.mealplanner.controllers.ingredients;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Sql({"/test-schema.sql", "/test-data.sql"})
@ActiveProfiles("test")
public class IngredientsControllerTest {
  @Autowired private MockMvc mockMvc;

  @Test
  public void getIngredientsShouldReturnResults() throws Exception {
    this.mockMvc
        .perform(get("/ingredients").param("q", "pot"))
        .andExpect(status().isOk())
        .andExpect(content().json("{}"));
  }
}
