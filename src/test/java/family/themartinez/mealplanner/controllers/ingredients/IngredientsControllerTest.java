package family.themartinez.mealplanner.controllers.ingredients;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.matchesPattern;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import java.time.Instant;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class IngredientsControllerTest {
  @Autowired private MockMvc mockMvc;

  @Autowired private IngredientRepository ingredientRepository;

  @BeforeEach
  public void setupTest() {
    Ingredient potato = new Ingredient();
    potato.setName("Potato, raw");
    potato.setCategory("Vegetable, potato");
    potato.setDescription("It's a potato.");
    potato.setCreatedAt(Instant.now());
    ingredientRepository.save(potato);

    Ingredient chicken = new Ingredient();
    chicken.setName("Chicken, raw");
    chicken.setCategory("Raw chicken");
    chicken.setDescription("Bawk Bawk");
    chicken.setCreatedAt(Instant.now());
    ingredientRepository.save(chicken);

    Ingredient tomato = new Ingredient();
    tomato.setName("Sliced tomatoes");
    tomato.setCategory("Vegetable");
    tomato.setDescription("Vine ripened");
    tomato.setCreatedAt(Instant.now());
    ingredientRepository.save(tomato);

    Ingredient chips = new Ingredient();
    chips.setName("Sour cream and onion potato chips");
    chips.setCategory("Deep friend snack");
    chips.setDescription("Lays");
    chips.setCreatedAt(Instant.now());
    ingredientRepository.save(chips);
  }

  @AfterEach
  public void teardownTest() {
    ingredientRepository.deleteAll();
  }

  @Test
  public void getIngredientsShouldReturnResults() throws Exception {
    this.mockMvc
        .perform(get("/ingredients").param("q", "pot"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$[0].text", equalTo("Potato, raw")))
        .andExpect(jsonPath("$[0].value", matchesPattern("\\d+")))
        .andExpect(jsonPath("$[1].text", equalTo("Sour cream and onion potato chips")))
        .andExpect(jsonPath("$[1].value", matchesPattern("\\d+")));
  }

  @Test
  public void getIngredientsNoMatchesReturnsEmptyArray() throws Exception {
    this.mockMvc
        .perform(get("/ingredients").param("q", "zooba"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(content().json("[]"));
  }

  @Test
  public void getIngredientsOnlyReturnsTop10Results() throws Exception {
    for (int i = 0; i < 15; i++) {
      Ingredient newCandy = new Ingredient();
      newCandy.setName(String.format("Candy%s", i));
      newCandy.setCategory("Sweet treat");
      newCandy.setDescription("Another candy");
      newCandy.setCreatedAt(Instant.now());
      ingredientRepository.save(newCandy);
    }
    assertTrue(ingredientRepository.count() > 10);
    this.mockMvc
        .perform(get("/ingredients").param("q", "candy"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(10)))
        .andExpect(jsonPath("$..text", everyItem(matchesPattern("Candy\\d"))))
        .andExpect(jsonPath("$..value", everyItem(matchesPattern("\\d+"))));
  }

  @Test
  public void getIngredientsMissingQueryThrowsError() throws Exception {
    this.mockMvc.perform(get("/ingredients")).andExpect(status().is4xxClientError());
  }
}
