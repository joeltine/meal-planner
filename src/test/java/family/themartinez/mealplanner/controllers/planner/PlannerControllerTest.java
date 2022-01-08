package family.themartinez.mealplanner.controllers.planner;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import family.themartinez.mealplanner.data.ingredientlists.IngredientList;
import family.themartinez.mealplanner.data.ingredientlists.IngredientListRepository;
import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
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
class PlannerControllerTest {

  @Autowired private UnitRepository unitRepository;
  @Autowired private IngredientRepository ingredientRepository;
  @Autowired private RecipeRepository recipeRepository;
  @Autowired private IngredientListRepository ingredientListRepository;
  @Autowired private MockMvc mockMvc;

  private Unit grams;
  private Unit pounds;
  private Unit teaspoons;
  private Unit tablespoons;
  private Unit liters;

  private Ingredient peanutButter;
  private Ingredient jelly;
  private Ingredient bread;

  @BeforeEach
  void setUp() {
    this.populateUnitRepository();
    this.populateIngredientRepository();
    this.populateRecipeAndIngredientListRepository();
  }

  @AfterEach
  void tearDown() {
    ingredientListRepository.deleteAll();
    ingredientRepository.deleteAll();
    recipeRepository.deleteAll();
    unitRepository.deleteAll();
  }

  private void populateIngredientRepository() {
    Ingredient milk = new Ingredient();
    milk.setName("Whole milk");
    Ingredient chicken = new Ingredient();
    chicken.setName("Chicken breast, raw");
    Ingredient water = new Ingredient();
    water.setName("Water");
    peanutButter = new Ingredient();
    peanutButter.setName("Peanut butter");
    jelly = new Ingredient();
    jelly.setName("Jelly");
    bread = new Ingredient();
    bread.setName("Bread");
    ingredientRepository.saveAll(List.of(milk, chicken, water, peanutButter, jelly, bread));
  }

  private void populateUnitRepository() {
    grams = new Unit();
    grams.setName("grams");
    pounds = new Unit();
    pounds.setName("pounds");
    teaspoons = new Unit();
    teaspoons.setName("teaspoons");
    tablespoons = new Unit();
    tablespoons.setName("tablespoons");
    liters = new Unit();
    liters.setName("liters");
    unitRepository.saveAll(List.of(grams, pounds, teaspoons, tablespoons, liters));
  }

  private void populateRecipeAndIngredientListRepository() {
    Recipe pbj = new Recipe();
    pbj.setName("Peanut butter and jelly");
    pbj.setDescription("A classic sandwich");
    pbj.setInstructions("Spread on bread and smash together");
    pbj.setPrepTimeMin(20);
    pbj.setCookTimeMin(30);
    recipeRepository.saveAll(List.of(pbj));
    IngredientList pbList = new IngredientList();
    pbList.setUnit(grams);
    pbList.setQuantity(6.0);
    pbList.setRecipe(pbj);
    pbList.setIngredient(peanutButter);
    IngredientList jellyList = new IngredientList();
    jellyList.setUnit(grams);
    jellyList.setQuantity(6.0);
    jellyList.setRecipe(pbj);
    jellyList.setIngredient(jelly);
    IngredientList breadList = new IngredientList();
    breadList.setUnit(grams);
    breadList.setQuantity(32.0);
    breadList.setRecipe(pbj);
    breadList.setIngredient(bread);
    ingredientListRepository.saveAll(List.of(pbList, jellyList, breadList));
  }

  @Test
  public void getReturnsMainPageForCorrectPaths() throws Exception {
    this.mockMvc.perform(get("/planner")).andExpect(status().isOk());
    this.mockMvc.perform(get("/")).andExpect(status().isOk());
  }

  // TOOD: Write tests for me when implemented.
}
