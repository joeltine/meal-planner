package family.themartinez.mealplanner.controllers.addrecipes;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.ingredientlists.IngredientList;
import family.themartinez.mealplanner.data.ingredientlists.IngredientListRepository;
import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import family.themartinez.mealplanner.scraper.ExternalRecipeScraper;
import family.themartinez.mealplanner.scraper.ScrapedRecipe;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
class AddRecipesControllerTest {

  @Autowired private UnitRepository unitRepository;
  @Autowired private IngredientRepository ingredientRepository;
  @Autowired private RecipeRepository recipeRepository;
  @Autowired private IngredientListRepository ingredientListRepository;
  @Autowired private MockMvc mockMvc;

  @MockBean ExternalRecipeScraper scraperMock;

  private static String fetaBurgersJson;
  private static String beefWellingtonJson;

  private ObjectMapper mapper = new ObjectMapper();

  @BeforeAll
  static void beforeAll() throws IOException {
    fetaBurgersJson =
        Files.readString(
            Path.of(
                System.getProperty("user.dir"),
                "src/test/java/family/themartinez/mealplanner/controllers/addrecipes/feta_burgers_recipe_test.json"));

    beefWellingtonJson =
        Files.readString(
            Path.of(
                System.getProperty("user.dir"),
                "src/test/java/family/themartinez/mealplanner/controllers/addrecipes/beef_wellington_recipe_test.json"));
  }

  @BeforeEach
  void setUp() {
    populateUnitRepository();
    populateIngredientRepository();
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
    // TODO: Populate ingredientRepository with a lot more ingredients.
    ingredientRepository.saveAll(List.of(milk, chicken, water));
  }

  private void populateUnitRepository() {
    Unit grams = new Unit();
    grams.setName("grams");
    Unit ounces = new Unit();
    ounces.setName("ounces");
    Unit pounds = new Unit();
    pounds.setName("pounds");
    Unit sprigs = new Unit();
    sprigs.setName("sprigs");
    Unit pints = new Unit();
    pints.setName("pints");
    Unit teaspoons = new Unit();
    teaspoons.setName("teaspoons");
    Unit tablespoons = new Unit();
    tablespoons.setName("tablespoons");
    Unit liters = new Unit();
    liters.setName("liters");
    Unit slices = new Unit();
    slices.setName("slices");
    unitRepository.saveAll(
        List.of(grams, pounds, teaspoons, tablespoons, liters, slices, pints, sprigs, ounces));
  }

  @Test
  public void putAddsNewRecipeAllFieldsPresent() throws Exception {
    ImmutableList<Unit> units = ImmutableList.copyOf(unitRepository.findAll());
    ImmutableList<Ingredient> ingredients = ImmutableList.copyOf(ingredientRepository.findAll());

    this.mockMvc
        .perform(
            put("/addrecipes")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"name\": \"Chicken soup\", \"description\": \"Some delicious soup\", "
                        + "\"prepTime\": \"20\", \"cookTime\": \"30\", "
                        + "\"externalLink\": \"https://www.example.com/\", "
                        + "\"categories\": [\"breakfast\", \"mexican\"], "
                        + "\"instructions\": \"Do some stuff\", \"ingredients\": "
                        + "[{\"quantity\": \"1\", \"unit\": \""
                        + units.get(0).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(0).getId()
                        + "\"},"
                        + "{\"quantity\": \"42.5\", \"unit\": \""
                        + units.get(1).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(1).getId()
                        + "\"},"
                        + "{\"quantity\": \".75\", \"unit\": \""
                        + units.get(2).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(2).getId()
                        + "\", \"displayName\": \"pure water, mixed\"}"
                        + "]}"))
        .andExpect(status().isOk());

    ImmutableList<Recipe> recipeList = ImmutableList.copyOf(recipeRepository.findAll());
    assertEquals(1, recipeList.size());

    Recipe chickenSoup = recipeList.get(0);
    assertEquals("Chicken soup", chickenSoup.getName());
    assertEquals("Some delicious soup", chickenSoup.getDescription());
    assertEquals("Do some stuff", chickenSoup.getInstructions());
    assertEquals(20, chickenSoup.getPrepTimeMin());
    assertEquals(30, chickenSoup.getCookTimeMin());
    assertEquals("https://www.example.com/", chickenSoup.getExternalLink());
    assertEquals(ImmutableList.of("breakfast", "mexican"), chickenSoup.getCategories());

    ImmutableList<IngredientList> ingredientLists =
        ImmutableList.copyOf(ingredientListRepository.findAll());
    assertEquals(3, ingredientLists.size());
    IngredientList list1 = ingredientLists.get(0);
    assertEquals(chickenSoup.getId(), list1.getRecipe().getId());
    assertEquals(units.get(0).getId(), list1.getUnit().getId());
    assertEquals(ingredients.get(0).getId(), list1.getIngredient().getId());
    assertEquals(1, list1.getQuantity());
    assertNull(list1.getIngredientDisplayName());

    IngredientList list2 = ingredientLists.get(1);
    assertEquals(chickenSoup.getId(), list2.getRecipe().getId());
    assertEquals(units.get(1).getId(), list2.getUnit().getId());
    assertEquals(ingredients.get(1).getId(), list2.getIngredient().getId());
    assertEquals(42.5, list2.getQuantity());
    assertNull(list2.getIngredientDisplayName());

    IngredientList list3 = ingredientLists.get(2);
    assertEquals(chickenSoup.getId(), list3.getRecipe().getId());
    assertEquals(units.get(2).getId(), list3.getUnit().getId());
    assertEquals(ingredients.get(2).getId(), list3.getIngredient().getId());
    assertEquals(.75, list3.getQuantity());
    assertEquals("pure water, mixed", list3.getIngredientDisplayName());
  }

  @Test
  public void putAddsNewRecipeOnlyRequiredFields() throws Exception {
    ImmutableList<Unit> units = ImmutableList.copyOf(unitRepository.findAll());
    ImmutableList<Ingredient> ingredients = ImmutableList.copyOf(ingredientRepository.findAll());

    this.mockMvc
        .perform(
            put("/addrecipes")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"name\": \"Chicken soup\", "
                        + "\"prepTime\": \"20\", \"cookTime\": \"30\", "
                        + "\"instructions\": \"Do some stuff\", \"ingredients\": "
                        + "[{\"quantity\": \"1\", \"unit\": \""
                        + units.get(0).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(0).getId()
                        + "\"},"
                        + "{\"quantity\": \"42.5\", \"unit\": \""
                        + units.get(1).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(1).getId()
                        + "\"},"
                        + "{\"quantity\": \".75\", \"unit\": \""
                        + units.get(2).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(2).getId()
                        + "\"}"
                        + "]}"))
        .andExpect(status().isOk());

    ImmutableList<Recipe> recipeList = ImmutableList.copyOf(recipeRepository.findAll());
    assertEquals(1, recipeList.size());

    Recipe chickenSoup = recipeList.get(0);
    assertEquals("Chicken soup", chickenSoup.getName());
    assertNull(chickenSoup.getDescription());
    assertEquals("Do some stuff", chickenSoup.getInstructions());
    assertEquals(20, chickenSoup.getPrepTimeMin());
    assertEquals(30, chickenSoup.getCookTimeMin());
    assertNull(chickenSoup.getExternalLink());
    assertEquals(ImmutableList.of(), chickenSoup.getCategories());

    ImmutableList<IngredientList> ingredientLists =
        ImmutableList.copyOf(ingredientListRepository.findAll());
    assertEquals(3, ingredientLists.size());
    IngredientList list1 = ingredientLists.get(0);
    assertEquals(chickenSoup.getId(), list1.getRecipe().getId());
    assertEquals(units.get(0).getId(), list1.getUnit().getId());
    assertEquals(ingredients.get(0).getId(), list1.getIngredient().getId());
    assertEquals(1, list1.getQuantity());
    assertNull(list1.getIngredientDisplayName());

    IngredientList list2 = ingredientLists.get(1);
    assertEquals(chickenSoup.getId(), list2.getRecipe().getId());
    assertEquals(units.get(1).getId(), list2.getUnit().getId());
    assertEquals(ingredients.get(1).getId(), list2.getIngredient().getId());
    assertEquals(42.5, list2.getQuantity());
    assertNull(list2.getIngredientDisplayName());

    IngredientList list3 = ingredientLists.get(2);
    assertEquals(chickenSoup.getId(), list3.getRecipe().getId());
    assertEquals(units.get(2).getId(), list3.getUnit().getId());
    assertEquals(ingredients.get(2).getId(), list3.getIngredient().getId());
    assertEquals(.75, list3.getQuantity());
    assertNull(list3.getIngredientDisplayName());
  }

  @Test
  public void pageRendersUnitsSelectList() throws Exception {
    MvcResult result =
        this.mockMvc
            .perform(get("/addrecipes"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("text/html;charset=UTF-8"))
            .andReturn();

    String html = result.getResponse().getContentAsString();
    Document doc = Jsoup.parse(html);
    Elements options = doc.getElementById("inputUnit").children();
    assertEquals("grams", options.get(1).text());
    assertEquals("liters", options.get(2).text());
    assertEquals("ounces", options.get(3).text());
    assertEquals("pints", options.get(4).text());
    assertEquals("pounds", options.get(5).text());
    assertEquals("slices", options.get(6).text());
    assertEquals("sprigs", options.get(7).text());
    assertEquals("tablespoons", options.get(8).text());
    assertEquals("teaspoons", options.get(9).text());
  }

  @Test
  public void scrapeRecipeShouldReturnResults() throws Exception {
    ScrapedRecipe scrapedRecipe = mapper.readValue(fetaBurgersJson, ScrapedRecipe.class);
    when(scraperMock.scrapeRecipe(any())).thenReturn(scrapedRecipe);
    MvcResult result =
        this.mockMvc
            .perform(get("/scrapeRecipe").param("url", "https://www.recipes.com/cheeseburgers"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andReturn();
    MockHttpServletResponse response = result.getResponse();
    verify(scraperMock).scrapeRecipe("https://www.recipes.com/cheeseburgers");
    // TODO: Finish writing tests.

  }

  // TODO: Write more unit tests against scrapeRecipe logic.
}
