package family.themartinez.mealplanner.controllers.addrecipes;

import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AddRecipesControllerTest {

  @Autowired private UnitRepository unitRepository;

  @Autowired private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    Unit grams = new Unit();
    grams.setName("grams");
    grams.setCreatedAt(Instant.now());
    Unit pounds = new Unit();
    pounds.setName("pounds");
    pounds.setCreatedAt(Instant.now());
    Unit teaspoons = new Unit();
    teaspoons.setName("teaspoons");
    teaspoons.setCreatedAt(Instant.now());
    Unit tablespoons = new Unit();
    tablespoons.setName("tablespoons");
    tablespoons.setCreatedAt(Instant.now());
    Unit liters = new Unit();
    liters.setName("liters");
    liters.setCreatedAt(Instant.now());
    unitRepository.saveAll(List.of(grams, pounds, teaspoons, tablespoons, liters));
  }

  @AfterEach
  void tearDown() {
    unitRepository.deleteAll();
  }

  @Test
  public void pageRendersUnitsSelectList() throws Exception {
    this.mockMvc
        .perform(get("/addrecipes"))
        .andExpect(status().isOk())
        .andExpect(content().contentType("text/html;charset=UTF-8"))
        .andExpect(
            model()
                .attribute(
                    "units", contains("grams", "liters", "pounds", "tablespoons", "teaspoons")));
  }
}
